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
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateUserDto {
}
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "company", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "name", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "street", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "city", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "country", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "postCode", void 0);
__decorate([
    swagger_1.ApiModelProperty(),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "teams", void 0);
exports.UpdateUserDto = UpdateUserDto;
class UserDto {
}
__decorate([
    class_validator_1.IsEmail(),
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], UserDto.prototype, "email", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty(),
    __metadata("design:type", String)
], UserDto.prototype, "password", void 0);
exports.UserDto = UserDto;
class UserResponseObj {
}
exports.UserResponseObj = UserResponseObj;
//# sourceMappingURL=user.dto.js.map