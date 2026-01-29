import {
    HtmlTag,
    CurlUITag,
    RenderElement,
    ElementProps,
    Component,
    NativeElement,
} from "./types";

type Props = { [key: string]: any };

type CurlUIJSXTag = CurlUITag | Component<Props>;

type CurlUIJSXChild = CurlUIJSXParameters | RenderElement;

type CurlUIJSXChildren = CurlUIJSXChild | Array<CurlUIJSXChild>;

type CurlUIJSXProps = ElementProps<NativeElement> & {
    children?: CurlUIJSXChildren;
};

type CurlUIJSXParameters = {
    type: CurlUITag;
    props: CurlUIJSXProps;
    key: any;
};

import { CreateElement } from "./index";

/***
 * Recursively parses a child entry
 */
function _parseChild(child: any) {
    if (!child) {
        return null;
    }

    if (child.type) {
        return jsx(child.type, child.props, child.key);
    } else {
        return child;
    }
}

/**
 * Incase the children parameter is not empty
 * @param type
 * @param props
 * @param key
 * @returns
 */
function _withChildren(
    type: CurlUITag,
    props: CurlUIJSXProps,
    key?: any,
): RenderElement {
    if (Array.isArray(props.children)) {
        let parsedChildren_ = props.children.map((child) => {
            return _parseChild(child);
        });

        delete props.children;

        return CreateElement(type, props, ...parsedChildren_);
    } else {
        let parsedChild_ = _parseChild(props.children);

        delete props.children;

        return CreateElement(type, props, parsedChild_);
    }
}

/**
 * In case of non empty props
 * @param type
 * @param props
 * @param key
 * @returns
 */
function _withProps(
    type: CurlUIJSXTag,
    props: CurlUIJSXProps,
    key?: any,
): RenderElement {
    if (typeof type === "function") {
        return type(props);
    } else {
        return props.children
            ? _withChildren(type, props, key)
            : CreateElement(type, props);
    }
}

/**
 * In case of empty props
 * @param type
 * @param key
 * @returns
 */
function _withoutProps(type: CurlUIJSXTag, key?: any): RenderElement {
    return typeof type === "string" ? CreateElement(type, {}) : type({});
}

/**
 * Generates a CurlUI render element from a JSX tag
 * @param type Tag to parse
 * @param props Props to parse to the component function
 * @param key #Ignored
 * @returns
 */
export function jsx(
    type: CurlUIJSXTag,
    props?: CurlUIJSXProps,
    key?: any,
): RenderElement {
    if (props) {
        return _withProps(type, props, key);
    } else {
        return _withoutProps(type, key);
    }
}

export const jsxs = jsx;

declare global {
    namespace JSX {
        type IntrinsicElements = {
            [tag in HtmlTag]: ElementProps<NativeElement>;
        };

        type ElementClass = Component<Props>;
    }
}
