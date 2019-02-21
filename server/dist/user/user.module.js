"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_model_1 = require("./user.model");
const user_repository_1 = require("./user.repository");
const user_validator_1 = require("./user.validator");
let UserModule = class UserModule {
};
UserModule = __decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_model_1.User, user_repository_1.UserRepository])],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService, user_validator_1.IsUserAlreadyExist],
        exports: [user_service_1.UserService, typeorm_1.TypeOrmModule.forFeature([user_model_1.User, user_repository_1.UserRepository])],
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map