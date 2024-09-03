"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthMiddleware {
    constructor(secret) {
        this.secret = secret;
    }
    execute(req, res, next) {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            (0, jsonwebtoken_1.verify)(token, this.secret, (err, payload) => {
                if (err) {
                    next();
                }
                else if (payload && typeof payload !== 'string') {
                    req.user = payload.email;
                    next();
                }
                else {
                    next();
                }
            });
        }
        else {
            next();
        }
    }
}
exports.AuthMiddleware = AuthMiddleware;
