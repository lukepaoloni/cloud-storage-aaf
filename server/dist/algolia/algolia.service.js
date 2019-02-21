"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Algolia = require("algoliasearch");
class AlgoliaService {
    constructor(index) {
        this.client = Algolia(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);
        this.index = this.client.initIndex(index);
    }
    clearIndex() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.index.clearIndex();
        });
    }
    search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.index.search(query);
        });
    }
    add(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.index.addObject(data);
        });
    }
    addMany(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.index.addObjects(data);
        });
    }
    save(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.index.saveObject(data);
        });
    }
    saveMany(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.index.saveObjects(data);
        });
    }
    update(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.index.partialUpdateObject(data);
        });
    }
    updateMany(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.index.partialUpdateObjects(data);
        });
    }
    delete(objectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.index.deleteObject(objectId);
        });
    }
    deleteMany(objectIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.index.deleteObjects(objectIds);
        });
    }
    getManyByIds(objectIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.index.getObjects(objectIds);
        });
    }
    getById(objectId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.index.getObject(objectId);
        });
    }
}
exports.AlgoliaService = AlgoliaService;
//# sourceMappingURL=algolia.service.js.map