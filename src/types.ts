/* -------------------------------------------------------------------------- */
/*  Tags                                                                      */
/* -------------------------------------------------------------------------- */

export type Primitive = string | number | boolean | null | undefined;

/** Every tag known to lib.dom. No `| string`, so typos like <dvi> are errors. */
export type HtmlTag = keyof HTMLElementTagNameMap;
export type SvgTag = keyof SVGElementTagNameMap;
export type CurlUITag = HtmlTag | SvgTag;

export type NativeElement = HTMLElement | SVGElement;

/* -------------------------------------------------------------------------- */
/*  Lifecycle                                                                 */
/* -------------------------------------------------------------------------- */

export type ElementHookProps = {
    mounting?: () => any;
    mounted?: () => any;
    unmounting?: () => any;
    unmounted?: () => any;
};

export type ComponentHookProps = ElementHookProps & {
    updating?: () => any;
    updated?: () => any;
};

/* -------------------------------------------------------------------------- */
/*  References                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Handle filled in by the runtime. For native elements `instance` is the DOM
 * element, for components it is the component instance. Cleared on unmount.
 */
export type InstanceReferenceHandle<T = any> = {
    isInstanceReference: true;
    instance: T | null;
};

/* -------------------------------------------------------------------------- */
/*  Render tree                                                               */
/* -------------------------------------------------------------------------- */

export type CurlUIElement = ElementHookProps & {
    isElement: true;
    /** True for text and placeholder (comment) nodes. */
    isText?: boolean;
    isComponent?: boolean;
    elementId: string;
    /** Tag name, "#text" or "#comment". Undefined for components. */
    tag?: string;
    key?: string;
    text?: string;
    /** Any DOM node: element, text or comment. */
    element: Node;
    parent: CurlUIElement | HTMLElement | null;
    children: Array<CurlUIElement>;
    /** Props last applied to the element (used for diffing). */
    props?: Record<string, any>;
    ref?: InstanceReferenceHandle | null;
    __mounted__: boolean;
    __destroyed__?: boolean;
    __ambiguous__?: boolean;
    setParent(parent: CurlUIElement | HTMLElement | null): void;
    _mounting_(): void;
    _mounted_(): void;
    _unmounting_(): void;
    _unmounted_(): void;
};

export type RenderElement = CurlUIElement;

/** Anything that can appear as a child. Arrays may nest. */
export type ChildComponent =
    | string
    | number
    | boolean
    | null
    | undefined
    | CurlUIElement
    | ChildComponent[];

/* -------------------------------------------------------------------------- */
/*  Props                                                                     */
/* -------------------------------------------------------------------------- */

type StringKeys<T> = {
    [K in keyof T]-?: K extends string
        ? T[K] extends string
            ? K
            : never
        : never;
}[keyof T];

type CSSValue = string | number | null | undefined;

/** Style object. Numbers get "px" unless the property is unitless. */
export type CSSProps = {
    [K in Exclude<StringKeys<CSSStyleDeclaration>, "cssText">]?: CSSValue;
} & {
    float?: CSSValue;
    [custom: `--${string}`]: CSSValue;
};

