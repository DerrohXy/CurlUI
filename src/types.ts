export type CurlUIElementHookProps = {
    mounting?: () => any;
    mounted?: () => any;
    unmounting?: () => any;
    unmounted?: () => any;
};

export type CurlUIElement = CurlUIElementHookProps & {
    isElement: boolean;
    elementId: string;
    element: CurlUINativeElement;
    parent?: CurlUIElement | HTMLElement | null;
    children?: Array<CurlUIElement>;
    setParent: (parent: CurlUIElement | HTMLElement | null) => void;
    __mounted__: boolean;
    _mounting_: () => void;
    _mounted_: () => void;
    _unmounting_: () => void;
    _unmounted_: () => void;
};

export type CurlUIElementProps<T extends CurlUINativeElement> =
    CurlUIElementAttributeProps &
        CurlUIElementEventListenerProps & {
            className?: string;
            style?: CurlUICSSProps;
            instanceReference?: CurlUIInstanceReference;
            children?: Array<CurlUIChildComponent> | CurlUIChildComponent;
            //
            [key: string]: any;
        };

export type CurlUIElementState = {
    [key: string]: any;
};

export type CurlUIComponentHookProps = CurlUIElementHookProps & {
    updating?: () => any;
    updated?: () => any;
};

export type CurlUIComponentProps = CurlUIComponentHookProps & {
    getInitialState?: () => CurlUIElementState;
    getDefaultProps?: () => CurlUIElementProps<CurlUINativeElement>;
    update?: (
        currentState: CurlUIElementState,
        newState: CurlUIElementState,
    ) => boolean;
    render: () => CurlUIRenderElement;
    //
    [key: string]: any;
};

export type CurlUIWrappedComponent = CurlUIComponentProps & {
    isComponent: boolean;
    componentId: string;
};

export type CurlUIComponent = {
    (props: CurlUIElementProps<CurlUINativeElement>): CurlUIRenderElement;
    //
};

export type CurlUIComponentInstance = CurlUIElement &
    CurlUIWrappedComponent & {
        state: CurlUIElementState;
        props: CurlUIElementProps<CurlUINativeElement>;
        setState(state: CurlUIElementState): void;
        getState(): CurlUIElementState;
        getProps(): CurlUIElementProps<CurlUINativeElement>;
        initialize(): void;
        //
        [key: string]: any;
    };

export type CurlUIInstanceReference = {
    isInstanceReference: boolean;
    instance: HTMLElement | SVGElement | CurlUIComponentInstance | null;
};

export type CurlUIRenderElement = CurlUIElement | CurlUIComponentInstance;
export type CurlUINode = CurlUIRenderElement;

export type CurlUINativeElement = HTMLElement | SVGElement;

export type CurlUIStoreState = {
    [key: string]: any;
};

export type CurlUIStoreHandlers = {
    [key: string]: Function;
};

export type CurlUIStore = {
    state: CurlUIStoreState;
    handlers: CurlUIStoreHandlers;
    getState(): CurlUIStoreState;
    setState(state: CurlUIStoreState): void;
    subscribe(handler: Function): string;
    unsubscribe(handlerId: string): void;
};

export type CurlUIChildComponent =
    | string
    | number
    | boolean
    | CurlUIElement
    | null;

export type CurlUISvgTag =
    | string
    | "svg"
    | "path"
    | "circle"
    | "ellipse"
    | "line"
    | "polygon"
    | "polyline"
    | "rect"
    | "g"
    | "title"
    | "defs"
    | "clipPath"
    | "stop"
    | "linearGradient"
    | "radialGradient";

export type CurlUIHtmlTag =
    | CurlUISvgTag
    | "a"
    | "abbr"
    | "address"
    | "area"
    | "article"
    | "aside"
    | "audio"
    | "b"
    | "base"
    | "bdi"
    | "bdo"
    | "blockquote"
    | "body"
    | "br"
    | "button"
    | "canvas"
    | "caption"
    | "cite"
    | "code"
    | "col"
    | "colgroup"
    | "data"
    | "datalist"
    | "dd"
    | "del"
    | "details"
    | "dfn"
    | "dialog"
    | "div"
    | "dl"
    | "dt"
    | "em"
    | "embed"
    | "fieldset"
    | "figcaption"
    | "figure"
    | "footer"
    | "form"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "head"
    | "header"
    | "hgroup"
    | "hr"
    | "html"
    | "i"
    | "iframe"
    | "img"
    | "input"
    | "ins"
    | "kbd"
    | "label"
    | "legend"
    | "li"
    | "link"
    | "main"
    | "map"
    | "mark"
    | "menu"
    | "meta"
    | "meter"
    | "nav"
    | "noscript"
    | "object"
    | "ol"
    | "optgroup"
    | "option"
    | "output"
    | "p"
    | "picture"
    | "pre"
    | "progress"
    | "q"
    | "rp"
    | "rt"
    | "ruby"
    | "s"
    | "samp"
    | "script"
    | "section"
    | "select"
    | "slot"
    | "small"
    | "source"
    | "span"
    | "strong"
    | "style"
    | "sub"
    | "summary"
    | "sup"
    | "table"
    | "tbody"
    | "td"
    | "template"
    | "textarea"
    | "tfoot"
    | "th"
    | "thead"
    | "time"
    | "title"
    | "tr"
    | "track"
    | "u"
    | "ul"
    | "var"
    | "video"
    | "wbr";

