"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateElement = CreateElement;
exports.CreateComponent = CreateComponent;
exports.InstanceReference = InstanceReference;
exports.Render = Render;
exports.Store = Store;
/**
 * Generates a supposedly unique string.
 * @returns A "unique" string : I HAVE NO GUARANTEE FOR THIS. It just happens to be sufficient for this case.
 */
function GetUniqueId_() {
    let x = 0;
    for (let q = 0; q < 10; ++q) {
        x += Date.now() * Math.random();
    }
    return x.toString().replace(".", "");
}
/**
 * Checks if an element tag is an svg tag
 * @param tag The tag to check
 * @returns Whether its an svg tag
 */
function IsSvgTag_(tag = "") {
    return [
        "svg",
        "path",
        "circle",
        "ellipse",
        "line",
        "polygon",
        "polyline",
        "rect",
    ].includes(tag);
}
/**
 * Allowed element attributes.
 * Used to check valid vlues when creating an HTML element.
 */
const ValidElementAttributes_ = [
    // Global Attributes
    "accesskey",
    "autocapitalize",
    "class",
    "contenteditable",
    "contextmenu",
    "dir",
    "draggable",
    "enterkeyhint",
    "hidden",
    "id",
    "inputmode",
    "is",
    "lang",
    "nonce",
    "part",
    "slot",
    "spellcheck",
    "tabindex",
    "title",
    "translate",
    // Form Attributes
    "accept",
    "action",
    "autofocus",
    "autocomplete",
    "checked",
    "cols",
    "dirname",
    "disabled",
    "enctype",
    "form",
    "formaction",
    "formenctype",
    "formmethod",
    "formnovalidate",
    "formtarget",
    "height",
    "list",
    "max",
    "maxlength",
    "min",
    "minlength",
    "method",
    "multiple",
    "name",
    "novalidate",
    "pattern",
    "placeholder",
    "readonly",
    "required",
    "rows",
    "selected",
    "size",
    "src",
    "step",
    "type",
    "value",
    "width",
    "wrap",
    // Media Attributes
    "alt",
    "autoplay",
    "controls",
    "crossorigin",
    "loop",
    "muted",
    "poster",
    "preload",
    // Anchor and Link Attributes
    "download",
    "href",
    "hreflang",
    "media",
    "ping",
    "referrerpolicy",
    "rel",
    "target",
    // Script Attributes
    "async",
    "defer",
    "integrity",
    "nomodule",
    // Presentation attributes
    "style",
    "clip-path",
    "clip-rule",
    "color",
    "color-interpolation",
    "color-rendering",
    "cursor",
    "display",
    "fill",
    "fill-opacity",
    "fill-rule",
    "filter",
    "mask",
    "opacity",
    "pointer-events",
    "shape-rendering",
    "stroke",
    "stroke-dasharray",
    "stroke-dashoffset",
    "stroke-linecap",
    "stroke-linejoin",
    "stroke-miterlimit",
    "stroke-opacity",
    "stroke-width",
    "transform",
    "vector-effect",
    "visibility",
    // Conditional processing attributes
    "requiredFeatures",
    "systemLanguage",
    // Geometry attributes
    "cx",
    "cy",
    "d",
    "r",
    "rx",
    "ry",
    "x",
    "x1",
    "x2",
    "y",
    "y1",
    "y2",
    // Path-specific attributes
    "pathLength",
    // Text content attributes
    "font-family",
    "font-size",
    "font-weight",
    "text-anchor",
    "text-decoration",
    "dominant-baseline",
    // Gradient and pattern attributes
    "gradientTransform",
    "gradientUnits",
    "patternTransform",
    "patternUnits",
    "spreadMethod",
    // Animation attributes
    "attributeName",
    "attributeType",
    "begin",
    "dur",
    "end",
    "repeatCount",
    "repeatDur",
    "restart",
    // ARIA attributes
    "aria-label",
    "aria-hidden",
    "role",
    // Other common attributes
    "viewBox",
    "preserveAspectRatio",
    "xmlns",
];
/**
 * Checks if an element property(its name and value), are valid HTML element attributes.
 * @param key Name of the attribute
 * @param value Value of the attribute
 * @returns Whether it is a valid attribute.
 */
