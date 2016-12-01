import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import injectTapEventPlugin from 'react-tap-event-plugin';
import Demo from "./components/Demo";
import store from "./store";

injectTapEventPlugin();

window.onload = render;
store.subscribe(render);

function render() {
	ReactDOM.render(
		<Demo ref={ref => window.app = ref} state={store.getState()}/>,
		document.querySelector("#appContainer")
	);
}