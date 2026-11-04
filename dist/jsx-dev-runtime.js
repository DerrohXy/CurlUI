"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsxDEV = exports.Fragment = exports.jsxs = exports.jsx = void 0;
const jsx_runtime_1 = require("./jsx-runtime");
var jsx_runtime_2 = require("./jsx-runtime");
Object.defineProperty(exports, "jsx", { enumerable: true, get: function () { return jsx_runtime_2.jsx; } });
Object.defineProperty(exports, "jsxs", { enumerable: true, get: function () { return jsx_runtime_2.jsxs; } });
Object.defineProperty(exports, "Fragment", { enumerable: true, get: function () { return jsx_runtime_2.Fragment; } });
/** Dev transform passes extra (isStatic, source, self) arguments; they are ignored. */
exports.jsxDEV = jsx_runtime_1.jsx;
