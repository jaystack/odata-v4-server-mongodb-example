import React from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Tabs, Tab} from 'material-ui/Tabs';

export default class Demo extends React.Component {
	
	render() {
		return (
			<MuiThemeProvider>
				<Tabs>
					<Tab label="Categories">
						yeee
					</Tab>
					<Tab label="Products">
						juhúúú
					</Tab>
				</Tabs>
			</MuiThemeProvider>
		)
	}
}