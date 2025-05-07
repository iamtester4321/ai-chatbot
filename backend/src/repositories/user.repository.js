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
exports.createUser = exports.findByEmail = void 0;
const db_1 = require("../config/db");
const findByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.prisma.user.findUnique({
        where: { email },
    });
});
exports.findByEmail = findByEmail;
const createUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password, }) {
    return db_1.prisma.user.create({
        data: { email, password },
    });
});
exports.createUser = createUser;
