import type {
    ChildComponent,
    Component,
    ComponentDefinition,
    ComponentInstance,
    CSSProps,
    CurlUIElement,
    CurlUIStore,
    CurlUITag,
    ElementProps,
    InstanceReferenceHandle,
    RenderElement,
    StoreHandler,
    StoreState,
    WrappedComponent,
} from "./types";

export * from "./types";

type Props = { [key: string]: any };

/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */

const SVG_NS = "http://www.w3.org/2000/svg";

/** Tag used by <Fragment>. Rendered with `display: contents`. */
export const FRAGMENT_TAG = "curl-fragment";

/** SVG tags that cannot be mistaken for an HTML tag. */
const SVG_ONLY_TAGS = new Set<string>([
    "svg",
    "animate",
    "animateMotion",
    "animateTransform",
    "circle",
    "clipPath",
    "defs",
    "desc",
    "ellipse",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "filter",
    "foreignObject",
    "g",
    "image",
    "line",
    "linearGradient",
    "marker",
    "mask",
    "metadata",
    "mpath",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "set",
    "stop",
    "switch",
    "symbol",
    "text",
    "textPath",
    "tspan",
    "use",
    "view",
]);

/** Tags that exist in both namespaces; the parent decides. */
const AMBIGUOUS_TAGS = new Set<string>(["a", "script", "style", "title"]);

const BOOLEAN_ATTRIBUTES = new Set<string>([
    "allowfullscreen",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "defer",
    "disabled",
    "formnovalidate",
    "hidden",
    "inert",
    "ismap",
    "itemscope",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "selected",
]);

/** Props whose live DOM value can diverge from the last rendered prop. */
const LIVE_PROPS = new Set<string>([
    "value",
    "checked",
    "selected",
    "indeterminate",
]);

/** Never written; use children instead. */
const BLOCKED_PROPS = new Set<string>([
    "innerHTML",
    "outerHTML",
    "innerText",
    "outerText",
    "textContent",
    "nodeValue",
]);

const URL_ATTRIBUTES = new Set<string>([
    "href",
    "src",
    "action",
    "formaction",
    "poster",
    "data",
    "cite",
    "background",
    "xlink:href",
]);

/** Handled by the runtime, never written as attributes. */
const RESERVED_PROPS = new Set<string>([
    "children",
    "key",
    "ref",
    "instanceReference",
    "style",
    "className",
    "class",
    "mounting",
    "mounted",
    "unmounting",
    "unmounted",
]);

const HOOK_NAMES = ["mounting", "mounted", "unmounting", "unmounted"] as const;

/** camelCase SVG presentation attributes that are kebab-case in the DOM. */
const SVG_KEBAB_ATTRIBUTES = new Set<string>([
    "alignmentBaseline",
    "baselineShift",
    "clipPath",
    "clipRule",
    "colorInterpolation",
    "colorInterpolationFilters",
    "dominantBaseline",
    "fillOpacity",
    "fillRule",
    "floodColor",
    "floodOpacity",
    "fontFamily",
    "fontSize",
    "fontSizeAdjust",
    "fontStretch",
    "fontStyle",
    "fontVariant",
    "fontWeight",
    "letterSpacing",
    "lightingColor",
    "markerEnd",
    "markerMid",
    "markerStart",
    "paintOrder",
    "pointerEvents",
    "shapeRendering",
    "stopColor",
    "stopOpacity",
    "strokeDasharray",
    "strokeDashoffset",
    "strokeLinecap",
    "strokeLinejoin",
    "strokeMiterlimit",
    "strokeOpacity",
    "strokeWidth",
    "textAnchor",
    "textDecoration",
    "textRendering",
    "transformOrigin",
    "vectorEffect",
    "wordSpacing",
    "writingMode",
]);

const UNITLESS_STYLES = new Set<string>([
    "animationIterationCount",
    "aspectRatio",
    "borderImageOutset",
    "borderImageSlice",
    "borderImageWidth",
    "columnCount",
    "columns",
    "flex",
    "flexGrow",
    "flexShrink",
    "fontWeight",
    "gridArea",
    "gridColumn",
    "gridColumnEnd",
    "gridColumnStart",
    "gridRow",
    "gridRowEnd",
    "gridRowStart",
    "lineHeight",
    "opacity",
    "order",
    "orphans",
    "scale",
    "tabSize",
    "widows",
    "zIndex",
    "zoom",
]);

