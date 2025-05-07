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
exports.findOrCreateUser = findOrCreateUser;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function findOrCreateUser(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const { googleId, email, name } = payload;
        // 1) Try to find an existing user by Google ID
        let user = yield prisma.user.findUnique({
            where: { email: googleId },
        });
        if (user) {
            return user;
        }
        user = yield prisma.user.findUnique({
            where: { email },
        });
        if (user) {
            user = yield prisma.user.update({
                where: { email },
                data: { email: googleId },
            });
            return user;
        }
        // 3) Otherwise, create a new user record
        user = yield prisma.user.create({
            data: {
                email,
                password: "defaultPassword123",
            },
        });
        return user;
    });
}
