import { CurlUIHtmlTag, CurlUITag, CurlUIRenderElement, CurlUIElementProps } from "./types";
type CurlUIJSXProps = CurlUIElementProps & {
    children?: CurlUIJSXParameters | Array<CurlUIJSXParameters>;
};
type CurlUIJSXParameters = {
    type: CurlUITag;
    props: CurlUIJSXProps;
    key: any;
};
export declare function jsx(type: CurlUITag, props?: CurlUIJSXProps, key?: any): CurlUIRenderElement;
export declare const jsxs: typeof jsx;
declare global {
    namespace JSX {
        type IntrinsicElements = {
            [tag in CurlUIHtmlTag]: CurlUIElementProps;
        };
        type ElementClass = CurlUITag;
    }
}
export {};