/* -------------------------------------------------------------------------- */
/*  Small helpers                                                             */
/* -------------------------------------------------------------------------- */

let idCounter = 0;

/**
 * Ids only need to be unique within the page, so a counter is enough. It also
 * works in insecure contexts, where crypto.randomUUID() is unavailable.
 */
function getUniqueId(): string {
    idCounter += 1;
    return "c" + idCounter.toString(36);
}

function camelToKebab(name: string): string {
    return name.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
}

function isEventKey(key: string): boolean {
    return /^on[A-Za-z]/.test(key);
}

function isSafeUrl(value: string): boolean {
    const normalized = value
        .replace(/[\u0000-\u0020\u007f-\u009f\u200b-\u200d\ufeff]/g, "")
        .toLowerCase();
    return !(
        normalized.startsWith("javascript:") ||
        normalized.startsWith("vbscript:") ||
        normalized.startsWith("data:text/html")
    );
}

function runHook(target: any, name: string): void {
    try {
        const result = target[name]?.();
        if (result && typeof result.then === "function") {
            result.then(undefined, (e: unknown) => console.error(e));
        }
    } catch (e) {
        console.error(e);
    }
}

function namespaceFor(parent: Node | null): string | null {
    if (parent && parent.nodeType === 1) {
        const el = parent as Element;
        if (el.localName === "foreignObject") {
            return null;
        }
        return el.namespaceURI === SVG_NS ? SVG_NS : null;
    }
    return null;
}

/* -------------------------------------------------------------------------- */
/*  Applying props to DOM elements                                            */
/* -------------------------------------------------------------------------- */

function classTokens(props: Props): string[] {
    return `${props.className ?? ""} ${props.class ?? ""}`
        .split(/\s+/)
        .filter(Boolean);
}

function applyClasses(el: Element, prev: Props, next: Props): void {
    const nextTokens = classTokens(next);
    const keep = new Set(nextTokens);
    classTokens(prev).forEach((t) => {
        if (!keep.has(t)) {
            el.classList.remove(t);
        }
    });
    if (nextTokens.length) {
        el.classList.add(...nextTokens);
    }
}

function setStyleValue(
    style: CSSStyleDeclaration,
    name: string,
    value: any,
): void {
    const empty = value === null || value === undefined || value === "";
    if (name.startsWith("--") || name.includes("-")) {
        if (empty) {
            style.removeProperty(name);
        } else {
            style.setProperty(name, String(value));
        }
        return;
    }
    if (empty) {
        (style as any)[name] = "";
    } else if (
        typeof value === "number" &&
        value !== 0 &&
        !UNITLESS_STYLES.has(name)
    ) {
        (style as any)[name] = value + "px";
    } else {
        (style as any)[name] = String(value);
    }
}

function applyStyle(
    el: Element,
    prev: CSSProps | string | undefined,
    next: CSSProps | string | undefined,
): void {
    const style = (el as HTMLElement).style;
    if (!style) {
        return;
    }
    if (typeof next === "string") {
        if (prev !== next) {
            style.cssText = next;
        }
        return;
    }
    if (typeof prev === "string") {
        style.cssText = "";
        prev = undefined;
    }
    const before: Props = prev ?? {};
    const after: Props = next ?? {};
    for (const name of Object.keys(before)) {
        if (!(name in after)) {
            setStyleValue(style, name, null);
        }
    }
    for (const name of Object.keys(after)) {
        if (before[name] !== after[name]) {
            setStyleValue(style, name, after[name]);
        }
    }
}

function collectEvents(props: Props): Map<string, Function> {
    const events = new Map<string, Function>();
    for (const key of Object.keys(props)) {
        if (!isEventKey(key)) {
            continue;
        }
        const value = props[key];
        if (typeof value === "function") {
            events.set(key.slice(2).toLowerCase(), value);
        } else if (value != null) {
            // String handlers (onclick="...") would become live inline JS.
            console.warn(`CurlUI: ignoring non-function value for "${key}".`);
        }
    }
    return events;
}

