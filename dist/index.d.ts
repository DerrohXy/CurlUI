import { CurlUITag, ElementProps, ChildComponent, RenderElement, CurlUIElement, ComponentProps, Component, CurlUIStore, StoreState, NativeElement, InstanceReference } from "./types";
type Props = {
    [key: string]: any;
};
/**
 * Creates a CurlUIRenderElement, a wrapper oven an element
 * CurlUI can render on the DOM.
 * @param tag The element tag
 * @param properties Attributes to assign to the element
 * @param children The elements child elements.
 * @returns A CurlUIRenderElement.
 */
export declare function CreateElement(tag: CurlUITag, properties: ElementProps<NativeElement>, ...children: Array<ChildComponent | Array<ChildComponent>>): CurlUIElement;
/**
 * Generates a function for custom element creation.
 * From a wrapped custom component properties.
 * @param properties The custom component's properties.
 * @returns An element constructor function that takes props.
 */
export declare function CreateComponent<T extends Props>(properties: ComponentProps): Component<T>;
/**
 * Constructor function for an instanceReference handle that can be
 * used to externally refer to a component instance
 * @returns
 */
export declare function InstanceReference(): InstanceReference;
/**
 * Actually renders a renderable CurlUI element to the DOM element specified
 * @param element
 * @param htmlElement
 */
export declare function Render(element: RenderElement, htmlElement: HTMLElement): void;
/**
 * Constructor for a CurlUIStore,a watchable properties object,
 * listeners can be bound to it for each time the state of the store chages.
 * @param state The initial state of the store.
 * @returns The store object.
 */
export declare function Store(defaultState: StoreState): CurlUIStore;
export {};
