import { CurlUIHtmlTag, CurlUITag, CurlUIRenderElement, CurlUIElementProps, CurlUIComponent, CurlUINativeElement } from "./types";
type CurlUIJSXTag = CurlUITag | CurlUIComponent;
type CurlUIJSXChild = CurlUIJSXParameters | CurlUIRenderElement;
type CurlUIJSXChildren = CurlUIJSXChild | Array<CurlUIJSXChild>;
type CurlUIJSXProps = CurlUIElementProps<CurlUINativeElement> & {
    children?: CurlUIJSXChildren;
};
type CurlUIJSXParameters = {
    type: CurlUITag;
    props: CurlUIJSXProps;
    key: any;
};
/**
 * Generates a CurlUI render element from a JSX tag
 * @param type Tag to parse
 * @param props Props to parse to the component function
 * @param key #Ignored
 * @returns
 */
export declare function jsx(type: CurlUIJSXTag, props?: CurlUIJSXProps, key?: any): CurlUIRenderElement;
export declare const jsxs: typeof jsx;
declare global {
    namespace JSX {
        type IntrinsicElements = {
            [tag in CurlUIHtmlTag]: CurlUIElementProps<CurlUINativeElement>;
        };
        type ElementClass = CurlUIComponent;
    }
}
export {};
