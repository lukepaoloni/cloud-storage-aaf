"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const file_model_1 = require("./file.model");
let FileRepository = class FileRepository extends typeorm_1.Repository {
    getByTypes(types) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = [];
            types.map((type) => __awaiter(this, void 0, void 0, function* () {
                const filesWithType = yield this.find({ where: { type } });
                filesWithType.map(fileWithType => {
                    files.push(fileWithType);
                });
            }));
            return files;
        });
    }
    fileExists(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.getByName(name);
            if (file) {
                return file;
            }
            return false;
        });
    }
    getByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne({ where: { name } });
        });
    }
    getByAuthor(author) {
        return __awaiter(this, void 0, void 0, function* () {
            return 'Get the files by an author.';
        });
    }
    getByDate(date) {
        return __awaiter(this, void 0, void 0, function* () {
            return 'Get the files by date.';
        });
    }
    getByLocation(location) {
        return __awaiter(this, void 0, void 0, function* () {
            return 'Get the files at a location.';
        });
    }
    getByProject(project) {
        return __awaiter(this, void 0, void 0, function* () {
            return 'Get the files registered to a project';
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield this.find();
            const formattedFiles = files.map(file => {
                return file.toJson();
            });
            return formattedFiles;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOneOrFail(id);
        });
    }
    findByObjectId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOneOrFail(id);
        });
    }
};
FileRepository = __decorate([
    typeorm_1.EntityRepository(file_model_1.File)
], FileRepository);
exports.FileRepository = FileRepository;
//# sourceMappingURL=file.repository.js.map