function applyEvents(el: Element, prev: Props, next: Props): void {
    const before = collectEvents(prev);
    const after = collectEvents(next);
    before.forEach((fn, name) => {
        if (after.get(name) !== fn) {
            el.removeEventListener(name, fn as EventListener);
        }
    });
    after.forEach((fn, name) => {
        if (before.get(name) !== fn) {
            el.addEventListener(name, fn as EventListener);
        }
    });
}

function attributeNameFor(key: string): string {
    if (key === "htmlFor") return "for";
    if (key === "httpEquiv") return "http-equiv";
    if (key === "acceptCharset") return "accept-charset";
    return key.toLowerCase();
}

function toBoolean(value: any): boolean {
    return value !== false && value !== "false" && value != null;
}

/** Writes one prop to an element as a DOM property or an attribute. */
function setProp(el: Element, key: string, value: any): void {
    if (BLOCKED_PROPS.has(key)) {
        console.warn(
            `CurlUI: "${key}" is not supported. Use children instead.`,
        );
        return;
    }

    const lower = key.toLowerCase();
    const isSvg = el.namespaceURI === SVG_NS;

    if (
        URL_ATTRIBUTES.has(lower) &&
        typeof value === "string" &&
        !isSafeUrl(value)
    ) {
        console.warn(`CurlUI: blocked unsafe URL in "${key}".`);
        el.removeAttribute(isSvg ? key : lower);
        return;
    }

    // HTML elements: prefer the DOM property when it can faithfully hold the value.
    if (!isSvg && key in el) {
        const current = (el as any)[key];
        const type = typeof current;
        const numeric =
            typeof value === "number" ||
            (typeof value === "string" && /^-?\d+(\.\d+)?$/.test(value));

        if (
            type === "boolean" ||
            type === "string" ||
            (type === "number" && (value == null || numeric))
        ) {
            if (value == null) {
                if (LIVE_PROPS.has(key)) {
                    (el as any)[key] = type === "boolean" ? false : "";
                } else {
                    el.removeAttribute(attributeNameFor(key));
                }
                return;
            }
            try {
                (el as any)[key] =
                    type === "boolean" ? toBoolean(value) : value;
                return;
            } catch {
                // fall through to the attribute path
            }
        }
    }

    const name = isSvg
        ? SVG_KEBAB_ATTRIBUTES.has(key)
            ? camelToKebab(key)
            : key
        : attributeNameFor(key);

    if (value === null || value === undefined) {
        el.removeAttribute(name);
    } else if (!isSvg && BOOLEAN_ATTRIBUTES.has(lower)) {
        if (toBoolean(value)) {
            el.setAttribute(name, "");
        } else {
            el.removeAttribute(name);
        }
    } else {
        el.setAttribute(name, String(value));
    }
}

function applyProps(el: Element, prev: Props, next: Props): void {
    applyClasses(el, prev, next);
    applyStyle(el, prev.style, next.style);
    applyEvents(el, prev, next);

    const keys = new Set<string>([...Object.keys(prev), ...Object.keys(next)]);
    const isSvg = el.namespaceURI === SVG_NS;

    const apply = (key: string) => {
        if (RESERVED_PROPS.has(key) || isEventKey(key)) {
            return;
        }
        const before = prev[key];
        const after = next[key];

        if (!isSvg && LIVE_PROPS.has(key)) {
            // Compare with the live DOM so a rejected controlled value is restored.
            if (after != null) {
                const live = (el as any)[key];
                const wanted =
                    typeof live === "boolean"
                        ? toBoolean(after)
                        : String(after);
                if (live !== wanted) {
                    setProp(el, key, after);
                }
            } else if (before != null) {
                setProp(el, key, null);
            }
            return;
        }

        if (!Object.is(before, after)) {
            setProp(el, key, after);
        }
    };

    // `type` must be set before `value` (e.g. <input type="range" value="5">).
    if (keys.has("type")) {
        apply("type");
    }
    keys.forEach((key) => {
        if (key !== "type") {
            apply(key);
        }
    });

    const prevRef = prev.ref ?? prev.instanceReference;
    const nextRef = next.ref ?? next.instanceReference;
    if (prevRef && prevRef !== nextRef && prevRef.instance === el) {
        prevRef.instance = null;
    }
    if (nextRef) {
        nextRef.instance = el;
    }
}

