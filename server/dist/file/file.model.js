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
const typeorm_1 = require("typeorm");
const user_1 = require("../user");
const tag_model_1 = require("../tag/tag.model");
let File = class File extends typeorm_1.BaseEntity {
    setData(data) {
        Object.assign(this, data);
    }
    addToHistory(data) {
        if (!this.history) {
            this.history = new Array();
        }
        this.history.push(data);
    }
    restoreVersion(historyVersion) {
        const historyFile = this.history.find(history => history.version === historyVersion);
        if (historyFile) {
            this.size = historyFile.size;
            this.path = historyFile.path;
            this.version = historyFile.version;
            this.tags = historyFile.tags;
            this.title = historyFile.title;
            return true;
        }
        return false;
    }
    getLastVersion() {
        return this.history ? this.history.length : 0;
    }
    toJson(showHistory = true) {
        const { _id, title, name, type, size, url, path, original_author, history, tags, status, version, currentUserCheckedIn, updated_at } = this;
        const response = {
            _id,
            title,
            name,
            type,
            size,
            url,
            path,
            original_author,
            history,
            tags,
            status,
            version,
            currentUserCheckedIn,
            updated_at,
        };
        if (!showHistory) {
            delete response.history;
        }
        return response;
    }
};
__decorate([
    typeorm_1.ObjectIdColumn(),
    __metadata("design:type", typeorm_1.ObjectID)
], File.prototype, "_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], File.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({
        unique: true,
    }),
    __metadata("design:type", String)
], File.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], File.prototype, "type", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], File.prototype, "size", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], File.prototype, "url", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], File.prototype, "path", void 0);
__decorate([
    typeorm_1.OneToOne(type => user_1.User),
    typeorm_1.Column(),
    __metadata("design:type", Object)
], File.prototype, "original_author", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Object)
], File.prototype, "history", void 0);
__decorate([
    typeorm_1.ManyToMany(type => tag_model_1.Tag),
    typeorm_1.Column(),
    __metadata("design:type", Array)
], File.prototype, "tags", void 0);
__decorate([
    typeorm_1.OneToOne(type => user_1.User),
    typeorm_1.Column(),
    __metadata("design:type", Object)
], File.prototype, "currentUserCheckedIn", void 0);
__decorate([
    typeorm_1.Column({
        default: 'active',
    }),
    __metadata("design:type", String)
], File.prototype, "status", void 0);
__decorate([
    typeorm_1.VersionColumn(),
    __metadata("design:type", Number)
], File.prototype, "version", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], File.prototype, "created_at", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], File.prototype, "updated_at", void 0);
File = __decorate([
    typeorm_1.Entity('files')
], File);
exports.File = File;
//# sourceMappingURL=file.model.js.map