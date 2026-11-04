"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsxs = exports.Fragment = void 0;
exports.jsx = jsx;
const index_1 = require("./index");
Object.defineProperty(exports, "Fragment", { enumerable: true, get: function () { return index_1.Fragment; } });
/**
 * Automatic-runtime entry point. Children arrive in `props.children`
 * (already-built render elements, possibly nested arrays) and are handled
 * by CreateElement, so nothing is re-parsed here.
 */
function jsx(type, props, key) {
    const p = props !== null && props !== void 0 ? props : {};
    const element = typeof type === "function"
        ? type(p)
        : (0, index_1.CreateElement)(type, p);
    if (key !== undefined && key !== null) {
        element.key = String(key);
    }
    return element;
}
exports.jsxs = jsx;
