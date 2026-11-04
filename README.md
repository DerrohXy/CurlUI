# CurlUI

A small, dependency-free, reactive UI library for the browser, written in TypeScript. It has JSX support, stateful components, keyed DOM reconciliation, batched updates and a tiny observable store.

- **No virtual DOM.** JSX evaluates straight to real DOM nodes. On re-render the new tree is reconciled against the old one, so existing nodes, focus and child state are kept.
- **Typed.** Tags, props, events and styles are derived from `lib.dom`, so typos are compile errors.
- **Small surface.** Five core functions: `CreateElement`, `CreateComponent`, `Render`, `Store`, `InstanceReference`.

---

## Contents

1. [Setup](#setup)
2. [Quick start](#quick-start)
3. [Elements and props](#elements-and-props)
4. [Components](#components)
5. [State and updates](#state-and-updates)
6. [Lists and keys](#lists-and-keys)
7. [Lifecycle hooks](#lifecycle-hooks)
8. [Refs](#refs)
9. [Stores](#stores)
10. [Fragments, `null` and arrays](#fragments-null-and-arrays)
11. [Rendering and unmounting](#rendering-and-unmounting)
12. [Security notes](#security-notes)
13. [Limitations](#limitations)
14. [API reference](#api-reference)

---

## Setup

CurlUI is source-only: copy the folder into your project (for example `src/curlui/`). It needs a DOM (`document`) and TypeScript 5.1 or newer for JSX typing.

### TypeScript

```jsonc
// tsconfig.json
{
    "compilerOptions": {
        "target": "ES2020",
        "lib": ["ES2022", "DOM", "DOM.Iterable"],
        "strict": true,
        "jsx": "react-jsx",
        "jsxImportSource": "curlui",
        "moduleResolution": "bundler",
        "paths": {
            "curlui": ["./src/curlui/index.ts"],
            "curlui/*": ["./src/curlui/*"],
        },
    },
}
```

`jsxImportSource: "curlui"` makes the compiler import `curlui/jsx-runtime` (and `curlui/jsx-dev-runtime` in development builds) for every JSX expression.

### Bundler

Your bundler must resolve the same alias. With esbuild:

```sh
esbuild src/main.tsx --bundle --jsx=automatic --jsx-import-source=curlui \
  --alias:curlui=./src/curlui/index.ts \
  --alias:curlui/jsx-runtime=./src/curlui/jsx-runtime.ts \
  --alias:curlui/jsx-dev-runtime=./src/curlui/jsx-dev-runtime.ts \
  --outfile=dist/app.js
```

With Vite, set `esbuild: { jsx: "automatic", jsxImportSource: "curlui" }` and add matching `resolve.alias` entries.

---

## Quick start

```tsx
import { CreateComponent, Render } from "curlui";

const Counter = CreateComponent<{ start?: number }, { count: number }>({
    getDefaultProps() {
        return { start: 0 };
    },
    getInitialState() {
        return { count: this.props.start ?? 0 };
    },
    render() {
        return (
            <button
                onClick={() => this.setState((s) => ({ count: s.count + 1 }))}
            >
                Clicked {this.state.count} times
            </button>
        );
    },
});

Render(<Counter start={5} />, document.getElementById("root")!);
```

---

## Elements and props

Every JSX expression returns a render element: a wrapper around a real DOM node. You can also build them without JSX:

```ts
import { CreateElement } from "curlui";

const el = CreateElement(
    "div",
    { id: "box", className: "card" },
    "Hello ",
    CreateElement("b", {}, "world"),
);
```

Props are not mutated, and children can come from the rest arguments, from `props.children`, or both.

### Attributes and properties

Props are written as DOM properties where the property can hold the value faithfully, and as attributes otherwise.

```tsx
<input value={text} disabled={false} readOnly tabIndex={0} />
<input readonly maxlength={10} />        {/* lowercase attribute spellings also work */}
<div data-id="7" aria-hidden={false} /> {/* data-* and aria-*; booleans become "true"/"false" */}
```

- **Boolean attributes** (`disabled`, `hidden`, `checked`, `required`, …) are toggled. `false`, `null`, `undefined` and `"false"` remove them.
- **`value`, `checked`, `selected`** are compared with the live DOM on every render. If your state rejects a keystroke, the input is reset to the prop value (controlled inputs).
- **`class` and `className`** both work and can be combined. Class tokens are diffed, so classes added by other code are left alone.
- **`null` / `undefined`** removes the attribute.

### Style

```tsx
<div style={{ width: 120, opacity: 0.5, "--accent": "tomato" }} />
<div style="color: red" />
```

Numbers get `px` unless the property is unitless (`opacity`, `zIndex`, `lineHeight`, `flexGrow`, …). Custom properties (`--x`) and kebab-case names use `setProperty`.

### Events

Any `on*` prop with a function value becomes an event listener. The event name is the prop name lowercased, so `onClick` and `onclick` are equivalent. Handlers are typed from `GlobalEventHandlersEventMap`:

```tsx
<input onInput={(e) => console.log(e.target)} />
<div onMouseEnter={() => {}} onWheel={(e) => e.deltaY} />
```

Listeners are swapped in place when the handler function changes. A string value (`onclick="..."`) is ignored with a console warning.

### SVG

SVG tags are created in the SVG namespace automatically, including `<title>` and `<a>` inside an `<svg>`. camelCase presentation attributes are converted: `strokeWidth` becomes `stroke-width`. Attributes such as `viewBox` keep their case.

```tsx
<svg viewBox="0 0 24 24" width={24} height={24}>
    <g strokeWidth={2} stroke="currentColor" fill="none">
        <title>Check</title>
        <path d="M5 13l4 4L19 7" strokeLinecap="round" />
    </g>
</svg>
```

---

## Components

A component is a plain definition object passed to `CreateComponent`. Pass the **props type** (and the **state type**) as explicit generics:

```tsx
import { CreateComponent } from "curlui";

type Props = { name: string };
type State = { greeted: boolean };

const Greeting = CreateComponent<Props, State>({
    getInitialState() {
        return { greeted: false };
    },
    render() {
        return (
            <p onClick={() => this.setState({ greeted: true })}>
                {this.state.greeted ? "Hello" : "Click me"}, {this.props.name}
            </p>
        );
    },
});

// JSX:
<Greeting name="Ada" />;
// or directly:
Greeting({ name: "Ada" });
```

Inside every method, `this` is the component instance:

| Member                              | Description                                                          |
| ----------------------------------- | -------------------------------------------------------------------- |
| `this.props`                        | Props, merged over `getDefaultProps()`. Includes `children`.         |
| `this.state`                        | Current state.                                                       |
| `this.setState(patch, skipUpdate?)` | Shallow-merge state. `patch` may be an object or `(state) => patch`. |
| `this.forceUpdate()`                | Schedule a re-render without changing state.                         |
| `this.bindStore(store, selector?)`  | Re-render when a [store](#stores) changes.                           |
| `this.onCleanup(fn)`                | Run `fn` when the component unmounts.                                |

### Definition members

| Member                  | Description                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| `render()`              | **Required.** Returns what to display (see [Fragments, null and arrays](#fragments-null-and-arrays)). |
| `getInitialState()`     | Initial state. Defaults to `{}`.                                                                      |
| `getDefaultProps()`     | Default prop values.                                                                                  |
| `update(current, next)` | Return `true` to allow a state-triggered re-render; any other value skips it.                         |
| Hooks                   | `mounting`, `mounted`, `updating`, `updated`, `unmounting`, `unmounted`.                              |
| Anything else           | Custom methods, available on `this`.                                                                  |

```tsx
const Form = CreateComponent<{}, { text: string }>({
    getInitialState: () => ({ text: "" }),
    handleInput(e: Event) {
        this.setState({ text: (e.target as HTMLInputElement).value });
    },
    render() {
        return (
            <input
                value={this.state.text}
                onInput={(e) => this.handleInput(e)}
            />
        );
    },
});
```

Custom methods are typed `any` by default. To type them, pass a third generic: `CreateComponent<P, S, { handleInput(e: Event): void }>`.

### Children

`this.props.children` holds whatever was nested inside the component:

```tsx
const Card = CreateComponent<{ title: string }, {}>({
    render() {
        return (
            <section>
                <h2>{this.props.title}</h2>
                {this.props.children}
            </section>
        );
    },
});

<Card title="Hi">
    <p>Body</p>
</Card>;
```

### Stateless components

Any function returning a render element can be used as a component. It has no state or hooks, and runs once per parent render:

```tsx
const Badge = (props: { text: string }) => (
    <span className="badge">{props.text}</span>
);
```

---

## State and updates

`setState` changes `this.state` **immediately** but updates the DOM **later**, batched into a single microtask.

```tsx
this.setState({ n: 1 });
this.setState({ n: 2 });
this.setState({ n: 3 });
this.state.n; // 3 right away
// ...DOM updated once, after the current call stack finishes
```

- Use the functional form when the next value depends on the previous one: `this.setState((s) => ({ n: s.n + 1 }))`.
- When several components are dirty, parents re-render first. Re-rendering a parent also refreshes its children, so a child is never rendered twice for one batch.
- Call `FlushUpdates()` if you need the DOM to be current synchronously, for example in tests.
- `setState(patch, true)` updates state without scheduling a render.

On every re-render, the new output is reconciled against what is on screen: same tag means the DOM node is reused, and same component type means the instance is reused (with its state) and receives the new props. Different tags or component types replace the node.

---

## Lists and keys

Give list items a stable `key`. Keyed nodes keep their DOM element, focus and state when the list is reordered, inserted into or filtered.

```tsx
<ul>
    {this.state.todos.map((t) => (
        <li key={t.id}>{t.text}</li>
    ))}
</ul>
```

Without keys, children are matched by position, which is fine for static lists but will reuse the wrong node when items are inserted or reordered. Keys only need to be unique among siblings, and they work on components too (`<Row key={id} />`).

---

## Lifecycle hooks

Hooks exist on components (as definition members) and on native elements (as props).

| Hook                   | When                                                |
| ---------------------- | --------------------------------------------------- |
| `mounting`             | Just before the node is attached to the document.   |
| `mounted`              | Just after. Refs are populated.                     |
| `updating` / `updated` | Around a component re-render (components only).     |
| `unmounting`           | Just before the node is removed.                    |
| `unmounted`            | After removal. Store bindings and cleanups run now. |

```tsx
<canvas
    mounted={() => console.log("canvas attached")}
    unmounted={() => console.log("gone")}
/>
```

Order is parent before child for `mounting` and `mounted`. Exceptions thrown in a hook (or rejected promises it returns) are logged and don't break the tree.

---

## Refs

An `InstanceReference` receives the DOM element for native tags, or the component instance for components. It is cleared on unmount.

```tsx
import { InstanceReference } from "curlui";

const input = InstanceReference<HTMLInputElement>();

<input instanceReference={input} />;
// after mount: input.instance?.focus()
```

`ref` is accepted as an alias of `instanceReference`.

---

## Stores

A store is a small observable object for state shared between components.

```ts
import { Store } from "curlui";

const cart = Store({ items: [] as string[], coupon: "" });

cart.setState({ coupon: "SAVE10" });
cart.setState((s) => ({ items: [...s.items, "apple"] }));
cart.getState().items;

const stop = cart.subscribe((state, previous) => console.log(state));
stop(); // unsubscribe
```

- `setState` shallow-merges, and subscribers are **not** called if no value actually changed (compared with `Object.is`).
- `select(selector, handler)` fires only when the selected value changes:

```ts
cart.select(
    (s) => s.items.length,
    (count) => console.log("items:", count),
);
```

### Using a store in a component

`bindStore` re-renders the component on change and unsubscribes automatically when it unmounts. Call it from `mounted`:

```tsx
const CartBadge = CreateComponent<{}, {}>({
    mounted() {
        this.bindStore(cart, (s) => s.items.length); // only re-render when the count changes
    },
    render() {
        return <span>{cart.getState().items.length}</span>;
    },
});
```

Omit the selector to re-render on any change.

---

## Fragments, null and arrays

Every render element maps to exactly one DOM node, and `render()` may return:

- an element: rendered as is
- `null`, `undefined` or `false`: renders nothing (an invisible placeholder keeps the position)
- an array or fragment: wrapped in a `<curl-fragment style="display:contents">` element
- a string or number: rendered as text

```tsx
render() {
    return (
        <>
            <h1>Title</h1>
            <p>Body</p>
        </>
    );
}
```

Inside children, `null`, `undefined` and booleans render nothing, and `0` renders as `"0"`, so `{cond && <X />}` is safe but `{count && <X />}` shows `0` when `count` is `0`.

---

## Rendering and unmounting

```ts
import { Render, Unmount } from "curlui";

Render(<App />, document.getElementById("root")!);
Unmount(document.getElementById("root")!);
```

`Render` unmounts whatever it previously rendered into the container (running `unmounting` / `unmounted` hooks and releasing refs and store bindings), then mounts the new tree. Updates after the first render happen through `setState`, not by calling `Render` again.

---

## Security notes

- String values for `on*` props are ignored, so they can't create inline handlers.
- `href`, `src`, `action`, `formaction`, `poster` and similar attributes reject `javascript:`, `vbscript:` and `data:text/html` values.
- `innerHTML`, `outerHTML`, `innerText` and `textContent` are not accepted as props. Text is always inserted as text nodes, so interpolated user content is escaped.
- Other URL schemes and attributes like `srcdoc` are **not** filtered. Validate untrusted URLs yourself.

---

## Limitations

- **Eager construction.** Components are built when the JSX expression is evaluated. When a parent re-renders, a short-lived instance is built for each child component to carry its new props, then discarded in favour of the existing one. State is preserved, but `getInitialState` runs again on the discarded instance, so keep it free of side effects and call `bindStore` from `mounted`.
- **Fragments add an element.** See [Fragments, null and arrays](#fragments-null-and-arrays), which matters for strict CSS selectors or `>` combinators.
- **Positional matching without keys.** Unkeyed siblings are matched by index and kind.
- **Type inference.** The props type can't be inferred from the definition, so pass it as a generic.
- **Browser only.** It uses `document` directly. There is no server-side rendering.

---

## API reference

| Export              | Signature                                     | Notes                                                         |
| ------------------- | --------------------------------------------- | ------------------------------------------------------------- |
| `CreateElement`     | `(tag, props?, ...children) => RenderElement` | JSX compiles to this via `jsx`.                               |
| `CreateComponent`   | `<P, S, M>(definition) => Component<P>`       | Returns a function you call with props or use as a JSX tag.   |
| `Fragment`          | `({ children }) => RenderElement`             | Used by `<>…</>`.                                             |
| `Render`            | `(element, container) => void`                | Mounts a tree, replacing any previous one.                    |
| `Unmount`           | `(container) => void`                         | Unmounts the tree rendered into `container`.                  |
| `FlushUpdates`      | `() => void`                                  | Applies pending updates synchronously.                        |
| `InstanceReference` | `<T>() => InstanceReferenceHandle<T>`         | Ref handle.                                                   |
| `Store`             | `<S>(initial) => CurlUIStore<S>`              | `getState`, `setState`, `subscribe`, `unsubscribe`, `select`. |

Types are re-exported from `curlui`: `CurlUITag`, `ElementProps<Tag>`, `ComponentInstance`, `ComponentDefinition`, `CurlUIStore`, `CSSProps`, `ChildComponent` and others.

### Files

| File                 | Purpose                                                                      |
| -------------------- | ---------------------------------------------------------------------------- |
| `index.ts`           | Runtime: elements, components, reconciliation, scheduler, `Render`, `Store`. |
| `types.ts`           | All type definitions.                                                        |
| `jsx-runtime.ts`     | JSX automatic runtime and the `JSX` namespace.                               |
| `jsx-dev-runtime.ts` | Development entry (`jsxDEV`) for the same runtime.                           |
| `smoke.test.tsx`     | Behavioural and type tests (jsdom).                                          |
