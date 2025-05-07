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
const passport_1 = __importDefault(require("passport"));
const env_1 = require("../config/env");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_service_1 = require("../services/user.service");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.env.GOOGLE_CLIENT_ID,
    clientSecret: env_1.env.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.env.GOOGLE_CALLBACK_URL,
}, 
// verify callback
(accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // your logic to find or create a user in DB:
        const user = yield (0, user_service_1.findOrCreateUser)({
            googleId: profile.id,
            email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value,
            name: profile.displayName,
        });
        done(null, user);
    }
    catch (err) {
        done(err, undefined);
    }
})));
// optional, if you use sessions
/*
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id: string, done) => {
  const user = await getUserById(id);
  done(null, user);
}); */
