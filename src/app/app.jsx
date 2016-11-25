import React from "react";
import ReactDOM from "react-dom";
import injectTapEventPlugin from 'react-tap-event-plugin';
import Demo from "./components/Demo";

injectTapEventPlugin();

window.onload = render;
store.subscribe(render);

function render() {
	ReactDOM.render(
		<Demo ref={ref => window.app = ref}/>,
		document.querySelector("#appContainer")
	);
}