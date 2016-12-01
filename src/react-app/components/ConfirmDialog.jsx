import React from "react";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default function ConfirmDialog({open, text, onCancel, onSubmit}) {

	const actions = [
		<FlatButton
			label="Cancel"
			onTouchTap={onCancel}
			/>,
		<FlatButton
			label="Ok"
			primary={true}
			onTouchTap={onSubmit}
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