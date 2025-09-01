import {
    CurlUIHtmlTag,
    CurlUITag,
    CurlUIRenderElement,
    CurlUIElementProps,
    CurlUIWrappedComponent,
    CurlUIComponent,
} from "./types";

type CurlUIJSXTag = CurlUITag | CurlUIComponent;

type CurlUIJSXChild = CurlUIJSXParameters | CurlUIRenderElement;

type CurlUIJSXChildren = CurlUIJSXChild | Array<CurlUIJSXChild>;

type CurlUIJSXProps = CurlUIElementProps & {
    children?: CurlUIJSXChildren;
};

type CurlUIJSXParameters = {
    type: CurlUITag;
    props: CurlUIJSXProps;
    key: any;
};

import { CreateElement } from "./index";

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

function _withChildren(
    type: CurlUITag,
    props: CurlUIJSXProps,
    key?: any
): CurlUIRenderElement {
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

function _withProps(
    type: CurlUIJSXTag,
    props: CurlUIJSXProps,
    key?: any
): CurlUIRenderElement {
    if (typeof type === "function") {
        return type(props);
    } else {
        return props.children
            ? _withChildren(type, props, key)
            : CreateElement(type, props);
    }
}

function _withoutProps(type: CurlUIJSXTag, key?: any): CurlUIRenderElement {
    return typeof type === "string" ? CreateElement(type, {}) : type({});
}

export function jsx(
    type: CurlUIJSXTag,
    props?: CurlUIJSXProps,
    key?: any
): CurlUIRenderElement {
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
            [tag in CurlUIHtmlTag]: CurlUIElementProps;
        };

        type ElementClass = CurlUIComponent;
    }
}