/** <select value> only works once its <option> children exist. */
function syncLive(el: Element, props: Props): void {
    if (el.localName === "select" && props.value != null) {
        (el as HTMLSelectElement).value = String(props.value);
    }
}

/* -------------------------------------------------------------------------- */
/*  Lifecycle                                                                 */
/* -------------------------------------------------------------------------- */

function releaseRef(w: CurlUIElement): void {
    const ref = w.ref;
    if (ref && (ref.instance === w || ref.instance === w.element)) {
        ref.instance = null;
    }
}

function runCleanups(w: any): void {
    const cleanups: Array<() => void> | undefined = w.__cleanups__;
    w.__cleanups__ = undefined;
    cleanups?.forEach((fn) => {
        try {
            fn();
        } catch (e) {
            console.error(e);
        }
    });
}

function lifecycleMounting(this: CurlUIElement): void {
    runHook(this, "mounting");
    this.children.forEach((c) => c._mounting_());
}

function lifecycleMounted(this: CurlUIElement): void {
    this.__mounted__ = true;
    if (this.ref) {
        this.ref.instance = this.isComponent ? this : this.element;
    }
    runHook(this, "mounted");
    this.children.forEach((c) => c._mounted_());
}

function lifecycleUnmounting(this: CurlUIElement): void {
    if (!this.__mounted__) {
        return;
    }
    runHook(this, "unmounting");
    this.children.forEach((c) => c._unmounting_());
}

function lifecycleUnmounted(this: CurlUIElement): void {
    if (!this.__mounted__) {
        return;
    }
    this.__mounted__ = false;
    runHook(this, "unmounted");
    this.children.forEach((c) => c._unmounted_());
    releaseRef(this);
    if (this.isComponent) {
        this.__destroyed__ = true;
        runCleanups(this);
    }
}

/* -------------------------------------------------------------------------- */
/*  Wrappers                                                                  */
/* -------------------------------------------------------------------------- */

function baseWrapper(
    tag: string | undefined,
    element: Node,
    children: CurlUIElement[],
    extra: Partial<CurlUIElement> = {},
): CurlUIElement {
    return {
        isElement: true,
        elementId: getUniqueId(),
        tag,
        element,
        parent: null,
        children,
        __mounted__: false,
        setParent(parent) {
            this.parent = parent;
        },
        _mounting_: lifecycleMounting,
        _mounted_: lifecycleMounted,
        _unmounting_: lifecycleUnmounting,
        _unmounted_: lifecycleUnmounted,
        ...extra,
    };
}

function createTextWrapper(text: string): CurlUIElement {
    return baseWrapper("#text", document.createTextNode(text), [], {
        isText: true,
        text,
    });
}

function createPlaceholder(): CurlUIElement {
    return baseWrapper("#comment", document.createComment(""), [], {
        isText: true,
        text: "",
    });
}

/** Flattens nested arrays, drops null/undefined/booleans, wraps text. */
function flattenChildren(
    input: ChildComponent,
    out: CurlUIElement[] = [],
): CurlUIElement[] {
    if (Array.isArray(input)) {
        input.forEach((child) => flattenChildren(child, out));
    } else if (
        input === null ||
        input === undefined ||
        typeof input === "boolean"
    ) {
        // renders nothing
    } else if (typeof input === "string" || typeof input === "number") {
        out.push(createTextWrapper(String(input)));
    } else {
        out.push(input);
    }
    return out;
}

/** Reduces anything renderable to exactly one node. */
function toWrapper(child: ChildComponent): CurlUIElement {
    const list = flattenChildren(child);
    if (list.length === 1) {
        return list[0];
    }
    if (list.length === 0) {
        return createPlaceholder();
    }
    return Fragment({ children: list });
}

