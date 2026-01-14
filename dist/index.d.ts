import { CurlUITag, CurlUIElementProps, CurlUIChildComponent, CurlUIRenderElement, CurlUIComponentProps, CurlUIComponent, CurlUIStore, CurlUIStoreState, CurlUINativeElement } from "./types";
/**
 * Creates a CurlUIRenderElement, a wrapper oven an element CurlUI can render on the DOM.
 * @param tag The element tag
 * @param properties Attributes to assign to the element
 * @param children The elements child elements.
 * @returns A CurlUIRenderElement.
 */
export declare function CreateElement(tag: CurlUITag, properties: CurlUIElementProps<CurlUINativeElement>, ...children: Array<CurlUIChildComponent | Array<CurlUIChildComponent>>): CurlUIRenderElement;
/**
 * Generates a function for custom element creation. From a wrapped custom component properties.
 * @param properties The custom component's properties.
 * @returns An element constructor function that takes props.
 */
export declare function CreateComponent(properties: CurlUIComponentProps): CurlUIComponent;
/**
 * Constructor function for an instanceReference handle that can be used to externally refer to a component instance
 * @returns
 */
export declare function InstanceReference(): {
    isInstanceReference: boolean;
    instance: null;
};
/**
 * Actually renders a renderable CurlUI element to the DOM element specified
 * @param element
 * @param htmlElement
 */
export declare function Render(element: CurlUIRenderElement, htmlElement: HTMLElement): void;
/**
 * Constructor for a CurlUIStore,a watchable properties object,
 * listeners can be bound to it for each time the state of the store chages.
 * @param state The initial state of the store.
 * @returns The store object.
 */
export declare function Store(defaultState: CurlUIStoreState): CurlUIStore;