type IfEquals<X, Y, A, B> =
    (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;

type OmittedDomKeys =
    | "innerHTML"
    | "outerHTML"
    | "innerText"
    | "outerText"
    | "textContent"
    | "nodeValue"
    | "className"
    | "value"
    | "style";

/**
 * Writable, primitive-valued properties of a DOM interface.
 * Excludes readonly members, functions, event handlers and HTML-injecting sinks.
 */
export type DomProps<E> = {
    [P in keyof E as P extends string
        ? P extends OmittedDomKeys | `on${string}`
            ? never
            : E[P] extends Primitive
              ? IfEquals<
                    { [Q in P]: E[P] },
                    { -readonly [Q in P]: E[P] },
                    P,
                    never
                >
              : never
        : never]?: E[P];
};

/** Lowercase attribute spellings the runtime also accepts. */
export type LegacyAttributes = {
    accesskey?: string;
    tabindex?: number | string;
    contenteditable?: boolean | "true" | "false" | "plaintext-only" | "inherit";
    enterkeyhint?: string;
    inputmode?: string;
    spellcheck?: boolean | "true" | "false";
    readonly?: boolean | "true" | "false";
    maxlength?: number | string;
    minlength?: number | string;
    novalidate?: boolean | "true" | "false";
    formnovalidate?: boolean | "true" | "false";
    crossorigin?: "anonymous" | "use-credentials" | string;
    referrerpolicy?: string;
    hreflang?: string;
    nomodule?: boolean | "true" | "false";
    formaction?: string;
    formmethod?: string;
    formtarget?: string;
    formenctype?: string;
};

export type SvgAttributes = {
    id?: string;
    role?: string;
    tabIndex?: number;
    focusable?: boolean | "true" | "false" | "auto";
    xmlns?: string;
    viewBox?: string;
    preserveAspectRatio?: string;
    width?: string | number;
    height?: string | number;
    x?: string | number;
    y?: string | number;
    x1?: string | number;
    y1?: string | number;
    x2?: string | number;
    y2?: string | number;
    cx?: string | number;
    cy?: string | number;
    r?: string | number;
    rx?: string | number;
    ry?: string | number;
    d?: string;
    points?: string;
    transform?: string;
    href?: string;
    offset?: string | number;
    opacity?: string | number;
    fill?: string;
    fillOpacity?: string | number;
    fillRule?: "nonzero" | "evenodd";
    clipRule?: "nonzero" | "evenodd";
    clipPath?: string;
    mask?: string;
    filter?: string;
    stroke?: string;
    strokeWidth?: string | number;
    strokeOpacity?: string | number;
    strokeLinecap?: "butt" | "round" | "square";
    strokeLinejoin?: "miter" | "round" | "bevel" | "arcs" | "miter-clip";
    strokeDasharray?: string | number;
    strokeDashoffset?: string | number;
    strokeMiterlimit?: string | number;
    stopColor?: string;
    stopOpacity?: string | number;
    gradientUnits?: "userSpaceOnUse" | "objectBoundingBox";
    gradientTransform?: string;
    textAnchor?: "start" | "middle" | "end";
    dominantBaseline?: string;
    fontSize?: string | number;
    fontFamily?: string;
    fontWeight?: string | number;
    markerStart?: string;
    markerMid?: string;
    markerEnd?: string;
};

type EventMap = GlobalEventHandlersEventMap;

/** `onclick` and `onClick` are both accepted; the event name is lowercased. */
export type EventProps = {
    [K in keyof EventMap as `on${K & string}`]?: (ev: EventMap[K]) => any;
} & {
    [K in keyof EventMap as `on${Capitalize<K & string>}`]?: (
        ev: EventMap[K],
    ) => any;
};

/** `data-*`, `aria-*` and kebab-case SVG attributes. */
export type HyphenatedAttributes = {
    [attr: `${string}-${string}`]: Primitive;
};

export interface BaseProps {
    key?: string | number;
    class?: string;
    className?: string;
    style?: CSSProps | string;
    instanceReference?: InstanceReferenceHandle;
    ref?: InstanceReferenceHandle;
    children?: ChildComponent;
}

export type ElementProps<K extends CurlUITag = CurlUITag> = BaseProps &
    ElementHookProps &
    EventProps &
    HyphenatedAttributes &
    (K extends HtmlTag
        ? DomProps<HTMLElementTagNameMap[K]> & {
              value?: string | number;
          } & LegacyAttributes
        : SvgAttributes);

/* -------------------------------------------------------------------------- */
/*  Components                                                                */
/* -------------------------------------------------------------------------- */

/** Props every component receives in addition to its own. */
export type ComponentOwnProps = {
    children?: ChildComponent;
    key?: string | number;
    instanceReference?: InstanceReferenceHandle;
    ref?: InstanceReferenceHandle;
};

export type ComponentDefinition<
    P extends object = {},
    S extends object = {},
> = ComponentHookProps & {
    getInitialState?(): S;
    getDefaultProps?(): Partial<P>;
    /** Return true to re-render, anything else to skip. */
    update?(current: S, next: S): boolean;
    /** May return null / false / an array; it is normalised to one node. */
    render(): ChildComponent;
};

export type ComponentInstance<
    P extends object = any,
    S extends object = any,
    M extends object = {},
> = CurlUIElement &
    ComponentHookProps & {
        isComponent: true;
        componentId: string;
        instanceId: string;
        props: P & ComponentOwnProps;
        state: S;
        /** The node this component rendered. `children` is `[root]`. */
        root: CurlUIElement;
        __dirty__?: boolean;
        __cleanups__?: Array<() => void>;
        render(): ChildComponent;
        getInitialState?(): S;
        getDefaultProps?(): Partial<P>;
        update?(current: S, next: S): boolean;
        getState(): S;
        getProps(): P & ComponentOwnProps;
        /** State updates immediately; the DOM update is batched into a microtask. */
        setState(
            patch: Partial<S> | ((state: S) => Partial<S>),
            skipUpdate?: boolean,
        ): void;
        forceUpdate(): void;
        rerender(): void;
        /** Re-render when the store (or the selected slice) changes. Auto-unsubscribes on unmount. */
        bindStore<T extends object>(
            store: CurlUIStore<T>,
            selector?: (state: T) => unknown,
        ): () => void;
        /** Run `fn` when the component unmounts. */
        onCleanup(fn: () => void): void;
    } & M;

export type WrappedComponent = ComponentDefinition<any, any> & {
    isComponent: true;
    componentId: string;
    [member: string]: any;
};

export type Component<P extends object = {}> = {
    (props: P & ComponentOwnProps): ComponentInstance<P, any>;
    componentId: string;
    definition: ComponentDefinition<P, any>;
};

/* -------------------------------------------------------------------------- */
/*  Store                                                                     */
/* -------------------------------------------------------------------------- */

export type StoreState = { [key: string]: any };

export type StoreHandler<S> = (state: S, previous: S) => void;

export type CurlUIStore<S extends object = StoreState> = {
    getState(): S;
    /** Shallow-merges. Subscribers are skipped if nothing actually changed. */
    setState(patch: Partial<S> | ((state: S) => Partial<S>)): void;
    /** Returns an unsubscribe function. */
    subscribe(handler: StoreHandler<S>): () => void;
    unsubscribe(handler: StoreHandler<S>): void;
    /** Subscribe to a derived value; the handler only fires when it changes. */
    select<T>(
        selector: (state: S) => T,
        handler: (value: T, previous: T) => void,
        equals?: (a: T, b: T) => boolean,
    ): () => void;
};