export type CurlUITag = CurlUIHtmlTag;
export type CurlUICSSProps = {
    // Background
    background?: string;
    backgroundAttachment?: "scroll" | "fixed" | "local" | string;
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundPosition?: string;
    backgroundRepeat?:
        | "repeat"
        | "repeat-x"
        | "repeat-y"
        | "no-repeat"
        | string;

    // Border
    border?: string;
    borderBottom?: string;
    borderBottomColor?: string;
    borderBottomStyle?:
        | "none"
        | "hidden"
        | "dotted"
        | "dashed"
        | "solid"
        | "double"
        | "groove"
        | "ridge"
        | "inset"
        | "outset"
        | string;
    borderBottomWidth?: string;
    borderColor?: string;
    borderLeft?: string;
    borderLeftColor?: string;
    borderLeftStyle?:
        | "none"
        | "hidden"
        | "dotted"
        | "dashed"
        | "solid"
        | "double"
        | "groove"
        | "ridge"
        | "inset"
        | "outset"
        | string;
    borderLeftWidth?: string;
    borderRadius?: string;
    borderRight?: string;
    borderRightColor?: string;
    borderRightStyle?:
        | "none"
        | "hidden"
        | "dotted"
        | "dashed"
        | "solid"
        | "double"
        | "groove"
        | "ridge"
        | "inset"
        | "outset"
        | string;
    borderRightWidth?: string;
    borderStyle?:
        | "none"
        | "hidden"
        | "dotted"
        | "dashed"
        | "solid"
        | "double"
        | "groove"
        | "ridge"
        | "inset"
        | "outset"
        | string;
    borderTop?: string;
    borderTopColor?: string;
    borderTopStyle?:
        | "none"
        | "hidden"
        | "dotted"
        | "dashed"
        | "solid"
        | "double"
        | "groove"
        | "ridge"
        | "inset"
        | "outset"
        | string;
    borderTopWidth?: string;
    borderWidth?: string;

    // Box & Display
    boxShadow?: string;
    boxSizing?: "border-box" | "content-box" | string;
    clear?: "none" | "left" | "right" | "both" | string;
    display?:
        | "none"
        | "block"
        | "inline"
        | "inline-block"
        | "flex"
        | "grid"
        | "inline-flex"
        | "inline-grid"
        | "contents"
        | "list-item"
        | "table"
        | "table-row"
        | "table-cell"
        | string;
    float?: "none" | "left" | "right" | "inline-start" | "inline-end" | string;
    width?: string;
    height?: string;
    minWidth?: string;
    minHeight?: string;
    maxWidth?: string;
    maxHeight?: string;
    padding?: string;
    paddingTop?: string;
    paddingLeft?: string;
    paddingBottom?: string;
    paddingRight?: string;
    margin?: string;
    marginTop?: string;
    marginLeft?: string;
    marginRight?: string;
    marginBottom?: string;

    // Position
    position?: "static" | "relative" | "absolute" | "fixed" | "sticky" | string;
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    zIndex?: number | string;

    // Overflow
    overflow?: "visible" | "hidden" | "scroll" | "auto" | string;
    overflowX?: "visible" | "hidden" | "scroll" | "auto" | string;
    overflowY?: "visible" | "hidden" | "scroll" | "auto" | string;

    // Visibility
    visibility?: "visible" | "hidden" | "collapse" | string;

    // Typography
    color?: string;
    fontFamily?: string;
    fontSize?: string;
    fontStyle?: "normal" | "italic" | "oblique" | string;
    fontVariant?: string;
    fontWeight?:
        | "normal"
        | "bold"
        | "bolder"
        | "lighter"
        | "100"
        | "200"
        | "300"
        | "400"
        | "500"
        | "600"
        | "700"
        | "800"
        | "900"
        | string;
    letterSpacing?: string;
    lineHeight?: string;
    textAlign?:
        | "left"
        | "right"
        | "center"
        | "justify"
        | "start"
        | "end"
        | string;
    textDecoration?:
        | "none"
        | "underline"
        | "overline"
        | "line-through"
        | string;
    textOverflow?: "clip" | "ellipsis" | string;
    textTransform?: "none" | "capitalize" | "uppercase" | "lowercase" | string;
    whiteSpace?: "normal" | "nowrap" | "pre" | "pre-line" | "pre-wrap" | string;

    // Flex
    alignItems?:
        | "stretch"
        | "center"
        | "flex-start"
        | "flex-end"
        | "baseline"
        | string;
    alignContent?:
        | "stretch"
        | "center"
        | "flex-start"
        | "flex-end"
        | "space-between"
        | "space-around"
        | string;
    alignSelf?:
        | "auto"
        | "stretch"
        | "center"
        | "flex-start"
        | "flex-end"
        | "baseline"
        | string;
    justifyContent?:
        | "flex-start"
        | "flex-end"
        | "center"
        | "space-between"
        | "space-around"
        | "space-evenly"
        | string;
    flexDirection?:
        | "row"
        | "row-reverse"
        | "column"
        | "column-reverse"
        | string;
    flexWrap?: "nowrap" | "wrap" | "wrap-reverse" | string;
    flexGrow?: string;

    // Cursor
    cursor?:
        | "auto"
        | "default"
        | "pointer"
        | "wait"
        | "text"
        | "move"
        | "not-allowed"
        | "crosshair"
        | "zoom-in"
        | "zoom-out"
        | string;

    // Animation
    animationDirection?:
        | "normal"
        | "reverse"
        | "alternate"
        | "alternate-reverse"
        | string;
    animationFillMode?: "none" | "forwards" | "backwards" | "both" | string;
    animationPlayState?: "running" | "paused" | string;
    animationTimingFunction?:
        | "ease"
        | "linear"
        | "ease-in"
        | "ease-out"
        | "ease-in-out"
        | string;

    // Misc
    opacity?: string | number;
    pointerEvents?:
        | "auto"
        | "none"
        | "visiblePainted"
        | "visibleFill"
        | "visibleStroke"
        | "visible"
        | "painted"
        | "fill"
        | "stroke"
        | "all"
        | string;
    resize?: "none" | "both" | "horizontal" | "vertical" | string;
    userSelect?: "auto" | "text" | "none" | "contain" | "all" | string;

    // Any unknown props
    [key: string]: any;
};

