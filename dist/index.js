"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FRAGMENT_TAG = void 0;
exports.FlushUpdates = FlushUpdates;
exports.CreateElement = CreateElement;
exports.Fragment = Fragment;
exports.CreateComponent = CreateComponent;
exports.InstanceReference = InstanceReference;
exports.Unmount = Unmount;
exports.Render = Render;
exports.Store = Store;
__exportStar(require("./types"), exports);
/* -------------------------------------------------------------------------- */
/*  Constants                                                                 */
/* -------------------------------------------------------------------------- */
const SVG_NS = "http://www.w3.org/2000/svg";
/** Tag used by <Fragment>. Rendered with `display: contents`. */
exports.FRAGMENT_TAG = "curl-fragment";
/** SVG tags that cannot be mistaken for an HTML tag. */
const SVG_ONLY_TAGS = new Set([
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
const AMBIGUOUS_TAGS = new Set(["a", "script", "style", "title"]);
const BOOLEAN_ATTRIBUTES = new Set([
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
const LIVE_PROPS = new Set([
    "value",
    "checked",
    "selected",
    "indeterminate",
]);
/** Never written; use children instead. */
const BLOCKED_PROPS = new Set([
    "innerHTML",
    "outerHTML",
    "innerText",
    "outerText",
    "textContent",
    "nodeValue",
]);
const URL_ATTRIBUTES = new Set([
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
const RESERVED_PROPS = new Set([
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
const HOOK_NAMES = ["mounting", "mounted", "unmounting", "unmounted"];
/** camelCase SVG presentation attributes that are kebab-case in the DOM. */
const SVG_KEBAB_ATTRIBUTES = new Set([
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
const UNITLESS_STYLES = new Set([
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
function getUniqueId() {
    idCounter += 1;
    return "c" + idCounter.toString(36);
}
function camelToKebab(name) {
    return name.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
}
function isEventKey(key) {
    return /^on[A-Za-z]/.test(key);
}
function isSafeUrl(value) {
    const normalized = value
        .replace(/[\u0000-\u0020\u007f-\u009f\u200b-\u200d\ufeff]/g, "")
        .toLowerCase();
    return !(normalized.startsWith("javascript:") ||
        normalized.startsWith("vbscript:") ||
        normalized.startsWith("data:text/html"));
}
function runHook(target, name) {
    var _a;
    try {
        const result = (_a = target[name]) === null || _a === void 0 ? void 0 : _a.call(target);
        if (result && typeof result.then === "function") {
            result.then(undefined, (e) => console.error(e));
        }
    }
    catch (e) {
        console.error(e);
    }
}
function namespaceFor(parent) {
    if (parent && parent.nodeType === 1) {
        const el = parent;
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
function classTokens(props) {
    var _a, _b;
    return `${(_a = props.className) !== null && _a !== void 0 ? _a : ""} ${(_b = props.class) !== null && _b !== void 0 ? _b : ""}`
        .split(/\s+/)
        .filter(Boolean);
}
function applyClasses(el, prev, next) {
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
function setStyleValue(style, name, value) {
    const empty = value === null || value === undefined || value === "";
    if (name.startsWith("--") || name.includes("-")) {
        if (empty) {
            style.removeProperty(name);
        }
        else {
            style.setProperty(name, String(value));
        }
        return;
    }
    if (empty) {
        style[name] = "";
    }
    else if (typeof value === "number" &&
        value !== 0 &&
        !UNITLESS_STYLES.has(name)) {
        style[name] = value + "px";
    }
    else {
        style[name] = String(value);
    }
}
function applyStyle(el, prev, next) {
    const style = el.style;
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
    const before = prev !== null && prev !== void 0 ? prev : {};
    const after = next !== null && next !== void 0 ? next : {};
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
function collectEvents(props) {
    const events = new Map();
    for (const key of Object.keys(props)) {
        if (!isEventKey(key)) {
            continue;
        }
        const value = props[key];
        if (typeof value === "function") {
            events.set(key.slice(2).toLowerCase(), value);
        }
        else if (value != null) {
            // String handlers (onclick="...") would become live inline JS.
            console.warn(`CurlUI: ignoring non-function value for "${key}".`);
        }
    }
    return events;
}
function applyEvents(el, prev, next) {
    const before = collectEvents(prev);
    const after = collectEvents(next);
    before.forEach((fn, name) => {
        if (after.get(name) !== fn) {
            el.removeEventListener(name, fn);
        }
    });
    after.forEach((fn, name) => {
        if (before.get(name) !== fn) {
            el.addEventListener(name, fn);
        }
    });
}
function attributeNameFor(key) {
    if (key === "htmlFor")
        return "for";
    if (key === "httpEquiv")
        return "http-equiv";
    if (key === "acceptCharset")
        return "accept-charset";
    return key.toLowerCase();
}
function toBoolean(value) {
    return value !== false && value !== "false" && value != null;
}
/** Writes one prop to an element as a DOM property or an attribute. */
function setProp(el, key, value) {
    if (BLOCKED_PROPS.has(key)) {
        console.warn(`CurlUI: "${key}" is not supported. Use children instead.`);
        return;
    }
    const lower = key.toLowerCase();
    const isSvg = el.namespaceURI === SVG_NS;
    if (URL_ATTRIBUTES.has(lower) &&
        typeof value === "string" &&
        !isSafeUrl(value)) {
        console.warn(`CurlUI: blocked unsafe URL in "${key}".`);
        el.removeAttribute(isSvg ? key : lower);
        return;
    }
    // HTML elements: prefer the DOM property when it can faithfully hold the value.
    if (!isSvg && key in el) {
        const current = el[key];
        const type = typeof current;
        const numeric = typeof value === "number" ||
            (typeof value === "string" && /^-?\d+(\.\d+)?$/.test(value));
        if (type === "boolean" ||
            type === "string" ||
            (type === "number" && (value == null || numeric))) {
            if (value == null) {
                if (LIVE_PROPS.has(key)) {
                    el[key] = type === "boolean" ? false : "";
                }
                else {
                    el.removeAttribute(attributeNameFor(key));
                }
                return;
            }
            try {
                el[key] =
                    type === "boolean" ? toBoolean(value) : value;
                return;
            }
            catch (_a) {
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
    }
    else if (!isSvg && BOOLEAN_ATTRIBUTES.has(lower)) {
        if (toBoolean(value)) {
            el.setAttribute(name, "");
        }
        else {
            el.removeAttribute(name);
        }
    }
    else {
        el.setAttribute(name, String(value));
    }
}
function applyProps(el, prev, next) {
    var _a, _b;
    applyClasses(el, prev, next);
    applyStyle(el, prev.style, next.style);
    applyEvents(el, prev, next);
    const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
    const isSvg = el.namespaceURI === SVG_NS;
    const apply = (key) => {
        if (RESERVED_PROPS.has(key) || isEventKey(key)) {
            return;
        }
        const before = prev[key];
        const after = next[key];
        if (!isSvg && LIVE_PROPS.has(key)) {
            // Compare with the live DOM so a rejected controlled value is restored.
            if (after != null) {
                const live = el[key];
                const wanted = typeof live === "boolean"
                    ? toBoolean(after)
                    : String(after);
                if (live !== wanted) {
                    setProp(el, key, after);
                }
            }
            else if (before != null) {
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
    const prevRef = (_a = prev.ref) !== null && _a !== void 0 ? _a : prev.instanceReference;
    const nextRef = (_b = next.ref) !== null && _b !== void 0 ? _b : next.instanceReference;
    if (prevRef && prevRef !== nextRef && prevRef.instance === el) {
        prevRef.instance = null;
    }
    if (nextRef) {
        nextRef.instance = el;
    }
}
/** <select value> only works once its <option> children exist. */
function syncLive(el, props) {
    if (el.localName === "select" && props.value != null) {
        el.value = String(props.value);
    }
}
/* -------------------------------------------------------------------------- */
/*  Lifecycle                                                                 */
/* -------------------------------------------------------------------------- */
function releaseRef(w) {
    const ref = w.ref;
    if (ref && (ref.instance === w || ref.instance === w.element)) {
        ref.instance = null;
    }
}
function runCleanups(w) {
    const cleanups = w.__cleanups__;
    w.__cleanups__ = undefined;
    cleanups === null || cleanups === void 0 ? void 0 : cleanups.forEach((fn) => {
        try {
            fn();
        }
        catch (e) {
            console.error(e);
        }
    });
}
function lifecycleMounting() {
    runHook(this, "mounting");
    this.children.forEach((c) => c._mounting_());
}
function lifecycleMounted() {
    this.__mounted__ = true;
    if (this.ref) {
        this.ref.instance = this.isComponent ? this : this.element;
    }
    runHook(this, "mounted");
    this.children.forEach((c) => c._mounted_());
}
function lifecycleUnmounting() {
    if (!this.__mounted__) {
        return;
    }
    runHook(this, "unmounting");
    this.children.forEach((c) => c._unmounting_());
}
function lifecycleUnmounted() {
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
function baseWrapper(tag, element, children, extra = {}) {
    return Object.assign({ isElement: true, elementId: getUniqueId(), tag,
        element, parent: null, children, __mounted__: false, setParent(parent) {
            this.parent = parent;
        }, _mounting_: lifecycleMounting, _mounted_: lifecycleMounted, _unmounting_: lifecycleUnmounting, _unmounted_: lifecycleUnmounted }, extra);
}
function createTextWrapper(text) {
    return baseWrapper("#text", document.createTextNode(text), [], {
        isText: true,
        text,
    });
}
function createPlaceholder() {
    return baseWrapper("#comment", document.createComment(""), [], {
        isText: true,
        text: "",
    });
}
/** Flattens nested arrays, drops null/undefined/booleans, wraps text. */
function flattenChildren(input, out = []) {
    if (Array.isArray(input)) {
        input.forEach((child) => flattenChildren(child, out));
    }
    else if (input === null ||
        input === undefined ||
        typeof input === "boolean") {
        // renders nothing
    }
    else if (typeof input === "string" || typeof input === "number") {
        out.push(createTextWrapper(String(input)));
    }
    else {
        out.push(input);
    }
    return out;
}
/** Reduces anything renderable to exactly one node. */
function toWrapper(child) {
    const list = flattenChildren(child);
    if (list.length === 1) {
        return list[0];
    }
    if (list.length === 0) {
        return createPlaceholder();
    }
    return Fragment({ children: list });
}
function buildElement(tag, properties, extraChildren) {
    var _a, _b;
    const _c = properties !== null && properties !== void 0 ? properties : {}, { children: propChildren } = _c, props = __rest(_c, ["children"]);
    const loaded = flattenChildren(propChildren !== undefined
        ? [...extraChildren, propChildren]
        : extraChildren);
    const isSvg = tag === "svg" || SVG_ONLY_TAGS.has(tag);
    const element = isSvg
        ? document.createElementNS(SVG_NS, tag)
        : document.createElement(tag);
    const wrapper = baseWrapper(tag, element, loaded, {
        props,
        key: props.key != null ? String(props.key) : undefined,
        ref: (_b = (_a = props.ref) !== null && _a !== void 0 ? _a : props.instanceReference) !== null && _b !== void 0 ? _b : null,
        mounting: props.mounting,
        mounted: props.mounted,
        unmounting: props.unmounting,
        unmounted: props.unmounted,
        __ambiguous__: AMBIGUOUS_TAGS.has(tag) || loaded.some((c) => c.__ambiguous__),
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
function fixNamespace(w, ns) {
    var _a;
    if (ns !== SVG_NS || !w.__ambiguous__) {
        return;
    }
    if (w.isComponent) {
        const root = w.root;
        fixNamespace(root, ns);
        w.element = root.element;
        return;
    }
    if (w.isText) {
        return;
    }
    if (AMBIGUOUS_TAGS.has(w.tag) &&
        w.element.namespaceURI !== SVG_NS) {
        const old = w.element;
        const fresh = document.createElementNS(SVG_NS, w.tag);
        applyProps(fresh, {}, (_a = w.props) !== null && _a !== void 0 ? _a : {});
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
function sameKind(a, b) {
    if (a.isComponent || b.isComponent) {
        return (!!a.isComponent &&
            !!b.isComponent &&
            a.componentId ===
                b.componentId);
    }
    return a.tag === b.tag;
}
/** Walks up the parents that render `child` as their root and syncs `element`. */
function propagateElement(child) {
    let current = child;
    let parent = current.parent;
    while (parent &&
        "isElement" in parent &&
        parent.isComponent &&
        parent.root === current) {
        parent.element = current.element;
        current = parent;
        parent = current.parent;
    }
}
function patch(old, next) {
    var _a, _b, _c, _d;
    if (old.isComponent) {
        const o = old;
        const n = next;
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
            old.element.data = (_a = next.text) !== null && _a !== void 0 ? _a : "";
            old.text = next.text;
        }
        return;
    }
    const el = old.element;
    applyProps(el, (_b = old.props) !== null && _b !== void 0 ? _b : {}, (_c = next.props) !== null && _c !== void 0 ? _c : {});
    old.props = next.props;
    old.key = next.key;
    old.ref = next.ref;
    HOOK_NAMES.forEach((name) => {
        old[name] = next[name];
    });
    reconcileChildren(old, next.children);
    syncLive(el, (_d = next.props) !== null && _d !== void 0 ? _d : {});
}
function replaceNode(old, next, owner) {
    const oldNode = old.element;
    const parentNode = oldNode.parentNode;
    const mounted = owner.__mounted__;
    if (mounted)
        old._unmounting_();
    fixNamespace(next, namespaceFor(parentNode));
    if (mounted)
        next._mounting_();
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
function reconcileNode(old, next, owner) {
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
function reconcileChildren(parent, nextChildren) {
    const parentEl = parent.element;
    const oldChildren = parent.children;
    const mounted = parent.__mounted__;
    const oldSet = new Set(oldChildren);
    const nextSet = new Set(nextChildren);
    const keyed = new Map();
    const unkeyed = [];
    for (const old of oldChildren) {
        if (nextSet.has(old))
            continue; // passed through as-is, matched by identity
        if (old.key != null)
            keyed.set(old.key, old);
        else
            unkeyed.push(old);
    }
    const used = new Set();
    const result = [];
    let unkeyedIndex = 0;
    for (const next of nextChildren) {
        if (oldSet.has(next)) {
            used.add(next);
            result.push(next);
            continue;
        }
        let match;
        if (next.key != null) {
            const candidate = keyed.get(next.key);
            if (candidate &&
                !used.has(candidate) &&
                sameKind(candidate, next)) {
                match = candidate;
            }
        }
        else {
            const candidate = unkeyed[unkeyedIndex++];
            if (candidate &&
                !used.has(candidate) &&
                sameKind(candidate, next)) {
                match = candidate;
            }
        }
        if (match) {
            used.add(match);
            patch(match, next);
            result.push(match);
        }
        else {
            result.push(next);
        }
    }
    // Remove what no longer exists.
    for (const old of oldChildren) {
        if (used.has(old))
            continue;
        if (mounted)
            old._unmounting_();
        if (old.element.parentNode === parentEl) {
            parentEl.removeChild(old.element);
        }
        if (mounted)
            old._unmounted_();
    }
    // Prepare new nodes.
    const added = result.filter((w) => !oldSet.has(w));
    const childNs = namespaceFor(parentEl);
    for (const w of added) {
        fixNamespace(w, childNs);
        if (mounted)
            w._mounting_();
    }
    // Put every node in its final position.
    result.forEach((w, i) => {
        var _a;
        const at = (_a = parentEl.childNodes[i]) !== null && _a !== void 0 ? _a : null;
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
const dirty = new Set();
let flushScheduled = false;
function depthOf(w) {
    let depth = 0;
    let p = w.parent;
    while (p && "isElement" in p) {
        depth += 1;
        p = p.parent;
    }
    return depth;
}
function schedule(instance) {
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
function FlushUpdates() {
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
function attachRoot(instance, root) {
    instance.root = root;
    instance.children = [root];
    root.setParent(instance);
    instance.element = root.element;
    instance.__ambiguous__ = root.__ambiguous__;
}
function rerenderComponent() {
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
    }
    catch (e) {
        console.error(e);
        return;
    }
    runHook(this, "updated");
}
const componentMethods = {
    getState() {
        return this.state;
    },
    getProps() {
        return this.props;
    },
    setState(patch, skipUpdate = false) {
        const previous = this.state;
        const partial = typeof patch === "function" ? patch(previous) : patch;
        const next = Object.assign(Object.assign({}, previous), partial);
        this.state = next;
        if (skipUpdate) {
            return;
        }
        if (this.update && this.update(previous, next) !== true) {
            return;
        }
        schedule(this);
    },
    forceUpdate() {
        schedule(this);
    },
    rerender: rerenderComponent,
    onCleanup(fn) {
        (this.__cleanups__ || (this.__cleanups__ = [])).push(fn);
    },
    bindStore(store, selector) {
        const unsubscribe = selector
            ? store.select(selector, () => this.forceUpdate())
            : store.subscribe(() => this.forceUpdate());
        this.onCleanup(unsubscribe);
        return unsubscribe;
    },
};
function createComponentInstance(component, properties) {
    var _a;
    const { key } = properties, ownProps = __rest(properties, ["key"]);
    const instance = Object.assign(Object.assign(Object.assign({}, component), componentMethods), { isElement: true, isComponent: true, elementId: getUniqueId(), instanceId: getUniqueId(), tag: undefined, key: key != null ? String(key) : undefined, element: document.createComment(""), parent: null, children: [], state: {}, props: {}, __mounted__: false, __dirty__: false, setParent(parent) {
            this.parent = parent;
        }, _mounting_: lifecycleMounting, _mounted_: lifecycleMounted, _unmounting_: lifecycleUnmounting, _unmounted_: lifecycleUnmounted });
    instance.props = component.getDefaultProps
        ? Object.assign(Object.assign({}, component.getDefaultProps.call(instance)), ownProps) : ownProps;
    instance.state = component.getInitialState
        ? component.getInitialState.call(instance)
        : {};
    attachRoot(instance, toWrapper(instance.render()));
    const ref = (_a = ownProps.instanceReference) !== null && _a !== void 0 ? _a : ownProps.ref;
    if (ref === null || ref === void 0 ? void 0 : ref.isInstanceReference) {
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
function CreateElement(tag, properties, ...children) {
    return buildElement(tag, properties, children);
}
/**
 * Groups children without adding a meaningful wrapper. Because every render
 * element maps to exactly one DOM node, this renders a `<curl-fragment>` with
 * `display: contents`.
 */
function Fragment(props = {}) {
    return buildElement(exports.FRAGMENT_TAG, { style: { display: "contents" } }, [
        props.children,
    ]);
}
/**
 * Defines a component. Pass the props type (and optionally state type) explicitly:
 *   CreateComponent<{ name: string }, { count: number }>({ ... })
 * Custom methods on the definition are available on `this`.
 */
function CreateComponent(definition) {
    const component = Object.assign(Object.assign({}, definition), { isComponent: true, componentId: getUniqueId() });
    const wrapper = function (props) {
        return createComponentInstance(component, props !== null && props !== void 0 ? props : {});
    };
    wrapper.componentId = component.componentId;
    wrapper.definition = definition;
    return wrapper;
}
/**
 * Creates a handle that receives the DOM element (native tags) or the
 * component instance (components) once rendered, and is cleared on unmount.
 */
function InstanceReference() {
    return { isInstanceReference: true, instance: null };
}
const roots = new WeakMap();
/** Unmounts whatever `Render` previously put in `container`. */
function Unmount(container) {
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
function Render(element, container) {
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
function Store(defaultState) {
    let state = defaultState;
    let entries = [];
    const store = {
        getState() {
            return state;
        },
        setState(patch) {
            const partial = typeof patch === "function" ? patch(state) : patch;
            const changed = Object.keys(partial).some((k) => !Object.is(state[k], partial[k]));
            if (!changed) {
                return;
            }
            const previous = state;
            state = Object.assign(Object.assign({}, state), partial);
            entries.slice().forEach((handler) => {
                try {
                    handler(state, previous);
                }
                catch (e) {
                    console.error(e);
                }
            });
        },
        subscribe(handler) {
            // Wrap so subscribing the same function twice yields independent subscriptions.
            const entry = (s, p) => handler(s, p);
            entry.original = handler;
            entries.push(entry);
            return () => {
                entries = entries.filter((e) => e !== entry);
            };
        },
        unsubscribe(handler) {
            entries = entries.filter((e) => e.original !== handler);
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
