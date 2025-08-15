import { CurlUIHtmlTag, CurlUITag, CurlUIRenderElement, CurlUIElementProps, CurlUIComponent } from "./types";
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
export declare function jsx(type: CurlUIJSXTag, props?: CurlUIJSXProps, key?: any): CurlUIRenderElement;
export declare const jsxs: typeof jsx;
declare global {
    namespace JSX {
        type IntrinsicElements = {
            [tag in CurlUIHtmlTag]: CurlUIElementProps;
        };
        type ElementClass = CurlUIComponent;
    }
}
export {};
