"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const file_controller_1 = require("./file.controller");
const file_service_1 = require("./file.service");
const typeorm_1 = require("@nestjs/typeorm");
const file_model_1 = require("./file.model");
const user_model_1 = require("../user/user.model");
const file_repository_1 = require("./file.repository");
const user_repository_1 = require("../user/user.repository");
const history_module_1 = require("../history/history.module");
const multer_config_1 = require("../shared/multer-config");
const tag_module_1 = require("src/tag/tag.module");
let FileModule = class FileModule {
};
FileModule = __decorate([
    common_1.Module({
        imports: [
            history_module_1.HistoryModule,
            tag_module_1.TagModule,
            typeorm_1.TypeOrmModule.forFeature([file_model_1.File, file_repository_1.FileRepository, user_model_1.User, user_repository_1.UserRepository]),
            common_1.MulterModule.register(multer_config_1.multerConfig),
        ],
        controllers: [file_controller_1.FileController],
        providers: [file_service_1.FileService],
        exports: [file_service_1.FileService, typeorm_1.TypeOrmModule.forFeature([file_model_1.File, file_repository_1.FileRepository])],
    })
], FileModule);
exports.FileModule = FileModule;
//# sourceMappingURL=file.module.js.map