import {
    CurlUIHtmlTag,
    CurlUITag,
    CurlUIRenderElement,
    CurlUIElementProps,
    CurlUIWrappedComponent,
    CurlUIComponent,
} from "./types";

type CurlUIJSXProps = CurlUIElementProps & {
    children?: CurlUIJSXParameters | Array<CurlUIJSXParameters>;
};

type CurlUIJSXParameters = {
    type: CurlUITag;
    props: CurlUIJSXProps;
    key: any;
};

import { CreateElement } from "./index";

function _withChildren(
    type: CurlUITag,
    props: CurlUIJSXProps,
    key?: any
): CurlUIRenderElement {
    if (Array.isArray(props.children)) {
        return CreateElement(
            type,
            props,
            ...props.children.map((child) => {
                return jsx(child.type, child.props, child.key);
            })
        );
    } else if (props.children?.type) {
        return CreateElement(
            type,
            props,
            jsx(props.children.type, props.children.props, props.children.key)
        );
    } else {
        return CreateElement(type, props, `${props.children}`);
    }
}

function _withProps(
    type: CurlUITag,
    props: CurlUIJSXProps,
    key?: any
): CurlUIRenderElement {
    if (props.children) {
        return _withChildren(type, props, key);
    } else {
        return CreateElement(type, props);
    }
}

function _withoutProps(type: CurlUITag, key?: any): CurlUIRenderElement {
    return CreateElement(type, {});
}

export function jsx(
    type: CurlUITag,
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

        type ElementClass = CurlUITag;
    }
}