function IsValidElementProperty_(key, value) {
    if (ValidElementAttributes_.includes(key) || key.startsWith("data-")) {
        return typeof value !== "function" && typeof value !== "object";
    }
    return false;
}
/**
 * Allowed event names for HTML elements.
 */
const Events_ = [
    "onabort",
    "onafterprint",
    "onanimationcancel",
    "onanimationend",
    "onanimationiteration",
    "onanimationstart",
    "onauxclick",
    "onbeforeinput",
    "onbeforeprint",
    "onbeforeunload",
    "onblur",
    "oncanplay",
    "oncanplaythrough",
    "onchange",
    "onclick",
    "onclose",
    "oncontextmenu",
    "oncopy",
    "oncuechange",
    "oncut",
    "ondblclick",
    "ondrag",
    "ondragend",
    "ondragenter",
    "ondragexit",
    "ondragleave",
    "ondragover",
    "ondragstart",
    "ondrop",
    "ondurationchange",
    "onemptied",
    "onended",
    "onerror",
    "onfocus",
    "onformdata",
    "onfullscreenchange",
    "onfullscreenerror",
    "ongamepadconnected",
    "ongamepaddisconnected",
    "ongotpointercapture",
    "onhashchange",
    "oninput",
    "oninvalid",
    "onkeydown",
    "onkeypress",
    "onkeyup",
    "onlanguagechange",
    "onload",
    "onloadeddata",
    "ononloadedmetadata",
    "onloadstart",
    "onlostpointercapture",
    "onmessage",
    "onmessageerror",
    "onmousedown",
    "onmousemove",
    "onmouseout",
    "onmouseover",
    "onmouseup",
    "onoffline",
    "ononline",
    "onpagehide",
    "onpageshow",
    "onpaste",
    "onpause",
    "onplay",
    "onplaying",
    "onpointercancel",
    "onpointerdown",
    "onpointerenter",
    "onpointerleave",
    "onpointermove",
    "onpointerout",
    "onpointerover",
    "onpointerup",
    "onpopstate",
    "onprogress",
    "onratechange",
    "onrejectionhandled",
    "onreset",
    "onresize",
    "onscroll",
    "onscrollend",
    "onsecuritypolicyviolation",
    "onseeked",
    "onseeking",
    "onselect",
    "onselectionchange",
    "onselectstart",
    "onslotchange",
    "onstalled",
    "onstorage",
    "onsubmit",
    "onsuspend",
    "ontimeupdate",
    "ontoggle",
    "ontransitioncancel",
    "ontransitionend",
    "ontransitionrun",
    "ontransitionstart",
    "onunhandledrejection",
    "onunload",
    "onvolumechange",
    "onwaiting",
    "onwebkitanimationend",
    "onwebkitanimationiteration",
    "onwebkitanimationstart",
    "onwebkittransitionend",
];
/**
 * Checks if an attribute(name and value), are valid event listeners.
 * @param key Name of the event listender
 * @param value Listener function.
 * @returns
 */
function IsEventListener_(key, value) {
    return Events_.includes(key.toLowerCase()) && typeof value == "function";
}
/**
 * Flattens an array, makes sure no child objects are nested arrays.
 * @param items The array to flatten
 * @returns The flattened array.
 */
function Spread_(items) {
    let spread = [];
    items.map((x) => {
        if (Array.isArray(x)) {
            spread = spread.concat(Spread_(x));
        }
        else {
            spread.push(x);
        }
    });
    return spread;
}
/**
 * Creates a CurlUIRenderElement, a wrapper oven an element CurlUI can render on the DOM.
 * @param tag The element tag
 * @param properties Attributes to assign to the element
 * @param children The elements child elements.
 * @returns A CurlUIRenderElement.
 */
