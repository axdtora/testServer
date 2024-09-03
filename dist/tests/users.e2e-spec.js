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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../src/main");
const supertest_1 = __importDefault(require("supertest"));
let application;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const { app } = yield main_1.boot;
    application = app;
}));
describe('Users e2e', () => {
    it('Register - error', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(application.app)
            .post('/users/register')
            .send({ email: 'test@a.com', password: 's' });
        expect(res.statusCode).toBe(422);
    }));
    it('Login - success', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(application.app)
            .post('/users/login')
            .send({ email: 'test@a.com', password: 'Za_donbas' });
        expect(res.body.jwt).not.toBeUndefined();
    }));
    it('Login - error', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(application.app)
            .post('/users/login')
            .send({ email: 'a@a.ru', password: '1' });
        expect(res.statusCode).toBe(401);
    }));
    it('Info - success', () => __awaiter(void 0, void 0, void 0, function* () {
        const login = yield (0, supertest_1.default)(application.app)
            .post('/users/login')
            .send({ email: 'test@a.com', password: 'Za_donbas' });
        const res = yield (0, supertest_1.default)(application.app)
            .get('/users/info')
            .set('Authorization', `Bearer ${login.body.jwt}`);
        expect(res.body.email).toBe('test@a.com');
    }));
    it('Info - error', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(application.app).get('/users/info').set('Authorization', `Bearer 1`);
        expect(res.statusCode).toBe(401);
    }));
});
afterAll(() => {
    application.close();
});
