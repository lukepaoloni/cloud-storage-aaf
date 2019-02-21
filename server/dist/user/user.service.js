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
const typeorm_1 = require("@nestjs/typeorm");
const user_repository_1 = require("./user.repository");
const common_2 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({
                where: {
                    email,
                },
            });
            if (!user) {
                throw new common_1.NotFoundException(`${email} was not found.`);
            }
            return user;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userRepository.find();
            return users.map(user => user.toJson(false));
        });
    }
    findOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.findOneOrFail(id);
        });
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = data;
            const user = yield this.userRepository.findOne({
                where: {
                    email,
                },
            });
            if (!user || !(yield user.comparePassword(password))) {
                throw new common_1.NotFoundException(`Unable to find the user with that email (${email}) & password.`);
            }
            return user.toJson();
        });
    }
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = data;
            let user = yield this.userRepository.findOne({ where: { email } });
            if (user) {
                throw new common_1.HttpException('User already exists.', common_1.HttpStatus.BAD_REQUEST);
            }
            user = yield this.userRepository.create(data);
            yield this.validate(user);
            const newUser = yield this.userRepository.save(user);
            return newUser.toJson();
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = this.userRepository.create(data);
            yield this.validate(entity);
            return yield this.userRepository.save(entity);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.findOneById(id);
            if (!user) {
                throw new common_1.NotFoundException(`User was not found with ID: ${id}`);
            }
            yield this.userRepository.update(id, data);
            user = yield this.findOneById(id);
            return {
                success: true,
                message: 'Successfully updated user.',
                user: user.toJson(false),
            };
        });
    }
    patch(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.findOneById(id);
            Object.assign(entity, data);
            yield this.validate(entity);
            const user = yield this.userRepository.save(entity);
            return {
                success: true,
                message: 'Successfully updated user (PATCH).',
                user: user.toJson(false),
            };
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(id);
            return yield this.userRepository.delete(id);
        });
    }
    validate(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = yield class_validator_1.validate(entity, {
                validationError: {
                    target: false,
                    value: false,
                },
            });
            if (errors.length) {
                throw new common_2.UnprocessableEntityException(errors);
            }
        });
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(user_repository_1.UserRepository)),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map