function CreateElement_(tag, properties, ...children) {
    let spreadChildren = Spread_(children);
    if (properties.children) {
        if (Array.isArray(properties.children)) {
            spreadChildren = Spread_([
                ...spreadChildren,
                ...Spread_(properties.children),
            ]);
        }
        else {
            spreadChildren = Spread_([
                ...spreadChildren,
                ...Spread_([properties.children]),
            ]);
        }
        delete properties.children;
    }
    let loadedChildren = [];
    for (let i = 0; i < spreadChildren.length; ++i) {
        let child = spreadChildren[i];
        if (typeof child === "string" ||
            typeof child === "number" ||
            typeof child === "boolean") {
            let wrapped = CreateElement_("span", {});
            wrapped.element.textContent = child.toString();
            loadedChildren.push(wrapped);
        }
        else {
            if (child) {
                loadedChildren.push(child);
            }
        }
    }
    let element = IsSvgTag_(tag)
        ? document.createElementNS("http://www.w3.org/2000/svg", tag)
        : document.createElement(tag);
    let elementWrapper = {
        isElement: true,
        elementId: GetUniqueId_(),
        element: element,
        parent: null,
        children: loadedChildren,
        __mounted__: false,
        setParent(parent) {
            this.parent = parent;
        },
        _mounting_() {
            var _a, _b;
            (_a = this.mounting) === null || _a === void 0 ? void 0 : _a.call(this);
            (_b = this.children) === null || _b === void 0 ? void 0 : _b.map((child) => {
                child._mounting_.bind(child)();
            });
        },
        _mounted_() {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                this.__mounted__ = true;
                (_a = this.mounted) === null || _a === void 0 ? void 0 : _a.call(this);
                (_b = this.children) === null || _b === void 0 ? void 0 : _b.map((child) => {
                    child._mounted_.bind(child)();
                });
            });
        },
        _unmounting_() {
            var _a, _b;
            (_a = this.unmounting) === null || _a === void 0 ? void 0 : _a.call(this);
            (_b = this.children) === null || _b === void 0 ? void 0 : _b.map((child) => {
                child._unmounting_.bind(child)();
            });
        },
        _unmounted_() {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                this.__mounted__ = false;
                (_a = this.unmounted) === null || _a === void 0 ? void 0 : _a.call(this);
                (_b = this.children) === null || _b === void 0 ? void 0 : _b.map((child) => {
                    child._unmounted_.bind(child)();
                });
            });
        },
    };
    if (properties.className) {
        let classes = properties.className
            .split(" ")
            .map((t) => {
            return t.trim();
        })
            .filter((t) => {
            return t.length > 0;
        });
        element.classList.add(...classes);
    }
    if (properties.class) {
        let classes = properties.class
            .split(" ")
            .map((t) => {
            return t.trim();
        })
            .filter((t) => {
            return t.length > 0;
        });
        element.classList.add(...classes);
    }
    if (properties.style) {
        Object.assign(element.style, properties.style);
    }
    if (properties.instanceReference) {
        properties.instanceReference.instance = element;
    }
    Object.keys(properties).map((key) => {
        if (["instanceReference", "style", "className", "class"].includes(key)) {
            return;
        }
        if (IsEventListener_(key, properties[key])) {
            element.addEventListener(key.slice(2).toLowerCase(), properties[key]);
        }
        else if (IsValidElementProperty_(key, properties[key])) {
            try {
                element.setAttribute(key, properties[key]);
            }
            catch (e) {
                //
                console.error(e);
            }
        }
    });
    loadedChildren.map((child) => {
        child.setParent(elementWrapper);
        element.appendChild(child.element);
    });
    return elementWrapper;
}
/**
 * Wraps a custom component creation properties.
 * @param properties The component creation properties.
 * @returns The wrapped component template
 */
function WrapComponent_(properties) {
    let component = Object.assign(Object.assign({}, properties), { isComponent: true, componentId: GetUniqueId_() });
    return component;
}
/**
 * Generates a function for custom element creation. From a wrapped custom component properties.
 * @param properties The custom component's properties.
 * @returns An element constructor function that takes props.
 */
function CreateComponent_(properties) {
    let component = WrapComponent_(properties);
    let wrapper = function (props) {
        return CreateComponentInstance_(component, props);
    };
    Object.assign(wrapper, component);
    return wrapper;
}
/**
 * Creates a component instance from a custom component's properties.
 * @param component The wrapped component
 * @param properties Props to pass to the custom component's constructor.
 * @returns A component instance, which is renderable to the DOM
 */
