"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = void 0;
const token_util_1 = require("../utils/token.util");
const ensureAuthenticated = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        console.log("Token missing");
        res.status(401).json({ error: "Unauthorized" });
        return; // ← return void, not `return res…`
    }
    try {
        const payload = (0, token_util_1.verifyToken)(token);
        req.user = { id: payload.userId };
        next(); // ← call next() and return void
    }
    catch (err) {
        console.log("Token invalid:", err);
        res.status(401).json({ error: "Unauthorized" });
        return; // ← again return void
    }
};
exports.ensureAuthenticated = ensureAuthenticated;
