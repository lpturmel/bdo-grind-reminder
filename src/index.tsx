/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import "./App.css";
import { Store } from "tauri-plugin-store-api";

export const store = new Store("bdo-tracker.bin");

render(() => <App />, document.getElementById("root") as HTMLElement);
