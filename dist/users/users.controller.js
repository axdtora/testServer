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
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const base_controller_1 = require("../common/base.controller");
const http_error_class_1 = require("../errors/http-error.class");
const inversify_1 = require("inversify");
const types_1 = require("../types");
require("reflect-metadata");
const user_loging_dto_1 = require("./dto/user-loging.dto");
const user_register_dto_1 = require("./dto/user-register.dto");
const validate_middleware_1 = require("../common/validate.middleware");
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_guard_1 = require("../common/auth.guard");
let UserController = class UserController extends base_controller_1.BaseController {
    constructor(loggerService, userService, configService) {
        super(loggerService);
        this.loggerService = loggerService;
        this.userService = userService;
        this.configService = configService;
        this.bindRoutes([
            {
                path: '/register',
                method: 'post',
                func: this.register,
                middlewares: [new validate_middleware_1.ValidateMiddleware(user_register_dto_1.UserRegisterDto)]
            },
            {
                path: '/login',
                method: 'post',
                func: this.login,
                middlewares: [new validate_middleware_1.ValidateMiddleware(user_loging_dto_1.UserLoginDto)]
            },
            {
                path: '/info',
                method: 'get',
                func: this.info,
                middlewares: [new auth_guard_1.AuthGuard()]
            }
        ]);
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userService.validateUser(req.body);
            if (!result) {
                return next(new http_error_class_1.HTTPError(401, 'Ошибка авторизации'));
            }
            const jwt = yield this.signJWT(req.body.email, this.configService.get('SECRET'));
            this.ok(res, { jwt });
        });
    }
    register(_a, res_1, next_1) {
        return __awaiter(this, arguments, void 0, function* ({ body }, res, next) {
            this.loggerService.log('Запрос на регистрацию получен');
            const result = yield this.userService.createUser(body);
            if (!result) {
                this.loggerService.log('Пользователь уже существует');
                return next(new http_error_class_1.HTTPError(422, 'Такой пользователь уже существует'));
            }
            this.loggerService.log('Пользователь успешно зарегистрирован');
            console.log(body);
            this.ok(res, { email: result.email, id: result.id });
        });
    }
    info(_a, res_1, next_1) {
        return __awaiter(this, arguments, void 0, function* ({ user }, res, next) {
            const userInfo = yield this.userService.getUserInfo(user);
            this.ok(res, { email: userInfo === null || userInfo === void 0 ? void 0 : userInfo.email, id: userInfo === null || userInfo === void 0 ? void 0 : userInfo.id });
        });
    }
    signJWT(email, secret) {
        return new Promise((resolve, reject) => {
            (0, jsonwebtoken_1.sign)({
                email,
                iat: Math.floor(Date.now() / 1000),
            }, secret, {
                algorithm: 'HS256'
            }, (err, token) => {
                if (err) {
                    reject(err);
                }
                resolve(token);
            });
        });
    }
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.ILogger)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.UserService)),
    __param(2, (0, inversify_1.inject)(types_1.TYPES.ConfigServise)),
    __metadata("design:paramtypes", [Object, Object, Object])
], UserController);
