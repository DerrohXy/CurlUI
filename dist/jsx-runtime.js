import { CreateElement } from "./index";
function _parseChild(child) {
    if (child.type) {
        return jsx(child.type, child.props, child.key);
    }
    else {
        return child;
    }
}
function _withChildren(type, props, key) {
    if (Array.isArray(props.children)) {
        return CreateElement(type, props, ...props.children.map((child) => {
            return _parseChild(child);
        }));
    }
    else {
        return CreateElement(type, props, _parseChild(props.children));
    }
}
function _withProps(type, props, key) {
    if (typeof type === "function") {
        return type(props);
    }
    else {
        return props.children
            ? _withChildren(type, props, key)
            : CreateElement(type, props);
    }
}
function _withoutProps(type, key) {
    return typeof type === "string" ? CreateElement(type, {}) : type({});
}
export function jsx(type, props, key) {
    if (props) {
        return _withProps(type, props, key);
    }
    else {
        return _withoutProps(type, key);
    }
}
export const jsxs = jsx;
