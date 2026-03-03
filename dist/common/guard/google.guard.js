"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthGuard = void 0;
const passport_1 = require("@nestjs/passport");
class GoogleAuthGuard extends (0, passport_1.AuthGuard)('google') {
}
exports.GoogleAuthGuard = GoogleAuthGuard;
//# sourceMappingURL=google.guard.js.map