function buildElement(
    tag: string,
    properties: Props | null | undefined,
    extraChildren: ChildComponent[],
): CurlUIElement {
    const { children: propChildren, ...props } = properties ?? {};

    const loaded = flattenChildren(
        propChildren !== undefined
            ? [...extraChildren, propChildren]
            : extraChildren,
    );

    const isSvg = tag === "svg" || SVG_ONLY_TAGS.has(tag);
    const element: Element = isSvg
        ? document.createElementNS(SVG_NS, tag)
        : document.createElement(tag);

    const wrapper = baseWrapper(tag, element, loaded, {
        props,
        key: props.key != null ? String(props.key) : undefined,
        ref: props.ref ?? props.instanceReference ?? null,
        mounting: props.mounting,
        mounted: props.mounted,
        unmounting: props.unmounting,
        unmounted: props.unmounted,
        __ambiguous__:
            AMBIGUOUS_TAGS.has(tag) || loaded.some((c) => c.__ambiguous__),
    });

    applyProps(element, {}, props);

    const childNs = namespaceFor(element);
    for (const child of loaded) {
        child.setParent(wrapper);
        fixNamespace(child, childNs);
        element.appendChild(child.element);
    }

    syncLive(element, props);
    return wrapper;
}

/**
 * <title>, <a>, <style> and <script> are created in the HTML namespace because
 * children are built before their parent. When one lands inside an <svg>, it is
 * rebuilt in the SVG namespace.
 */
function fixNamespace(w: CurlUIElement, ns: string | null): void {
    if (ns !== SVG_NS || !w.__ambiguous__) {
        return;
    }
    if (w.isComponent) {
        const root = (w as ComponentInstance).root;
        fixNamespace(root, ns);
        w.element = root.element;
        return;
    }
    if (w.isText) {
        return;
    }

    if (
        AMBIGUOUS_TAGS.has(w.tag!) &&
        (w.element as Element).namespaceURI !== SVG_NS
    ) {
        const old = w.element as Element;
        const fresh = document.createElementNS(SVG_NS, w.tag!);
        applyProps(fresh, {}, w.props ?? {});
        while (old.firstChild) {
            fresh.appendChild(old.firstChild);
        }
        w.element = fresh;
    }

    const childNs = namespaceFor(w.element);
    w.children.forEach((c) => fixNamespace(c, childNs));
}

/* -------------------------------------------------------------------------- */
/*  Reconciliation                                                            */
/* -------------------------------------------------------------------------- */

function sameKind(a: CurlUIElement, b: CurlUIElement): boolean {
    if (a.isComponent || b.isComponent) {
        return (
            !!a.isComponent &&
            !!b.isComponent &&
            (a as ComponentInstance).componentId ===
                (b as ComponentInstance).componentId
        );
    }
    return a.tag === b.tag;
}

/** Walks up the parents that render `child` as their root and syncs `element`. */
function propagateElement(child: CurlUIElement): void {
    let current = child;
    let parent = current.parent;
    while (
        parent &&
        "isElement" in parent &&
        parent.isComponent &&
        (parent as ComponentInstance).root === current
    ) {
        parent.element = current.element;
        current = parent;
        parent = current.parent;
    }
}

function patch(old: CurlUIElement, next: CurlUIElement): void {
    if (old.isComponent) {
        const o = old as any;
        const n = next as any;
        o.props = n.props;
        o.key = n.key;
        if (n.ref && n.ref !== o.ref) {
            if (o.ref && o.ref.instance === o) {
                o.ref.instance = null;
            }
            o.ref = n.ref;
        }
        if (o.ref) {
            o.ref.instance = o;
        }
        // The freshly built instance was only a carrier for the new props.
        n.__destroyed__ = true;
        runCleanups(n);
        o.rerender();
        return;
    }

    if (old.isText) {
        if (old.text !== next.text) {
            (old.element as CharacterData).data = next.text ?? "";
            old.text = next.text;
        }
        return;
    }

    const el = old.element as Element;
    applyProps(el, old.props ?? {}, next.props ?? {});
    old.props = next.props;
    old.key = next.key;
    old.ref = next.ref;
    HOOK_NAMES.forEach((name) => {
        old[name] = next[name];
    });
    reconcileChildren(old, next.children);
    syncLive(el, next.props ?? {});
}

