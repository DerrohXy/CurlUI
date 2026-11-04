import { Fragment } from "./index";
import type { CurlUITag, ElementProps, RenderElement } from "./types";
export { Fragment };
type FunctionComponent = (props: any) => RenderElement;
export type CurlUIJSXTag = CurlUITag | FunctionComponent;
/**
 * Automatic-runtime entry point. Children arrive in `props.children`
 * (already-built render elements, possibly nested arrays) and are handled
 * by CreateElement, so nothing is re-parsed here.
 */
export declare function jsx(type: CurlUIJSXTag, props?: Record<string, any> | null, key?: string | number | null): RenderElement;
export declare const jsxs: typeof jsx;
export declare namespace JSX {
    type Element = RenderElement;
    type ElementType = CurlUITag | FunctionComponent;
    interface ElementChildrenAttribute {
        children: {};
    }
    interface IntrinsicAttributes {
        key?: string | number;
    }
    type IntrinsicElements = {
        [K in CurlUITag]: ElementProps<K>;
    };
}
