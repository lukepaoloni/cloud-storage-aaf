import { Repository, EntityRepository, ObjectID } from 'typeorm';
import { File as FileEntity, File } from './file.model';
import { User } from '@user';

@EntityRepository(FileEntity)
export class FileRepository extends Repository<FileEntity> {
    public async getByTypes(
        types: string[],
    ): Promise<FileEntity[] | null> {
        const files = [];
        types.map(async type => {
            const filesWithType = await this.find({ where: { type } });
            filesWithType.map(fileWithType => {
                files.push(fileWithType);
            });
        });

        return files;
    }

    public async fileExists(name: string): Promise<false | File> {
        const file = await this.getByName(name);
        if (file) {
            return file;
        }
        return false;
    }

    public async getByName(name: string): Promise<FileEntity | null> {
        return await this.findOne({ where: { name } });
    }

    public async getByAuthor(author: User) {
        return 'Get the files by an author.';
    }

    public async getByDate(date: Date) {
        return 'Get the files by date.';
    }

    public async getByLocation(location: string) {
        return 'Get the files at a location.';
    }

    public async getByProject(project: string) {
        return 'Get the files registered to a project';
    }

    public async getAll() {
        const files = await this.find({
            order: {
                created_at: 'ASC',
            },
        });
        const formattedFiles = files.map(file => {
            return file.toJson();
        });
        return formattedFiles;
    }

    public async findById(id: string): Promise<FileEntity> {
        return await this.findOneOrFail(id);
    }

    public async findByObjectId(id: ObjectID) {
        return await this.findOneOrFail(id);
    }
}