export type CurlUIElementAttributeProps = {
    // Global attributes
    accesskey?: string;
    autocapitalize?:
        | "off"
        | "none"
        | "on"
        | "sentences"
        | "words"
        | "characters"
        | string;
    class?: string;
    contenteditable?: boolean | "true" | "false";
    contextmenu?: string;
    dir?: "ltr" | "rtl" | "auto";
    draggable?: boolean | "true" | "false";
    enterkeyhint?:
        | "enter"
        | "done"
        | "go"
        | "next"
        | "previous"
        | "search"
        | "send"
        | string;
    hidden?: boolean | "true" | "false";
    id?: string;
    inputmode?:
        | "none"
        | "text"
        | "decimal"
        | "numeric"
        | "tel"
        | "search"
        | "email"
        | "url"
        | string;
    is?: string;
    lang?: string;
    nonce?: string;
    part?: string;
    slot?: string;
    spellcheck?: boolean | "true" | "false";
    tabindex?: number | string;
    title?: string;
    translate?: "yes" | "no";

    // Form-related attributes
    accept?: string;
    action?: string;
    autofocus?: boolean | "true" | "false";
    autocomplete?: "on" | "off" | string;
    checked?: boolean | "true" | "false";
    cols?: number | string;
    dirname?: string;
    disabled?: boolean | "true" | "false";
    form?: string;
    formaction?: string;
    formenctype?:
        | "application/x-www-form-urlencoded"
        | "multipart/form-data"
        | "text/plain"
        | string;
    formmethod?: "get" | "post" | "dialog" | string;
    formnovalidate?: boolean | "true" | "false";
    formtarget?: "_self" | "_blank" | "_parent" | "_top" | string;
    list?: string;
    max?: string | number;
    maxlength?: number | string;
    min?: string | number;
    minlength?: number | string;
    method?: "get" | "post" | "dialog" | string;
    multiple?: boolean | "true" | "false";
    name?: string;
    novalidate?: boolean | "true" | "false";
    pattern?: string;
    placeholder?: string;
    readonly?: boolean | "true" | "false";
    required?: boolean | "true" | "false";
    rows?: number | string;
    selected?: boolean | "true" | "false";
    size?: number | string;
    step?: number | string;
    value?: string | number;
    wrap?: "hard" | "soft" | "off" | string;

    // Media-related attributes
    alt?: string;
    autoplay?: boolean | "true" | "false";
    controls?: boolean | "true" | "false";
    height?: string | number;
    loop?: boolean | "true" | "false";
    muted?: boolean | "true" | "false";
    poster?: string;
    preload?: "none" | "metadata" | "auto" | string;
    width?: string | number;

    // Anchor & link-related
    download?: boolean | string;
    href?: string;
    hreflang?: string;
    media?: string;
    ping?: string;
    rel?:
        | "alternate"
        | "author"
        | "bookmark"
        | "external"
        | "help"
        | "license"
        | "next"
        | "nofollow"
        | "noopener"
        | "noreferrer"
        | "prev"
        | "search"
        | "tag"
        | string;
    target?: "_self" | "_blank" | "_parent" | "_top" | string;

    // Script attributes
    async?: boolean | "true" | "false";
    defer?: boolean | "true" | "false";
    src?: string;
    type?: string;
    crossorigin?: "anonymous" | "use-credentials" | string;
    integrity?: string;
    nomodule?: boolean | "true" | "false";
    referrerpolicy?:
        | "no-referrer"
        | "no-referrer-when-downgrade"
        | "origin"
        | "origin-when-cross-origin"
        | "same-origin"
        | "strict-origin"
        | "strict-origin-when-cross-origin"
        | "unsafe-url"
        | string;

    // Allow any other attribute or custom prop
    [key: string]: any;
};

