import type { ChildComponent, Component, ComponentDefinition, ComponentInstance, CurlUIStore, CurlUITag, ElementProps, InstanceReferenceHandle, RenderElement, StoreState } from "./types";
export * from "./types";
/** Tag used by <Fragment>. Rendered with `display: contents`. */
export declare const FRAGMENT_TAG = "curl-fragment";
/**
 * Applies all pending component updates now. Runs automatically in a microtask;
 * call it manually when you need the DOM to be current synchronously.
 */
export declare function FlushUpdates(): void;
/**
 * Creates a render element (a wrapper around a DOM node CurlUI can mount).
 * Props are not mutated. `children` may come from the rest arguments, from
 * `props.children`, or both.
 */
export declare function CreateElement<K extends CurlUITag>(tag: K, properties?: ElementProps<K> | null, ...children: ChildComponent[]): RenderElement;
/**
 * Groups children without adding a meaningful wrapper. Because every render
 * element maps to exactly one DOM node, this renders a `<curl-fragment>` with
 * `display: contents`.
 */
export declare function Fragment(props?: {
    children?: ChildComponent;
}): RenderElement;
/**
 * Defines a component. Pass the props type (and optionally state type) explicitly:
 *   CreateComponent<{ name: string }, { count: number }>({ ... })
 * Custom methods on the definition are available on `this`.
 */
export declare function CreateComponent<P extends object = {}, S extends object = {}, M extends object = {
    [member: string]: any;
}>(definition: ComponentDefinition<P, S> & M & ThisType<ComponentInstance<P, S, M>>): Component<P>;
/**
 * Creates a handle that receives the DOM element (native tags) or the
 * component instance (components) once rendered, and is cleared on unmount.
 */
export declare function InstanceReference<T = any>(): InstanceReferenceHandle<T>;
/** Unmounts whatever `Render` previously put in `container`. */
export declare function Unmount(container: HTMLElement): void;
/** Mounts `element` into `container`, unmounting any previous tree first. */
export declare function Render(element: RenderElement, container: HTMLElement): void;
/**
 * Creates a store. Components should use `this.bindStore(store)` so the
 * subscription is released on unmount (call it from `mounted`).
 */
export declare function Store<S extends object = StoreState>(defaultState: S): CurlUIStore<S>;