function replaceNode(
    old: CurlUIElement,
    next: CurlUIElement,
    owner: CurlUIElement,
): void {
    const oldNode = old.element;
    const parentNode = oldNode.parentNode;
    const mounted = owner.__mounted__;

    if (mounted) old._unmounting_();
    fixNamespace(next, namespaceFor(parentNode));
    if (mounted) next._mounting_();

    if (parentNode) {
        parentNode.replaceChild(next.element, oldNode);
    }

    if (mounted) {
        old._unmounted_();
        next._mounted_();
    }
    next.setParent(owner);
}

/** Returns the node that should stay in the tree. */
function reconcileNode(
    old: CurlUIElement,
    next: CurlUIElement,
    owner: CurlUIElement,
): CurlUIElement {
    if (old === next) {
        return old;
    }
    if (!sameKind(old, next)) {
        replaceNode(old, next, owner);
        return next;
    }
    patch(old, next);
    return old;
}

/**
 * Keyed + positional child reconciliation. Matched nodes keep their DOM
 * (focus, scroll position, component state), unmatched ones are created or removed.
 */
function reconcileChildren(
    parent: CurlUIElement,
    nextChildren: CurlUIElement[],
): void {
    const parentEl = parent.element as Element;
    const oldChildren = parent.children;
    const mounted = parent.__mounted__;

    const oldSet = new Set(oldChildren);
    const nextSet = new Set(nextChildren);

    const keyed = new Map<string, CurlUIElement>();
    const unkeyed: CurlUIElement[] = [];
    for (const old of oldChildren) {
        if (nextSet.has(old)) continue; // passed through as-is, matched by identity
        if (old.key != null) keyed.set(old.key, old);
        else unkeyed.push(old);
    }

    const used = new Set<CurlUIElement>();
    const result: CurlUIElement[] = [];
    let unkeyedIndex = 0;

    for (const next of nextChildren) {
        if (oldSet.has(next)) {
            used.add(next);
            result.push(next);
            continue;
        }

        let match: CurlUIElement | undefined;
        if (next.key != null) {
            const candidate = keyed.get(next.key);
            if (
                candidate &&
                !used.has(candidate) &&
                sameKind(candidate, next)
            ) {
                match = candidate;
            }
        } else {
            const candidate = unkeyed[unkeyedIndex++];
            if (
                candidate &&
                !used.has(candidate) &&
                sameKind(candidate, next)
            ) {
                match = candidate;
            }
        }

        if (match) {
            used.add(match);
            patch(match, next);
            result.push(match);
        } else {
            result.push(next);
        }
    }

    // Remove what no longer exists.
    for (const old of oldChildren) {
        if (used.has(old)) continue;
        if (mounted) old._unmounting_();
        if (old.element.parentNode === parentEl) {
            parentEl.removeChild(old.element);
        }
        if (mounted) old._unmounted_();
    }

    // Prepare new nodes.
    const added = result.filter((w) => !oldSet.has(w));
    const childNs = namespaceFor(parentEl);
    for (const w of added) {
        fixNamespace(w, childNs);
        if (mounted) w._mounting_();
    }

    // Put every node in its final position.
    result.forEach((w, i) => {
        const at = parentEl.childNodes[i] ?? null;
        if (at !== w.element) {
            parentEl.insertBefore(w.element, at);
        }
    });

    result.forEach((w) => w.setParent(parent));
    parent.children = result;

    if (mounted) {
        added.forEach((w) => w._mounted_());
    }
}

/* -------------------------------------------------------------------------- */
/*  Update scheduling                                                         */
/* -------------------------------------------------------------------------- */

const dirty = new Set<ComponentInstance>();
let flushScheduled = false;

function depthOf(w: CurlUIElement): number {
    let depth = 0;
    let p = w.parent;
    while (p && "isElement" in p) {
        depth += 1;
        p = (p as CurlUIElement).parent;
    }
    return depth;
}

function schedule(instance: ComponentInstance): void {
    if (instance.__destroyed__) {
        return;
    }
    instance.__dirty__ = true;
    dirty.add(instance);
    if (!flushScheduled) {
        flushScheduled = true;
        queueMicrotask(FlushUpdates);
    }
}