function CreateComponentInstance_(component, properties) {
    var _a;
    let blankElement = CreateElement_("div", {});
    let instance = Object.assign(Object.assign(Object.assign({}, blankElement), component), { instanceId: GetUniqueId_(), state: {}, props: {}, getState() {
            return this.state;
        },
        getProps() {
            return this.props;
        },
        setState(state, skipUpdate = false) {
            var _a, _b, _c, _d, _e, _f;
            let previousState = this.getState(), newState = Object.assign(Object.assign({}, previousState), state);
            this.state = newState;
            if (skipUpdate) {
                return;
            }
            let update = this.update
                ? this.update(previousState, newState)
                : true;
            if (update === true) {
                try {
                    (_a = this.updating) === null || _a === void 0 ? void 0 : _a.call(this);
                    let previousHtmlElement = this.element, newComponent = this.render();
                    (_b = this.children) === null || _b === void 0 ? void 0 : _b.map((child) => {
                        child._unmounting_.bind(child)();
                    });
                    (_c = newComponent.children) === null || _c === void 0 ? void 0 : _c.map((child) => {
                        child._mounting_.bind(child)();
                    });
                    previousHtmlElement.replaceWith(newComponent.element);
                    (_d = this.children) === null || _d === void 0 ? void 0 : _d.map((child) => {
                        child._unmounted_.bind(child)();
                    });
                    Object.assign(this, {
                        element: newComponent.element,
                        children: newComponent.children,
                    });
                    (_e = this.children) === null || _e === void 0 ? void 0 : _e.map((child) => {
                        child.setParent(this);
                        child._mounted_.bind(child)();
                    });
                    (_f = this.updated) === null || _f === void 0 ? void 0 : _f.call(this);
                }
                catch (e) {
                    console.error(e);
                }
            }
        },
        initialize() {
            this.props = this.getDefaultProps
                ? Object.assign(Object.assign({}, this.getDefaultProps()), properties) : properties;
            this.state = this.getInitialState ? this.getInitialState() : {};
            Object.assign(this, this.render());
        } });
    instance.initialize();
    if ((_a = properties.instanceReference) === null || _a === void 0 ? void 0 : _a.isInstanceReference) {
        properties.instanceReference.instance = instance;
    }
    return instance;
}
/**
 * Actually renders a renderable CurlUI element to the DOM element specified
 * @param element
 * @param htmlElement
 */
function Render_(element, htmlElement) {
    element.setParent(htmlElement);
    htmlElement.innerHTML = "";
    element._mounting_();
    htmlElement.appendChild(element.element);
    element._mounted_();
}
/**
 * Constructor function for an instanceReference handle that can be used to externally refer to a component instance
 * @returns
 */
function InstanceReference_() {
    return {
        isInstanceReference: true,
        instance: null,
    };
}
/**
 * Constructor for a CurlUIStore,a watchable properties object,
 * listeners can be bound to it for each time the state of the store chages.
 * @param state The initial state of the store.
 * @returns The store object.
 */
function Store_(state) {
    return {
        state: state,
        handlers: {},
        getState() {
            return this.state;
        },
        setState(state) {
            this.state = Object.assign(Object.assign({}, this.state), state);
            Object.values(this.handlers).map((handler) => {
                handler(this.state);
            });
        },
        subscribe(handler) {
            let handlerId = GetUniqueId_();
            this.handlers[handlerId] = handler;
            return handlerId;
        },
        unsubscribe(handlerId) {
            delete this.handlers[handlerId];
        },
    };
}
/**
 * Creates a CurlUIRenderElement, a wrapper oven an element CurlUI can render on the DOM.
 * @param tag The element tag
 * @param properties Attributes to assign to the element
 * @param children The elements child elements.
 * @returns A CurlUIRenderElement.
 */
function CreateElement(tag, properties, ...children) {
    return CreateElement_(tag, properties, ...children);
}
/**
 * Generates a function for custom element creation. From a wrapped custom component properties.
 * @param properties The custom component's properties.
 * @returns An element constructor function that takes props.
 */
function CreateComponent(properties) {
    return CreateComponent_(properties);
}
/**
 * Constructor function for an instanceReference handle that can be used to externally refer to a component instance
 * @returns
 */
function InstanceReference() {
    return InstanceReference_();
}
/**
 * Actually renders a renderable CurlUI element to the DOM element specified
 * @param element
 * @param htmlElement
 */
function Render(element, htmlElement) {
    return Render_(element, htmlElement);
}
/**
 * Constructor for a CurlUIStore,a watchable properties object,
 * listeners can be bound to it for each time the state of the store chages.
 * @param state The initial state of the store.
 * @returns The store object.
 */
function Store(defaultState) {
    return Store_(defaultState);
}
