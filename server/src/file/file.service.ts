import {
  Injectable,
  Inject,
  NotAcceptableException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileRepository } from "./file.repository";
import { FileDto } from "./file.dto";
import { UserRepository } from "@user/user.repository";
import { History } from "@history";
import { HistoryService } from "@history";
import { File } from "./file.model";
import { Status } from "./enum/status";
import { remove } from "@shared/helpers/file";
import { AlgoliaService } from "../algolia/algolia.service";
import { UserDTO } from "@shared/interfaces/user.dto";
import { pick } from "underscore";
import { DeepPartial } from "typeorm";
import { TagService } from "../tag/tag.service";

@Injectable()
export class FileService {
  private static statuses = ["archived", "active"];
  private algoliaService: AlgoliaService;

  constructor(
    @InjectRepository(FileRepository)
    private fileRepository: FileRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private historyService: HistoryService,
    private tagService: TagService
  ) {
    this.algoliaService = new AlgoliaService("files");
  }

  public isCheckedIn(email: string, file: File) {
    if (file.currentUserCheckedIn) {
      if (file.currentUserCheckedIn.email === email) {
        return true;
      }
      throw new ForbiddenException(
        `${
          file.currentUserCheckedIn.email
        } has currently checked this file in. You're not able to check it in & upload an updated file until this user has checked the file out.`
      );
    }
    throw new UnauthorizedException(
      `You must check the file in before updating the file.`
    );
  }

  public async getAll(email?: string, showHistory = true) {
    if (email) {
      const user = await this.userRepository.getByEmail(email);
      if (user && user.role === "admin") {
        return await this.fileRepository.getAll();
      }
    }
    const files = await this.fileRepository.find({
      where: {
        status: "active" || undefined
      },
      order: {
        created_at: "ASC"
      }
    });
    const formattedFiles = files.map(file => {
      return file.toJson(showHistory);
    });
    return formattedFiles;
  }

  public async sync() {
    const files = await this.fileRepository.getAll();
    await this.algoliaService.clearIndex();
    for (const file of files) {
      await this.algoliaService.save({ objectID: file._id, ...file });
    }
    return {
      success: true,
      message: `Successfully synced ${files.length} files across.`
    };
  }

  public async restrictedDelete(id: string, email: string) {
    const user = await this.userRepository.getByEmail(email);
    const file = await this.fileRepository.findById(id);
    if (file && user) {
      if (user.role === "admin") {
        remove(file.path.split(`v${file.version}`).shift());
        await this.fileRepository.delete(id);
        await this.algoliaService.delete(id);
        return {
          success: true,
          message: "Successfully deleted the file."
        };
      } else {
        return await this.archive(id, email, { status: "archived" });
      }
    }
    throw new NotFoundException("Not found user or file provided.");
  }

  public async getOneById(id: string) {
    return await this.fileRepository.findOneOrFail(id);
  }

  public async getFileHistoryById(id: string) {
    const file = await this.fileRepository.findById(id);
    return file.history;
  }

  public async getFileVersionById(id: string) {
    const file = await this.fileRepository.findById(id);
    return { version: file.version };
  }

  public async archive(
    id: string,
    email: string,
    body: { status: "active" | "archived" }
  ) {
    const file = await this.getOneById(id);
    const user = await this.userRepository.getByEmail(email);
    if (file && user) {
      if (FileService.statuses.includes(body.status)) {
        file.status = body.status;
        await this.fileRepository.update(id, file);
        await this.algoliaService.update({ ...file, objectID: id });
        return {
          success: true,
          message: `Successfully set the status of the file to ${file.status}.`
        };
      }
      return {
        success: false,
        message:
          "Unable to change the status of the file. The status can only be active or archived."
      };
    }
    return {
      success: false,
      message:
        "Oops! Something went wrong. Please check the user/file provided."
    };
  }

  public async checkInOrOut(id: string, email: string, body: any) {
    const file = await this.getOneById(id);
    const user = await this.userRepository.getByEmail(email);
    if (file.currentUserCheckedIn) {
      if (file.currentUserCheckedIn.email !== email) {
        throw new NotAcceptableException(
          `The file is checked in by ${
            file.currentUserCheckedIn.email
          }. You're unable to check it in/out.`
        );
      }
      if (file.currentUserCheckedIn.status === body.status) {
        throw new NotAcceptableException(
          `The file is already ${file.currentUserCheckedIn.status}.`
        );
      }
    }
    if (body.status === Status.checkIn) {
      file.currentUserCheckedIn = {
        email: user.email,
        status: Status.checkIn
      };
    } else if (body.status === Status.checkOut) {
      file.currentUserCheckedIn = null;
    } else {
      throw new NotAcceptableException(
        `Body must contain a status which is one of these: ${Status.checkIn}, ${
          Status.checkOut
        }`
      );
    }
    delete file._id;

    await this.fileRepository.update(id, file);
    return {
      success: true,
      message: `Successfully changed the status of the file to ${body.status}`
    };
  }

