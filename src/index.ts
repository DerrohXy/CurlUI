import {
    CurlUITag,
    CurlUIElementProps,
    CurlUIChildComponent,
    CurlUIRenderElement,
    CurlUIElement,
    CurlUIComponentProps,
    CurlUIWrappedComponent,
    CurlUIComponentInstance,
    CurlUIComponent,
    CurlUIStore,
    CurlUIStoreState,
    CurlUINativeElement,
} from "./types";

/**
 * Generates a supposedly unique string.
 * @returns A "unique" string : I HAVE NO GUARANTEE FOR THIS.
 * It just happens to be sufficient for this case.
 */
function getUniqueId(): string {
    return crypto.randomUUID();
}

/**
 * Checks if an element tag is an svg tag
 * @param tag The tag to check
 * @returns Whether its an svg tag
 */
function isSvgTag(tag: string = ""): boolean {
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
const ValidElementAttributes = [
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
 * Checks if an element property(its name and value),
 * are valid HTML element attributes.
 * @param key Name of the attribute
 * @param value Value of the attribute
 * @returns Whether it is a valid attribute.
 */
function isValidElementProperty(key: string, value: any): boolean {
    if (ValidElementAttributes.includes(key) || key.startsWith("data-")) {
        return typeof value !== "function" && typeof value !== "object";
    }

    return false;
}

/**
 * Allowed event names for HTML elements.
 */
const Events: Array<string> = [
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
function isEventListener(key: string, value: any) {
    return Events.includes(key.toLowerCase()) && typeof value == "function";
}

/**
 * Flattens an array, makes sure no child objects are nested arrays.
 * @param items The array to flatten
 * @returns The flattened array.
 */
function spread(items: Array<any>): Array<any> {
    let spread_: Array<any> = [];

    items.map((x) => {
        if (Array.isArray(x)) {
            spread_ = spread_.concat(spread(x));
        } else {
            spread_.push(x);
        }
    });

    return spread_;
}

/**
 * Wraps a custom component creation properties.
 * @param properties The component creation properties.
 * @returns The wrapped component template
 */
function wrapComponent(
    properties: CurlUIComponentProps,
): CurlUIWrappedComponent {
    let component: CurlUIWrappedComponent = {
        ...properties,
        isComponent: true,
        componentId: getUniqueId(),
    };

    return component;
}

/**
 * Creates a component instance from a custom component's properties.
 * @param component The wrapped component
 * @param properties Props to pass to the custom component's constructor.
 * @returns A component instance, which is renderable to the DOM
 */
function createComponentInstance(
    component: CurlUIWrappedComponent,
    properties: CurlUIElementProps<CurlUINativeElement>,
): CurlUIComponentInstance {
    let blankElement = CreateElement("div", {});

    let instance: CurlUIComponentInstance = {
        ...blankElement,
        ...component,
        instanceId: getUniqueId(),
        state: {},
        props: {},
        getState() {
            return this.state;
        },
        getProps() {
            return this.props;
        },
        setState(state, skipUpdate = false) {
            let previousState = this.getState(),
                newState = {
                    ...previousState,
                    ...state,
                };

            this.state = newState;

            if (skipUpdate) {
                return;
            }

            let update = this.update
                ? this.update(previousState, newState)
                : true;

            if (update === true) {
                try {
                    this.updating?.();
                    let previousHtmlElement = this.element,
                        newComponent: CurlUIRenderElement = this.render();

                    this.children?.map((child) => {
                        child._unmounting_.bind(child)();
                    });

                    newComponent.children?.map((child) => {
                        child._mounting_.bind(child)();
                    });

                    previousHtmlElement.replaceWith(newComponent.element);

                    this.children?.map((child) => {
                        child._unmounted_.bind(child)();
                    });

                    Object.assign(this, {
                        element: newComponent.element,
                        children: newComponent.children,
                    });

                    this.children?.map((child) => {
                        child.setParent(this);
                        child._mounted_.bind(child)();
                    });

                    this.updated?.();
                } catch (e) {
                    console.error(e);
                }
            }
        },
        initialize() {
            this.props = this.getDefaultProps
                ? {
                      ...this.getDefaultProps(),
                      ...properties,
                  }
                : properties;

            this.state = this.getInitialState ? this.getInitialState() : {};

            Object.assign(this, this.render());
        },
    };

    instance.initialize();
    if (properties.instanceReference?.isInstanceReference) {
        properties.instanceReference.instance = instance;
    }

    return instance;
}

/**
 * Creates a CurlUIRenderElement, a wrapper oven an element
 * CurlUI can render on the DOM.
 * @param tag The element tag
 * @param properties Attributes to assign to the element
 * @param children The elements child elements.
 * @returns A CurlUIRenderElement.
 */
export function CreateElement(
    tag: CurlUITag,
    properties: CurlUIElementProps<CurlUINativeElement>,
    ...children: Array<CurlUIChildComponent | Array<CurlUIChildComponent>>
) {
    let spreadChildren: Array<CurlUIChildComponent> = spread(children);

    if (properties.children) {
        if (Array.isArray(properties.children)) {
            spreadChildren = spread([
                ...spreadChildren,
                ...spread(properties.children),
            ]);
        } else {
            spreadChildren = spread([
                ...spreadChildren,
                ...spread([properties.children]),
            ]);
        }

        delete properties.children;
    }

    let loadedChildren: Array<CurlUIElement> = [];

    for (let i = 0; i < spreadChildren.length; ++i) {
        let child: CurlUIChildComponent = spreadChildren[i];

        if (
            typeof child === "string" ||
            typeof child === "number" ||
            typeof child === "boolean"
        ) {
            let wrapped: CurlUIElement = CreateElement("span", {});
            wrapped.element.textContent = child.toString();

            loadedChildren.push(wrapped);
        } else {
            if (child) {
                loadedChildren.push(child);
            }
        }
    }

    let element: HTMLElement | SVGElement = isSvgTag(tag)
        ? document.createElementNS("http://www.w3.org/2000/svg", tag)
        : document.createElement(tag);

    let elementWrapper: CurlUIElement = {
        isElement: true,
        elementId: getUniqueId(),
        element: element,
        parent: null,
        children: loadedChildren,
        __mounted__: false,
        setParent(parent) {
            this.parent = parent;
        },
        _mounting_() {
            this.mounting?.();
            this.children?.map((child) => {
                child._mounting_.bind(child)();
            });
        },
        async _mounted_() {
            this.__mounted__ = true;
            this.mounted?.();
            this.children?.map((child) => {
                child._mounted_.bind(child)();
            });
        },
        _unmounting_() {
            this.unmounting?.();
            this.children?.map((child) => {
                child._unmounting_.bind(child)();
            });
        },
        async _unmounted_() {
            this.__mounted__ = false;
            this.unmounted?.();
            this.children?.map((child) => {
                child._unmounted_.bind(child)();
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
        if (
            ["instanceReference", "style", "className", "class"].includes(key)
        ) {
            return;
        }

        if (isEventListener(key, properties[key])) {
            element.addEventListener(
                key.slice(2).toLowerCase(),
                properties[key],
            );
        } else if (isValidElementProperty(key, properties[key])) {
            try {
                element.setAttribute(key, properties[key]);
            } catch (e) {
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
 * Generates a function for custom element creation.
 * From a wrapped custom component properties.
 * @param properties The custom component's properties.
 * @returns An element constructor function that takes props.
 */
export function CreateComponent(
    properties: CurlUIComponentProps,
): CurlUIComponent {
    let component: CurlUIWrappedComponent = wrapComponent(properties);

    let wrapper: CurlUIComponent = function (
        props: CurlUIElementProps<CurlUINativeElement>,
    ): CurlUIRenderElement {
        return createComponentInstance(component, props);
    };

    Object.assign(wrapper, component);

    return wrapper;
}

/**
 * Constructor function for an instanceReference handle that can be
 * used to externally refer to a component instance
 * @returns
 */
export function InstanceReference() {
    return {
        isInstanceReference: true,
        instance: null,
    };
}

/**
 * Actually renders a renderable CurlUI element to the DOM element specified
 * @param element
 * @param htmlElement
 */
export function Render(
    element: CurlUIRenderElement,
    htmlElement: HTMLElement,
): void {
    element.setParent(htmlElement);
    htmlElement.innerHTML = "";

    element._mounting_();

    htmlElement.appendChild(element.element);

    element._mounted_();
}

/**
 * Constructor for a CurlUIStore,a watchable properties object,
 * listeners can be bound to it for each time the state of the store chages.
 * @param state The initial state of the store.
 * @returns The store object.
 */
export function Store(defaultState: CurlUIStoreState): CurlUIStore {
    return {
        state: defaultState,
        handlers: {},
        getState() {
            return this.state;
        },
        setState(state: CurlUIStoreState) {
            this.state = {
                ...this.state,
                ...state,
            };

            Object.values(this.handlers).map((handler) => {
                handler(this.state);
            });
        },
        subscribe(handler: Function): string {
            let handlerId = getUniqueId();
            this.handlers[handlerId] = handler;

            return handlerId;
        },
        unsubscribe(handlerId: string) {
            delete this.handlers[handlerId];
        },
    };
}
