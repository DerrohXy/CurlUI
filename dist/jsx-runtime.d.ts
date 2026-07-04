import { HtmlTag, CurlUITag, RenderElement, ElementProps, Component, NativeElement } from "./types";
type Props = {
    [key: string]: any;
};
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
/**
 * Generates a CurlUI render element from a JSX tag
 * @param type Tag to parse
 * @param props Props to parse to the component function
 * @param key #Ignored
 * @returns
 */
export declare function jsx(type: CurlUIJSXTag, props?: CurlUIJSXProps, key?: any): RenderElement;
export declare const jsxs: typeof jsx;
declare global {
    namespace JSX {
        type IntrinsicElements = {
            [tag in HtmlTag]: ElementProps<NativeElement>;
        };
        type ElementClass = Component<Props>;
    }
}
export {};
