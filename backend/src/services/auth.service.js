"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.googleAuth = exports.googleCallback = exports.loginUser = exports.registerUser = void 0;
const passport_1 = __importDefault(require("passport"));
const userRepo = __importStar(require("../repositories/user.repository"));
const password_util_1 = require("../utils/password.util");
const token_util_1 = require("../utils/token.util");
const registerUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password }) {
    try {
        const existing = yield userRepo.findByEmail(email);
        if (existing) {
            throw new Error("User already exists");
        }
        const hashed = yield (0, password_util_1.hashPassword)(password);
        const user = yield userRepo.createUser({ email, password: hashed });
        return { success: true, data: { id: user.id, email: user.email } };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Registration failed",
        };
    }
});
exports.registerUser = registerUser;
const loginUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password }) {
    try {
        const user = yield userRepo.findByEmail(email);
        if (!user) {
            return {
                success: false,
                message: "User not exists",
            };
        }
        const valid = yield (0, password_util_1.comparePassword)(password, user.password);
        if (!valid) {
            return {
                success: false,
                message: "Invalid credentials",
            };
        }
        const token = (0, token_util_1.signToken)({ userId: user.id, email: user.email });
        return {
            success: true,
            data: { user: { id: user.id, email: user.email }, token },
        };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Login failed",
        };
    }
});
exports.loginUser = loginUser;
const googleCallback = (req, res, next) => {
    try {
        passport_1.default.authenticate("google", (err, user) => {
            if (err)
                return next(err);
            if (!user)
                return res.redirect("/login");
            const token = (0, token_util_1.signToken)({ userId: user.id, email: user.email });
            res.cookie("authToken", token, { httpOnly: true });
            res.redirect("/");
        })(req, res, next);
    }
    catch (error) {
        res.redirect("/login?error=auth_failed");
    }
};
exports.googleCallback = googleCallback;
exports.googleAuth = passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
});
