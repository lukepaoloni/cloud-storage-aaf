"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var FileService_1;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const file_repository_1 = require("./file.repository");
const user_repository_1 = require("@user/user.repository");
const _history_1 = require("@history");
const _history_2 = require("@history");
const status_1 = require("./enum/status");
const file_1 = require("@shared/helpers/file");
const algolia_service_1 = require("../algolia/algolia.service");
const underscore_1 = require("underscore");
const tag_service_1 = require("../tag/tag.service");
let FileService = FileService_1 = class FileService {
    constructor(fileRepository, userRepository, historyService, tagService) {
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
        this.historyService = historyService;
        this.tagService = tagService;
        this.algoliaService = new algolia_service_1.AlgoliaService('files');
    }
    isCheckedIn(email, file) {
        if (file.currentUserCheckedIn) {
            if (file.currentUserCheckedIn.email === email) {
                return true;
            }
            throw new common_1.ForbiddenException(`${file.currentUserCheckedIn.email} has currently checked this file in. You're not able to check it in & upload an updated file until this user has checked the file out.`);
        }
        throw new common_1.UnauthorizedException(`You must check the file in before updating the file.`);
    }
    getAll(email, showHistory = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (email) {
                const user = yield this.userRepository.getByEmail(email);
                if (user && user.role === 'admin') {
                    return yield this.fileRepository.getAll();
                }
            }
            const files = yield this.fileRepository.find({
                where: {
                    status: 'active' || undefined,
                },
            });
            const formattedFiles = files.map(file => {
                return file.toJson(showHistory);
            });
            return formattedFiles;
        });
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield this.fileRepository.getAll();
            yield this.algoliaService.clearIndex();
            for (const file of files) {
                yield this.algoliaService.save(Object.assign({ objectID: file._id }, file));
            }
            return {
                success: true,
                message: `Successfully synced ${files.length} files across.`,
            };
        });
    }
    restrictedDelete(id, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.getByEmail(email);
            const file = yield this.fileRepository.findById(id);
            if (file && user) {
                if (user.role === 'admin') {
                    file_1.remove(file.path.split(`v${file.version}`).shift());
                    yield this.fileRepository.delete(id);
                    yield this.algoliaService.delete(id);
                    return {
                        success: true,
                        message: 'Successfully deleted the file.',
                    };
                }
                else {
                    return yield this.archive(id, email, { status: 'archived' });
                }
            }
            throw new common_1.NotFoundException('Not found user or file provided.');
        });
    }
    getOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fileRepository.findOneOrFail(id);
        });
    }
    getFileHistoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.fileRepository.findById(id);
            return file.history;
        });
    }
    getFileVersionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.fileRepository.findById(id);
            return { version: file.version };
        });
    }
    archive(id, email, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.getOneById(id);
            const user = yield this.userRepository.getByEmail(email);
            if (file && user) {
                if (FileService_1.statuses.includes(body.status)) {
                    file.status = body.status;
                    yield this.fileRepository.update(id, file);
                    yield this.algoliaService.update(Object.assign({}, file, { objectID: id }));
                    return {
                        success: true,
                        message: `Successfully set the status of the file to ${file.status}.`,
                    };
                }
                return {
                    success: false,
                    message: 'Unable to change the status of the file. The status can only be active or archived.',
                };
            }
            return {
                success: false,
                message: 'Oops! Something went wrong. Please check the user/file provided.',
            };
        });
    }
    checkInOrOut(id, email, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.getOneById(id);
            const user = yield this.userRepository.getByEmail(email);
            if (file.currentUserCheckedIn) {
                if (file.currentUserCheckedIn.email !== email) {
                    throw new common_1.NotAcceptableException(`The file is checked in by ${file.currentUserCheckedIn.email}. You're unable to check it in/out.`);
                }
                if (file.currentUserCheckedIn.status === body.status) {
                    throw new common_1.NotAcceptableException(`The file is already ${file.currentUserCheckedIn.status}.`);
                }
            }
            if (body.status === status_1.Status.checkIn) {
                file.currentUserCheckedIn = {
                    email: user.email,
                    status: status_1.Status.checkIn,
                };
            }
            else if (body.status === status_1.Status.checkOut) {
                file.currentUserCheckedIn = null;
            }
            else {
                throw new common_1.NotAcceptableException(`Body must contain a status which is one of these: ${status_1.Status.checkIn}, ${status_1.Status.checkOut}`);
            }
            delete file._id;
            yield this.fileRepository.update(id, file);
            return {
                success: true,
                message: `Successfully changed the status of the file to ${body.status}`,
            };
        });
    }
    update(id, data, email, history) {
        return __awaiter(this, void 0, void 0, function* () {
            let file = yield this.fileRepository.findOne(id);
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
                if (typeof data.tags === 'string') {
                    tags = JSON.parse(data.tags);
                }
                else if (typeof data.tags === 'object') {
                    tags = data.tags;
                }
                file.tags = tags.map(tag => ({ code: tag.title.toLowerCase().replace(/ /g, '_'), title: tag.title }));
                for (const tag of file.tags) {
                    yield this.tagService.create({ title: tag.title });
                }
            }
            if (history) {
                const user = yield this.userRepository.getByEmail(email);
                history.author = user;
                history.tags = file.tags;
                history.title = file.title;
                history.created_at = new Date();
                file.addToHistory(history);
            }
            yield this.algoliaService.update(Object.assign({}, file, { objectID: file._id }));
            yield this.fileRepository.update(id, file);
            file = yield this.fileRepository.findOne(id);
            return Object.assign({}, file.toJson(), { success: true, id });
        });
    }
    save(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const newFile = yield this.fileRepository.save(file);
            yield this.algoliaService.save(newFile);
            return newFile;
        });
    }
    createRaw(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = this.fileRepository.create();
            file.setData(body);
            return yield this.fileRepository.save(file);
        });
    }
    create(email, body, json = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.getByEmail(email);
            const formattedUser = underscore_1.pick(user, 'id', 'email', 'name');
            let tags = [];
            let file = yield this.fileRepository.fileExists(body.name);
            let response = { success: false, message: 'Unable to create file.' };
            let fileId = null;
            if (body.tags) {
                if (typeof body.tags === 'string') {
                    tags = JSON.parse(body.tags);
                }
                else if (typeof body.tags === 'object') {
                    tags = body.tags;
                }
                body.tags = tags.map(tag => ({ code: tag.title.toLowerCase().replace(/ /g, '_'), title: tag.title }));
                for (const tag of body.tags) {
                    yield this.tagService.create({ title: tag.title });
                }
            }
            const history = new _history_1.History(Object.assign({}, body));
            history.author = formattedUser;
            if (!file) {
                file = yield this.fileRepository.create();
                file.setData(Object.assign({}, body, { original_author: formattedUser, version: 1, status: 'active' }));
                history.version = file.version;
                file = yield this.fileRepository.save(file);
                response = { success: true, message: 'File created successfully.' };
                fileId = file._id;
            }
            else {
                const version = file.getLastVersion() + 1;
                history.version = version;
                file.setData(Object.assign({}, body, { version }));
                fileId = file._id;
                delete file._id;
                yield this.fileRepository.update(fileId, file);
                response = { success: true, message: 'Versioned file successfully.' };
            }
            history.tags = body.tags;
            history.title = body.title;
            const newHistory = yield this.historyService.create(history);
            file.addToHistory(newHistory);
            delete file._id;
            yield this.fileRepository.update({ _id: fileId }, file);
            yield this.algoliaService.save(Object.assign({}, file, { objectID: fileId }));
            if (!json) {
                return yield this.fileRepository.findOne({ _id: fileId });
            }
            return Object.assign({}, file, { author: user.toJson(false) }, response);
        });
    }
    changeVersion(id, email, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.fileRepository.findById(id);
            const user = yield this.userRepository.getByEmail(email);
            if (!file.restoreVersion(body.version)) {
                throw new common_1.NotFoundException(`Version ${body.version} does not exist for the file ${file.name}.`);
            }
            yield this.fileRepository.update(id, file);
            return {
                success: true,
                message: `Successfully changed the version to ${body.version}.`,
            };
        });
    }
};
FileService.statuses = [
    'archived',
    'active',
];
FileService = FileService_1 = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(file_repository_1.FileRepository)),
    __param(1, typeorm_1.InjectRepository(user_repository_1.UserRepository)),
    __metadata("design:paramtypes", [file_repository_1.FileRepository,
        user_repository_1.UserRepository,
        _history_2.HistoryService,
        tag_service_1.TagService])
], FileService);
exports.FileService = FileService;
//# sourceMappingURL=file.service.js.map