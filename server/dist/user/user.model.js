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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let User = class User extends typeorm_1.BaseEntity {
    hashPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            const saltRounds = parseInt(process.env.SALT_ROUNDS);
            const salt = yield bcrypt.genSalt(saltRounds);
            this.password = yield bcrypt.hash(this.password, salt);
        });
    }
    comparePassword(attempt) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt.compare(attempt, this.password);
        });
    }
    get token() {
        const { id, email } = this;
        return jwt.sign({
            id,
            email,
        }, process.env.APP_SECRET, {
            expiresIn: '7d',
        });
    }
    setData(data) {
        Object.assign(this, data);
    }
    toJson(showToken = true, keys) {
        let response = {};
        const { id, name, email, company, street, city, country, postCode, token, role, } = this;
        response = {
            id: id.toHexString(),
            email,
            name,
            company,
            street,
            city,
            country,
            postCode,
            role,
        };
        if (showToken && token) {
            response.token = token;
        }
        return response;
    }
};
__decorate([
    typeorm_1.ObjectIdColumn(),
    __metadata("design:type", typeorm_1.ObjectID)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        unique: true,
    }),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.MinLength(4),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "company", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "street", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "city", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "postCode", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "country", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Array)
], User.prototype, "teams", void 0);
__decorate([
    typeorm_1.Column({
        default: 'user',
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPassword", null);
User = __decorate([
    typeorm_1.Entity('users')
], User);
exports.User = User;
//# sourceMappingURL=user.model.js.map