/**
 * Applies all pending component updates now. Runs automatically in a microtask;
 * call it manually when you need the DOM to be current synchronously.
 */
export function FlushUpdates(): void {
    flushScheduled = false;
    let rounds = 0;
    while (dirty.size > 0 && rounds++ < 100) {
        // Parents first: re-rendering a parent refreshes (and cleans) its children.
        const batch = Array.from(dirty).sort((a, b) => depthOf(a) - depthOf(b));
        dirty.clear();
        for (const instance of batch) {
            if (instance.__dirty__ && !instance.__destroyed__) {
                instance.rerender();
            }
        }
    }
    if (dirty.size > 0) {
        dirty.clear();
        console.error("CurlUI: update loop did not settle after 100 rounds.");
    }
}

/* -------------------------------------------------------------------------- */
/*  Components                                                                */
/* -------------------------------------------------------------------------- */

function attachRoot(instance: any, root: CurlUIElement): void {
    instance.root = root;
    instance.children = [root];
    root.setParent(instance);
    instance.element = root.element;
    instance.__ambiguous__ = root.__ambiguous__;
}

function rerenderComponent(this: ComponentInstance): void {
    if (this.__destroyed__) {
        return;
    }
    this.__dirty__ = false;
    runHook(this, "updating");

    try {
        const previousNode = this.element;
        const nextRoot = toWrapper(this.render());
        const survivor = reconcileNode(this.root, nextRoot, this);

        attachRoot(this, survivor);
        if (this.element !== previousNode) {
            propagateElement(this);
        }
    } catch (e) {
        console.error(e);
        return;
    }

    runHook(this, "updated");
}

const componentMethods = {
    getState(this: any) {
        return this.state;
    },
    getProps(this: any) {
        return this.props;
    },
    setState(this: any, patch: any, skipUpdate = false) {
        const previous = this.state;
        const partial = typeof patch === "function" ? patch(previous) : patch;
        const next = { ...previous, ...partial };
        this.state = next;

        if (skipUpdate) {
            return;
        }
        if (this.update && this.update(previous, next) !== true) {
            return;
        }
        schedule(this);
    },
    forceUpdate(this: any) {
        schedule(this);
    },
    rerender: rerenderComponent,
    onCleanup(this: any, fn: () => void) {
        (this.__cleanups__ ||= []).push(fn);
    },
    bindStore(
        this: any,
        store: CurlUIStore<any>,
        selector?: (s: any) => unknown,
    ) {
        const unsubscribe = selector
            ? store.select(selector, () => this.forceUpdate())
            : store.subscribe(() => this.forceUpdate());
        this.onCleanup(unsubscribe);
        return unsubscribe;
    },
};

function createComponentInstance(
    component: WrappedComponent,
    properties: Props,
): ComponentInstance {
    const { key, ...ownProps } = properties;

    const instance: any = {
        ...component,
        ...componentMethods,
        isElement: true,
        isComponent: true,
        elementId: getUniqueId(),
        instanceId: getUniqueId(),
        tag: undefined,
        key: key != null ? String(key) : undefined,
        element: document.createComment(""),
        parent: null,
        children: [],
        state: {},
        props: {},
        __mounted__: false,
        __dirty__: false,
        setParent(parent: any) {
            this.parent = parent;
        },
        _mounting_: lifecycleMounting,
        _mounted_: lifecycleMounted,
        _unmounting_: lifecycleUnmounting,
        _unmounted_: lifecycleUnmounted,
    };

    instance.props = component.getDefaultProps
        ? { ...component.getDefaultProps.call(instance), ...ownProps }
        : ownProps;
    instance.state = component.getInitialState
        ? component.getInitialState.call(instance)
        : {};

    attachRoot(instance, toWrapper(instance.render()));

    const ref = ownProps.instanceReference ?? ownProps.ref;
    if (ref?.isInstanceReference) {
        instance.ref = ref;
        ref.instance = instance;
    }

    return instance;
}

/* -------------------------------------------------------------------------- */
/*  Public API                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Creates a render element (a wrapper around a DOM node CurlUI can mount).
 * Props are not mutated. `children` may come from the rest arguments, from
 * `props.children`, or both.
 */
