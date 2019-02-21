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
const _user_1 = require("@user");
let History = class History extends typeorm_1.BaseEntity {
    constructor(obj) {
        super();
        Object.assign(this, obj);
    }
};
__decorate([
    typeorm_1.ObjectIdColumn(),
    __metadata("design:type", typeorm_1.ObjectID)
], History.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], History.prototype, "title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], History.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], History.prototype, "path", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], History.prototype, "size", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Array)
], History.prototype, "tags", void 0);
__decorate([
    typeorm_1.OneToOne(type => _user_1.User),
    typeorm_1.Column(),
    __metadata("design:type", Object)
], History.prototype, "author", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], History.prototype, "version", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], History.prototype, "created_at", void 0);
History = __decorate([
    typeorm_1.Entity('history'),
    __metadata("design:paramtypes", [Object])
], History);
exports.History = History;
//# sourceMappingURL=history.model.js.map