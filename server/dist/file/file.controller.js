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
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("@auth/guards/jwt-auth.guard");
const user_decorator_1 = require("@user/user.decorator");
const file_service_1 = require("./file.service");
const swagger_1 = require("@nestjs/swagger");
const file_1 = require("@shared/helpers/file");
const path_1 = require("path");
const common_2 = require("@nestjs/common");
let FileController = class FileController {
    constructor(fileService) {
        this.fileService = fileService;
    }
    getAll(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fileService.getAll(email, false);
        });
    }
    archive(id, email, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fileService.archive(id, email, body);
        });
    }
    changeVersion(id, email, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fileService.changeVersion(id, email, body);
        });
    }
    uploadFiles(files, email, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const filesResponse = [];
            for (const file of files) {
                const path = path_1.normalize(`${file_1.getUploadPath()}${file_1.getFilename(file)}/tmp`);
                const filePath = path_1.normalize(`${path}/${file.originalname}`);
                body.name = file.filename;
                body.path = filePath.split('uploads').pop();
                body.type = file.mimetype;
                body.size = file.size;
                const newFile = yield this.fileService.create(email, body, false);
                const newPath = path_1.normalize(`${file_1.getUploadPath()}${file_1.getFilename(file)}/v${newFile.version}`);
                let newFilePath = path_1.normalize(`${newPath}/${file.originalname}`);
                file_1.mkUploadDir(newPath);
                file_1.move(filePath, newFilePath);
                file_1.remove(path);
                newFilePath = newFilePath.split('uploads').pop();
                const id = newFile._id.toHexString();
                const lastHistoryIndex = newFile.history.length - 1;
                newFile.path = newFilePath;
                newFile.history[lastHistoryIndex].path = newFilePath;
                delete newFile._id;
                filesResponse.push(yield this.fileService.update(id, newFile));
            }
            return filesResponse;
        });
    }
    updateOneFile(id, file, email, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldFile = yield this.fileService.getOneById(id);
            if (file.filename !== oldFile.name) {
                throw new common_2.UnauthorizedException('File must be named the same.');
            }
            if (this.fileService.isCheckedIn(email, oldFile)) {
                const version = oldFile.getLastVersion() + 1;
                const tmpPath = path_1.normalize(`${file_1.getUploadPath()}${file_1.getFilename(file)}/tmp`);
                const tmpFilePath = path_1.normalize(`${tmpPath}/${file.originalname}`);
                const path = path_1.normalize(`${file_1.getUploadPath()}${file_1.getFilename(file)}/v${version}`);
                const filePath = path_1.normalize(`${path}/${file.originalname}`);
                body.name = file.filename;
                body.path = filePath.split('uploads').pop();
                body.size = file.size;
                file_1.mkUploadDir(path);
                file_1.move(tmpFilePath, filePath);
                file_1.remove(tmpPath);
                yield this.fileService.update(id, Object.assign({}, body, { version, updated_at: new Date() }), email, {
                    name: body.name,
                    path: body.path,
                    size: body.size,
                    version,
                });
                const updatedFile = yield this.fileService.getOneById(id);
                return {
                    success: true,
                    message: 'Successfully updated the file.',
                    file: Object.assign({}, updatedFile.toJson()),
                };
            }
        });
    }
    checkUserIn(id, email, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fileService.checkInOrOut(id, email, body);
        });
    }
    getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.fileService.getOneById(id);
            return {
                id: file._id,
                name: file.name,
                title: file.title,
                original_author: file.original_author,
                path: file.path,
                size: file.size,
                status: file.status,
                tags: file.tags,
                url: file.url,
                created_at: file.created_at,
                updated_at: file.updated_at,
                currentUserCheckedIn: file.currentUserCheckedIn,
                version: file.version,
                history: file.history.map(history => ({
                    id: history.id,
                    author: { id: history.author.id, email: history.author.name, name: history.author.name },
                    size: history.size,
                    version: history.version,
                    created_at: history.created_at,
                })),
            };
        });
    }
    updateOne(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fileService.update(id, data);
        });
    }
    create(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fileService.createRaw(body);
        });
    }
    getFileHistory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fileService.getFileHistoryById(id);
        });
    }
    getFileVersion(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fileService.getFileVersionById(id);
        });
    }
    delete(id, email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fileService.restrictedDelete(id, email);
        });
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fileService.sync();
        });
    }
};
__decorate([
    common_1.Get(),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(new jwt_auth_guard_1.JwtAuthGuard()),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, user_decorator_1.User('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "getAll", null);
__decorate([
    common_1.Put(':id/archive'),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(new jwt_auth_guard_1.JwtAuthGuard()),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('id')), __param(1, user_decorator_1.User('email')), __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "archive", null);
__decorate([
    common_1.Put(':id/version'),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(new jwt_auth_guard_1.JwtAuthGuard()),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('id')), __param(1, user_decorator_1.User('email')), __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "changeVersion", null);
__decorate([
    common_1.Post('upload'),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(new jwt_auth_guard_1.JwtAuthGuard()),
    common_1.UseInterceptors(common_1.FilesInterceptor('filepond')),
    swagger_1.ApiConsumes('multipart/form-data'),
    swagger_1.ApiImplicitFile({ name: 'files', required: true }),
    __param(0, common_1.UploadedFiles()), __param(1, user_decorator_1.User('email')), __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "uploadFiles", null);
__decorate([
    common_1.Post(':id/upload'),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(new jwt_auth_guard_1.JwtAuthGuard()),
    common_1.UseInterceptors(common_1.FileInterceptor('filepond')),
    swagger_1.ApiConsumes('multipart/form-data'),
    swagger_1.ApiImplicitFile({ name: 'file', required: true }),
    __param(0, common_1.Param('id')), __param(1, common_1.UploadedFile()), __param(2, user_decorator_1.User('email')), __param(3, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "updateOneFile", null);
__decorate([
    common_1.Put(':id/check-in-or-out'),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(new jwt_auth_guard_1.JwtAuthGuard()),
    __param(0, common_1.Param('id')), __param(1, user_decorator_1.User('email')), __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "checkUserIn", null);
__decorate([
    common_1.Get(':id'),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(new jwt_auth_guard_1.JwtAuthGuard()),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "getOne", null);
__decorate([
    common_1.Put(':id'),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(new jwt_auth_guard_1.JwtAuthGuard()),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('id')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "updateOne", null);
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "create", null);
__decorate([
    common_1.Get(':id/history'),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(new jwt_auth_guard_1.JwtAuthGuard()),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "getFileHistory", null);
__decorate([
    common_1.Get(':id/version'),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(new jwt_auth_guard_1.JwtAuthGuard()),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "getFileVersion", null);
__decorate([
    common_1.Delete(':id'),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(new jwt_auth_guard_1.JwtAuthGuard()),
    common_1.UsePipes(new common_1.ValidationPipe()),
    __param(0, common_1.Param('id')), __param(1, user_decorator_1.User('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FileController.prototype, "delete", null);
__decorate([
    common_1.Get('algolia/sync'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FileController.prototype, "sync", null);
FileController = __decorate([
    common_1.Controller('api/rest/files'),
    __metadata("design:paramtypes", [file_service_1.FileService])
], FileController);
exports.FileController = FileController;
//# sourceMappingURL=file.controller.js.map