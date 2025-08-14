import { ObjectUITag, ObjectUIElementProps, ObjectUIChildComponent, ObjectUIRenderElement, ObjectUIComponentProps, ObjectUIWrappedComponent, ObjectUIComponent, ObjectUIStore, ObjectUIStoreState } from "./types";
export declare function CreateElement(tag: ObjectUITag, properties: ObjectUIElementProps, ...children: Array<ObjectUIChildComponent>): ObjectUIRenderElement;
export declare function WrapComponent(properties: ObjectUIComponentProps): ObjectUIWrappedComponent;
export declare function CreateComponent(properties: ObjectUIComponentProps): ObjectUIComponent;
export declare function InstanceReference(): {
    isInstanceReference: boolean;
    instance: null;
};
export declare function Render(element: ObjectUIRenderElement, htmlElement: HTMLElement): void;
export declare function Store(defaultState: ObjectUIStoreState): ObjectUIStore;
