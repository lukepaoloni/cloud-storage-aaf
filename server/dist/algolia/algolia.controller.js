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
const algolia_service_1 = require("./algolia.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("@auth/guards/jwt-auth.guard");
const user_decorator_1 = require("@user/user.decorator");
let AlgoliaController = class AlgoliaController {
    constructor() {
        this.algoliaService = new algolia_service_1.AlgoliaService('files');
    }
    index(query, email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.algoliaService.search({ query });
        });
    }
};
__decorate([
    common_1.Get(),
    swagger_1.ApiBearerAuth(),
    common_1.UseGuards(new jwt_auth_guard_1.JwtAuthGuard()),
    __param(0, common_1.Query('query')), __param(1, user_decorator_1.User('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AlgoliaController.prototype, "index", null);
AlgoliaController = __decorate([
    common_1.Controller('api/rest/search'),
    __metadata("design:paramtypes", [])
], AlgoliaController);
exports.AlgoliaController = AlgoliaController;
//# sourceMappingURL=algolia.controller.js.map