  public async update(
    id: string,
    data: Partial<File>,
    email?: string,
    history?: Partial<History>
  ) {
    let file = await this.fileRepository.findOne(id);
    let tags = [];
    if (data.currentUserCheckedIn) {
      delete data.currentUserCheckedIn;
    }
    if (data.status) {
      delete data.status;
    }
    Object.assign(file, data);
    file.updated_at = new Date();
    if (data.tags) {
      if (typeof data.tags === "string") {
        tags = JSON.parse(data.tags);
      } else if (typeof data.tags === "object") {
        tags = data.tags;
      }
      file.tags = tags.map(tag => ({
        code: tag.title.toLowerCase().replace(/ /g, "_"),
        title: tag.title
      }));

      for (const tag of file.tags) {
        const fileExists = await this.tagService.tagExists(tag.code);
        if (!fileExists) {
          await this.tagService.create({ title: tag.title });
        }
      }
    }
    if (history) {
      const user = await this.userRepository.getByEmail(email);
      history.author = user;
      history.tags = file.tags;
      history.title = file.title;
      history.created_at = new Date();
      file.addToHistory(history as History);
    }
    await this.algoliaService.update({ ...file, objectID: file._id });
    await this.fileRepository.update(id, file);
    file = await this.fileRepository.findOne(id);
    return { ...file.toJson(), success: true, id };
  }

  public async save(file: File) {
    const newFile = await this.fileRepository.save(file);
    await this.algoliaService.save(newFile);
    return newFile;
  }

  public async createRaw(body: Partial<File>) {
    const file = this.fileRepository.create();
    file.setData(body);
    return await this.fileRepository.save(file);
  }

  public async create(
    email: string,
    body: Partial<FileDto>,
    json: boolean = true
  ) {
    const user = await this.userRepository.getByEmail(email);
    const formattedUser = pick(user, "id", "email", "name") as UserDTO;
    let tags = [];
    let file = await this.fileRepository.fileExists(body.name);
    let response = { success: false, message: "Unable to create file." };
    let fileId = null;

    if (body.tags) {
      if (typeof body.tags === "string") {
        tags = JSON.parse(body.tags);
      } else if (typeof body.tags === "object") {
        tags = body.tags;
      }
      body.tags = tags.map(tag => ({
        code: tag.title.toLowerCase().replace(/ /g, "_"),
        title: tag.title
      }));
      for (const tag of body.tags) {
        await this.tagService.create({ title: tag.title });
      }
    }
    const history = new History({ ...body });
    history.author = formattedUser;
    if (!file) {
      file = await this.fileRepository.create();
      file.setData({
        ...body,
        original_author: formattedUser,
        version: 1,
        status: "active"
      });
      history.version = file.version;
      file = await this.fileRepository.save(file);
      response = { success: true, message: "File created successfully." };
      fileId = file._id;
    } else {
      // File exists, so we must add it to the history
      const version = file.getLastVersion() + 1;

      history.version = version;
      file.setData({ ...body, version });
      fileId = file._id;
      delete file._id;
      await this.fileRepository.update(fileId, file);

      response = { success: true, message: "Versioned file successfully." };
    }
    history.tags = body.tags;
    history.title = body.title;
    const newHistory = await this.historyService.create(history);

    file.addToHistory(newHistory);
    delete file._id;
    await this.fileRepository.update({ _id: fileId }, file);
    await this.algoliaService.save({ ...file, objectID: fileId });
    if (!json) {
      return await this.fileRepository.findOne({ _id: fileId });
    }
    return {
      ...file,
      author: user.toJson(false),
      ...response
    };
  }

  public async changeVersion(
    id: string,
    email: string,
    body: { version: number }
  ) {
    const file = await this.fileRepository.findById(id);
    const user = await this.userRepository.getByEmail(email); // Use for history log

    if (!file.restoreVersion(body.version)) {
      throw new NotFoundException(
        `Version ${body.version} does not exist for the file ${file.name}.`
      );
    }
    await this.fileRepository.update(id, file);
    return {
      success: true,
      message: `Successfully changed the version to ${body.version}.`
    };
  }
}
