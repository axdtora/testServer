"use strict";
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
require("reflect-metadata");
const inversify_1 = require("inversify");
const types_1 = require("../types");
const user_service_1 = require("./user.service");
const tslog_1 = require("tslog");
const LoggerMock = {
    logger: new tslog_1.Logger,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
};
const ConfigServiceMock = {
    get: jest.fn(),
};
const UserRepositoryMock = {
    find: jest.fn(),
    create: jest.fn(),
};
const container = new inversify_1.Container();
let configService;
let userRepository;
let userService;
beforeAll(() => {
    container.bind(types_1.TYPES.ILogger).toConstantValue(LoggerMock);
    container.bind(types_1.TYPES.UserService).to(user_service_1.UserService);
    container.bind(types_1.TYPES.ConfigService).toConstantValue(ConfigServiceMock);
    container.bind(types_1.TYPES.UserRepository).toConstantValue(UserRepositoryMock);
    configService = container.get(types_1.TYPES.ConfigService);
    userRepository = container.get(types_1.TYPES.UserRepository);
    userService = container.get(types_1.TYPES.UserService);
});
let createdUser;
describe('User Service', () => {
    it('createUser', () => __awaiter(void 0, void 0, void 0, function* () {
        configService.get = jest.fn().mockReturnValueOnce('1');
        userRepository.create = jest.fn().mockImplementationOnce((user) => ({
            name: user.name,
            email: user.email,
            password: user.password,
            id: 1,
        }));
        createdUser = yield userService.createUser({
            email: 'a@a.ru',
            name: 'Антон',
            password: '1',
        });
        expect(createdUser === null || createdUser === void 0 ? void 0 : createdUser.id).toEqual(1);
        expect(createdUser === null || createdUser === void 0 ? void 0 : createdUser.password).not.toEqual('1');
    }));
    it('validateUser - success', () => {
        userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
        const res = userService.validateUser({
            email: 'a@a.ru',
            password: '1',
        });
        expect(res).toBeTruthy();
    });
    it('validateUser - wrong password', () => __awaiter(void 0, void 0, void 0, function* () {
        userRepository.find = jest.fn().mockReturnValueOnce({
            email: 'a@a.ru',
            password: '2',
        });
        const res = yield userService.validateUser({
            email: 'a@a.ru',
            password: '2',
        });
        expect(res).toBeFalsy();
    }));
    it('validateUser - wrong password(null)', () => __awaiter(void 0, void 0, void 0, function* () {
        userRepository.find = jest.fn().mockReturnValueOnce(null);
        const res = yield userService.validateUser({
            email: 'a@a.ru',
            password: '1',
        });
        expect(res).toBeFalsy();
    }));
});