export type CurlUIElementEventListenerProps = {
    onafterprint?: Function;
    onanimationcancel?: Function;
    onanimationend?: Function;
    onanimationiteration?: Function;
    onanimationstart?: Function;
    onauxclick?: Function;
    onbeforeinput?: Function;
    onbeforeprint?: Function;
    onbeforeunload?: Function;
    onblur?: Function;
    oncanplay?: Function;
    oncanplaythrough?: Function;
    onchange?: Function;
    onclick?: Function;
    onclose?: Function;
    oncontextmenu?: Function;
    oncopy?: Function;
    oncuechange?: Function;
    oncut?: Function;
    ondblclick?: Function;
    ondrag?: Function;
    ondragend?: Function;
    ondragenter?: Function;
    ondragexit?: Function;
    ondragleave?: Function;
    ondragover?: Function;
    ondragstart?: Function;
    ondrop?: Function;
    ondurationchange?: Function;
    onemptied?: Function;
    onended?: Function;
    onerror?: Function;
    onfocus?: Function;
    onformdata?: Function;
    onfullscreenchange?: Function;
    onfullscreenerror?: Function;
    ongamepadconnected?: Function;
    ongamepaddisconnected?: Function;
    ongotpointercapture?: Function;
    onhashchange?: Function;
    oninput?: Function;
    oninvalid?: Function;
    onkeydown?: Function;
    onkeypress?: Function;
    onkeyup?: Function;
    onlanguagechange?: Function;
    onload?: Function;
    onloadeddata?: Function;
    ononloadedmetadata?: Function;
    onloadstart?: Function;
    onlostpointercapture?: Function;
    onmessage?: Function;
    onmessageerror?: Function;
    onmousedown?: Function;
    onmousemove?: Function;
    onmouseout?: Function;
    onmouseover?: Function;
    onmouseup?: Function;
    onoffline?: Function;
    ononline?: Function;
    onpagehide?: Function;
    onpageshow?: Function;
    onpaste?: Function;
    onpause?: Function;
    onplay?: Function;
    onplaying?: Function;
    onpointercancel?: Function;
    onpointerdown?: Function;
    onpointerenter?: Function;
    onpointerleave?: Function;
    onpointermove?: Function;
    onpointerout?: Function;
    onpointerover?: Function;
    onpointerup?: Function;
    onpopstate?: Function;
    onprogress?: Function;
    onratechange?: Function;
    onrejectionhandled?: Function;
    onreset?: Function;
    onresize?: Function;
    onscroll?: Function;
    onscrollend?: Function;
    onsecuritypolicyviolation?: Function;
    onseeked?: Function;
    onseeking?: Function;
    onselect?: Function;
    onselectionchange?: Function;
    onselectstart?: Function;
    onslotchange?: Function;
    onstalled?: Function;
    onstorage?: Function;
    onsubmit?: Function;
    onsuspend?: Function;
    ontimeupdate?: Function;
    ontoggle?: Function;
    ontransitioncancel?: Function;
    ontransitionend?: Function;
    ontransitionrun?: Function;
    ontransitionstart?: Function;
    onunhandledrejection?: Function;
    onunload?: Function;
    onvolumechange?: Function;
    onwaiting?: Function;
    onwebkitanimationend?: Function;
    onwebkitanimationiteration?: Function;
    onwebkitanimationstart?: Function;
    onwebkittransitionend?: Function;
    //
    [key: string]: any;
};
