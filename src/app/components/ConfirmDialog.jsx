import React from "react";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default function ConfirmDialog({open, text, handleCancel, handleSubmit}) {

	const actions = [
		<FlatButton
			label="Cancel"
			primary={true}
			onTouchTap={handleCancel}
			/>,
		<FlatButton
			label="Ok"
			primary={true}
			onTouchTap={handleSubmit}
			/>
	];

	return (
		<Dialog
			title="Confirmation"
			actions={actions}
			open={open || false}
			>
			{text}
		</Dialog>
	);
}