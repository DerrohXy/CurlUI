import { jsx } from "./jsx-runtime";
export type { JSX } from "./jsx-runtime";
export { jsx, jsxs, Fragment } from "./jsx-runtime";
/** Dev transform passes extra (isStatic, source, self) arguments; they are ignored. */
export declare const jsxDEV: typeof jsx;
