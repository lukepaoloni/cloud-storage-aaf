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
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const user_decorator_1 = require("./../user/user.decorator");
const file_1 = require("../shared/helpers/file");
const folder_service_1 = require("./folder.service");
const folder_dto_1 = require("./folder.dto");
const mkdirp = require("mkdirp");
let FolderController = class FolderController {
    constructor(folderService) {
        this.folderService = folderService;
    }
    createFolder(user, body) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mkdirp.sync(`${file_1.getPublicPath(`uploads/${body.path}`)}`);
            return yield this.folderService.create(body);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.folderService.getAll();
        });
    }
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (body.where) {
                yield this.folderService.updateMany({ where: body.where }, body);
                return {
                    success: true,
                    message: 'Successfully updated the record.'
                };
            }
        });
    }
};
__decorate([
    common_1.Post(),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(new jwt_auth_guard_1.JwtAuthGuard()),
    __param(0, user_decorator_1.User('id')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, folder_dto_1.FolderDto]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "createFolder", null);
__decorate([
    common_1.Get(),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(new jwt_auth_guard_1.JwtAuthGuard()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "getAll", null);
__decorate([
    common_1.Put(),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(new jwt_auth_guard_1.JwtAuthGuard()),
    __param(0, user_decorator_1.User('id')), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FolderController.prototype, "update", null);
FolderController = __decorate([
    common_1.Controller('api/rest/folders'),
    __metadata("design:paramtypes", [folder_service_1.FolderService])
], FolderController);
exports.FolderController = FolderController;
//# sourceMappingURL=folder.controller.js.map