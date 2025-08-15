import { CurlUITag, CurlUIElementProps, CurlUIChildComponent, CurlUIRenderElement, CurlUIComponentProps, CurlUIComponent, CurlUIStore, CurlUIStoreState } from "./types";
export declare function CreateElement(tag: CurlUITag, properties: CurlUIElementProps, ...children: Array<CurlUIChildComponent>): CurlUIRenderElement;
export declare function CreateComponent(properties: CurlUIComponentProps): CurlUIComponent;
export declare function InstanceReference(): {
    isInstanceReference: boolean;
    instance: null;
};
export declare function Render(element: CurlUIRenderElement, htmlElement: HTMLElement): void;
export declare function Store(defaultState: CurlUIStoreState): CurlUIStore;