export function CreateElement<K extends CurlUITag>(
    tag: K,
    properties?: ElementProps<K> | null,
    ...children: ChildComponent[]
): RenderElement {
    return buildElement(tag, properties as Props | null | undefined, children);
}

/**
 * Groups children without adding a meaningful wrapper. Because every render
 * element maps to exactly one DOM node, this renders a `<curl-fragment>` with
 * `display: contents`.
 */
export function Fragment(
    props: { children?: ChildComponent } = {},
): RenderElement {
    return buildElement(FRAGMENT_TAG, { style: { display: "contents" } }, [
        props.children,
    ]);
}

/**
 * Defines a component. Pass the props type (and optionally state type) explicitly:
 *   CreateComponent<{ name: string }, { count: number }>({ ... })
 * Custom methods on the definition are available on `this`.
 */
export function CreateComponent<
    P extends object = {},
    S extends object = {},
    M extends object = { [member: string]: any },
>(
    definition: ComponentDefinition<P, S> &
        M &
        ThisType<ComponentInstance<P, S, M>>,
): Component<P> {
    const component = {
        ...definition,
        isComponent: true,
        componentId: getUniqueId(),
    } as unknown as WrappedComponent;

    const wrapper = function (props: any): ComponentInstance<P, any> {
        return createComponentInstance(component, props ?? {}) as any;
    } as Component<P>;

    wrapper.componentId = component.componentId;
    wrapper.definition = definition as any;

    return wrapper;
}

/**
 * Creates a handle that receives the DOM element (native tags) or the
 * component instance (components) once rendered, and is cleared on unmount.
 */
export function InstanceReference<T = any>(): InstanceReferenceHandle<T> {
    return { isInstanceReference: true, instance: null };
}

const roots = new WeakMap<HTMLElement, RenderElement>();

/** Unmounts whatever `Render` previously put in `container`. */
export function Unmount(container: HTMLElement): void {
    const previous = roots.get(container);
    if (!previous) {
        return;
    }
    previous._unmounting_();
    if (previous.element.parentNode === container) {
        container.removeChild(previous.element);
    }
    previous._unmounted_();
    roots.delete(container);
}

/** Mounts `element` into `container`, unmounting any previous tree first. */
export function Render(element: RenderElement, container: HTMLElement): void {
    Unmount(container);
    container.innerHTML = "";

    roots.set(container, element);
    element.setParent(container);

    element._mounting_();
    container.appendChild(element.element);
    element._mounted_();
}

/**
 * Creates a store. Components should use `this.bindStore(store)` so the
 * subscription is released on unmount (call it from `mounted`).
 */
export function Store<S extends object = StoreState>(
    defaultState: S,
): CurlUIStore<S> {
    let state = defaultState;
    let entries: Array<StoreHandler<S>> = [];

    const store: CurlUIStore<S> = {
        getState() {
            return state;
        },
        setState(patch) {
            const partial = typeof patch === "function" ? patch(state) : patch;
            const changed = (Object.keys(partial) as Array<keyof S>).some(
                (k) => !Object.is(state[k], (partial as S)[k]),
            );
            if (!changed) {
                return;
            }
            const previous = state;
            state = { ...state, ...partial };
            entries.slice().forEach((handler) => {
                try {
                    handler(state, previous);
                } catch (e) {
                    console.error(e);
                }
            });
        },
        subscribe(handler) {
            // Wrap so subscribing the same function twice yields independent subscriptions.
            const entry: StoreHandler<S> = (s, p) => handler(s, p);
            (entry as any).original = handler;
            entries.push(entry);
            return () => {
                entries = entries.filter((e) => e !== entry);
            };
        },
        unsubscribe(handler) {
            entries = entries.filter((e) => (e as any).original !== handler);
        },
        select(selector, handler, equals = Object.is) {
            let current = selector(state);
            return store.subscribe((s) => {
                const value = selector(s);
                if (!equals(value, current)) {
                    const previous = current;
                    current = value;
                    handler(value, previous);
                }
            });
        },
    };

    return store;
}
