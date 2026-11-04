import { CreateElement, Fragment } from "./index";
import type { CurlUITag, ElementProps, RenderElement } from "./types";

export { Fragment };

type FunctionComponent = (props: any) => RenderElement;

export type CurlUIJSXTag = CurlUITag | FunctionComponent;

/**
 * Automatic-runtime entry point. Children arrive in `props.children`
 * (already-built render elements, possibly nested arrays) and are handled
 * by CreateElement, so nothing is re-parsed here.
 */
export function jsx(
    type: CurlUIJSXTag,
    props?: Record<string, any> | null,
    key?: string | number | null,
): RenderElement {
    const p = props ?? {};
    const element =
        typeof type === "function"
            ? type(p)
            : CreateElement(type, p as ElementProps<typeof type>);

    if (key !== undefined && key !== null) {
        element.key = String(key);
    }
    return element;
}

export const jsxs = jsx;

export namespace JSX {
    export type Element = RenderElement;
    export type ElementType = CurlUITag | FunctionComponent;
    export interface ElementChildrenAttribute {
        children: {};
    }
    export interface IntrinsicAttributes {
        key?: string | number;
    }
    export type IntrinsicElements = {
        [K in CurlUITag]: ElementProps<K>;
    };
}
