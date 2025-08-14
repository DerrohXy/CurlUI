function GetUniqueId_() {
    let x = 0;
    for (let q = 0; q < 10; ++q) {
        x += Date.now() * Math.random();
    }
    return x.toString().replace(".", "");
}
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
function IsValidElementProperty_(key, value) {
    if (ValidElementAttributes_.includes(key) || key.startsWith("data-")) {
        return typeof value !== "function" && typeof value !== "object";
    }
    return false;
}
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
function IsEventListener_(key, value) {
    return Events_.includes(key.toLowerCase()) && typeof value == "function";
}
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
function CreateElement_(tag, properties, ...children) {
    let spreadChildren = Spread_(children);
    //
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
    //
    if (typeof tag === "string") {
        let element = IsSvgTag_(tag)
            ? document.createElementNS("http://www.w3.org/2000/svg", tag)
            : document.createElement(tag), elementWrapper = {
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
                    child._mounting_();
                });
            },
            async _mounted_() {
                var _a, _b;
                this.__mounted__ = true;
                (_a = this.mounted) === null || _a === void 0 ? void 0 : _a.call(this);
                (_b = this.children) === null || _b === void 0 ? void 0 : _b.map((child) => {
                    child._mounted_();
                });
            },
            _unmounting_() {
                var _a, _b;
                (_a = this.unmounting) === null || _a === void 0 ? void 0 : _a.call(this);
                (_b = this.children) === null || _b === void 0 ? void 0 : _b.map((child) => {
                    child._unmounting_();
                });
            },
            async _unmounted_() {
                var _a, _b;
                this.__mounted__ = false;
                (_a = this.unmounted) === null || _a === void 0 ? void 0 : _a.call(this);
                (_b = this.children) === null || _b === void 0 ? void 0 : _b.map((child) => {
                    child._unmounted_();
                });
            },
        };
        if (properties.className) {
            element.classList.add(properties.className.trim());
        }
        if (properties.style) {
            Object.assign(element.style, properties.style);
        }
        if (properties.instanceReference) {
            properties.instanceReference.instance = element;
        }
        Object.keys(properties).map((key) => {
            if (["instanceReference", "style", "className"].includes(key)) {
                return;
            }
            //
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
    else {
        let wrapper = CreateComponentInstance_(tag, properties);
        return wrapper;
    }
}
function WrapComponent_(properties) {
    let component = Object.assign(Object.assign({}, properties), { isComponent: true, componentId: GetUniqueId_() });
    return component;
}
function CreateComponent_(properties) {
    let component = Object.assign(Object.assign({}, properties), { isComponent: true, componentId: GetUniqueId_() });
    let wrapper = function (props) {
        return CreateComponentInstance_(component, props);
    };
    Object.assign(wrapper, component);
    return wrapper;
}
function CreateComponentInstance_(component, properties) {
    var _a;
    let blankElement = CreateElement_("div", {});
    let instance = Object.assign(Object.assign(Object.assign({}, component), blankElement), { instanceId: GetUniqueId_(), state: {}, props: {}, getState() {
            return this.state;
        },
        getProps() {
            return this.props;
        },
        setState(state) {
            var _a, _b, _c, _d, _e, _f;
            let previousState = this.getState(), newState = Object.assign(Object.assign({}, previousState), state), update = this.update
                ? this.update(previousState, newState)
                : true;
            this.state = newState;
            if (update === true) {
                try {
                    (_a = this.updating) === null || _a === void 0 ? void 0 : _a.call(this);
                    let previousHtmlElement = this.element, newComponent = this.render();
                    (_b = this.children) === null || _b === void 0 ? void 0 : _b.map((child) => {
                        child._unmounting_();
                    });
                    (_c = newComponent.children) === null || _c === void 0 ? void 0 : _c.map((child) => {
                        child._mounting_();
                    });
                    previousHtmlElement.replaceWith(newComponent.element);
                    (_d = this.children) === null || _d === void 0 ? void 0 : _d.map((child) => {
                        child._unmounted_();
                    });
                    Object.assign(this, {
                        element: newComponent.element,
                        children: newComponent.children,
                    });
                    (_e = this.children) === null || _e === void 0 ? void 0 : _e.map((child) => {
                        child.setParent(this);
                        child._mounted_();
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
function Render_(element, htmlElement) {
    element.setParent(htmlElement);
    htmlElement.innerHTML = "";
    element._mounting_();
    htmlElement.appendChild(element.element);
    element._mounted_();
}
function InstanceReference_() {
    return {
        isInstanceReference: true,
        instance: null,
    };
}
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
// EXPORTS
export function CreateElement(tag, properties, ...children) {
    return CreateElement_(tag, properties, ...children);
}
export function WrapComponent(properties) {
    return WrapComponent_(properties);
}
export function CreateComponent(properties) {
    return CreateComponent_(properties);
}
export function InstanceReference() {
    return InstanceReference_();
}
export function Render(element, htmlElement) {
    return Render_(element, htmlElement);
}
export function Store(defaultState) {
    return Store_(defaultState);
}
