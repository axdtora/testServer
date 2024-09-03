"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.appContainer = exports.app = exports.appBinndings = void 0;
const app_1 = require("./app");
const exeption_filter_1 = require("./errors/exeption.filter");
const logger_service_1 = require("./logger/logger.service");
const users_controller_1 = require("./users/users.controller");
const types_1 = require("./types");
const inversify_1 = require("inversify");
const user_service_1 = require("./users/user.service");
const config_service_1 = require("./config/config.service");
const prisma_service_1 = require("./database/prisma.service");
const users_repository_1 = require("./users/users.repository");
exports.appBinndings = new inversify_1.ContainerModule((bind) => {
    bind(types_1.TYPES.ILogger).to(logger_service_1.LoggerService).inSingletonScope();
    bind(types_1.TYPES.ExeptionFilter).to(exeption_filter_1.ExeptionFilter);
    bind(types_1.TYPES.UserCotroller).to(users_controller_1.UserController);
    bind(types_1.TYPES.Application).to(app_1.App);
    bind(types_1.TYPES.UserService).to(user_service_1.UserService).inSingletonScope();
    bind(types_1.TYPES.ConfigServise).to(config_service_1.ConfigService).inSingletonScope();
    bind(types_1.TYPES.PrismaService).to(prisma_service_1.PrismaService).inSingletonScope();
    bind(types_1.TYPES.UserRepository).to(users_repository_1.UsersRepository).inSingletonScope();
});
function bootstrap() {
    const appContainer = new inversify_1.Container();
    appContainer.load(exports.appBinndings);
    const app = appContainer.get(types_1.TYPES.Application);
    app.init();
    return { app, appContainer };
}
_a = bootstrap(), exports.app = _a.app, exports.appContainer = _a.appContainer;
