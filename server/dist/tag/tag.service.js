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
const tag_model_1 = require("./tag.model");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
let TagService = class TagService {
    constructor(tagRepository) {
        this.tagRepository = tagRepository;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const tags = yield this.tagRepository.find();
            const tagsResponse = tags.map(tag => ({ title: tag.title, code: tag.code }));
            return tagsResponse;
        });
    }
    create(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title } = body;
            const code = title.toLowerCase().replace(/ /g, '_');
            const tagExists = yield this.tagExists(code);
            if (!tagExists) {
                return yield this.tagRepository.save({
                    title, code,
                });
            }
            throw new common_1.ForbiddenException('Tag already exists.');
        });
    }
    getByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.tagRepository.findOne({ code });
        });
    }
    tagExists(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const tag = yield this.getByCode(code);
            if (tag) {
                return true;
            }
            return false;
        });
    }
    delete(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield this.tagExists(code);
            if (exists) {
                yield this.tagRepository.delete({ code });
                return {
                    success: true,
                    message: `Successfully deleted the tag with the code (${code}).`,
                };
            }
            return {
                success: false,
                message: `There is not a tag that exists with that code (${code}).`,
            };
        });
    }
};
TagService = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_2.InjectRepository(tag_model_1.Tag)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], TagService);
exports.TagService = TagService;
//# sourceMappingURL=tag.service.js.map