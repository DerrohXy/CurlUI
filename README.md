# Simple frontend UI framework.

### Example Usage

```tsx
import { CreateElement, CreateComponent, Render } from "curlui";

let Label = CreateElement("span", { className = "label" }, "Hello there!");

type CounterState = {
    index: number;
};

type CounterProps = {
    start: number;
};

const Counter = CreateComponent({
    getInitialState() {
        let props: CounterProps = this.getProps();
        return { index: props.start };
    },
    mounted() {
        setInterval(() => {
            let state: CounterState = this.getState();
            let c = state.index,
                c_ = state.index >= 100 ? 0 : c + 1;
            this.setState({ index: c_ });
        }, 1000);
    },
    render() {
        let state: CounterState = this.getState();
        return CreateElement(
            "div",
            {
                style: {
                    padding: "10px",
                    border: "1px solid lightgray",
                    borderRadius: "10px",
                    margin: "5px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                },
                onclick: () => {
                    this.setState({ index: 0 });
                },
            },
            `${state.index}`
        );
    },
});

Render(Counter({ start: 5 }), document.getElementById("counter_section"));
Render(Label, document.getElementById("label_section"));
```

### Alternatively, using JSX syntax

```tsx
import { CreateElement, CreateComponent, Render } from "curlui";

let Label = <span className={"label"}> {"Hello There!"} </span>;

type CounterState = {
    index: number;
};

type CounterProps = {
    start: number;
};

const Counter = CreateComponent({
    getInitialState() {
        let props: CounterProps = this.getProps();
        return { index: props.start };
    },
    mounted() {
        setInterval(() => {
            let state: CounterState = this.getState();
            let c = state.index,
                c_ = state.index >= 100 ? 0 : c + 1;
            this.setState({ index: c_ });
        }, 1000);
    },
    render() {
        let state: CounterState = this.getState();
        return (
            <div
                onclick={() => {
                    this.setState({ index: 0 });
                }}
                style={{
                    padding: "10px",
                    border: "1px solid lightgray",
                    borderRadius: "10px",
                    margin: "5px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                {`${state.index}`}
            </div>
        );
    },
});

Render(<Counter start={3} />, document.getElementById("counter_section"));
Render(Label, document.getElementById("label_section"));
```

### Inbuilt store feature

This creates a store feature that allows binding listeners to be executed whenever the store state is updated.

```tsx
import { Store } from "curlui";
import { CurlUIStore } from "curlui/types";

const appStore: CurlUIStore = Store({
    clicksCount: 0,
    currentPage: "home",
});

let listenerId: string = appStore.subscribe(() => {
    console.log("Store updates.");
});

appStore.setState({ clicksCount: appStore.clicksCount + 1 });
// All subscribed listeners will be executed

appStore.unsubscribe(listenerId);
```
