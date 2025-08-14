import { CreateElement } from "./index";
function _withChildren(type, props, key) {
    var _a;
    if (Array.isArray(props.children)) {
        return CreateElement(type, props, ...props.children.map((child) => {
            return jsx(child.type, child.props, child.key);
        }));
    }
    else if ((_a = props.children) === null || _a === void 0 ? void 0 : _a.type) {
        return CreateElement(type, props, jsx(props.children.type, props.children.props, props.children.key));
    }
    else {
        return CreateElement(type, props, `${props.children}`);
    }
}
function _withProps(type, props, key) {
    if (props.children) {
        return _withChildren(type, props, key);
    }
    else {
        return CreateElement(type, props);
    }
}
export function jsx(type, props, key) {
    if (props) {
        return _withProps(type, props, key);
    }
    else {
        return CreateElement(type, {});
    }
}
export const jsxs = jsx;
