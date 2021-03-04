import React, { useCallback } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';

AgreementDialog.propTypes = {
    open: PropTypes.bool,
    handleSucces: PropTypes.func,
    handleFail: PropTypes.func,
    handleClose: PropTypes.func,
    setAgreementName: PropTypes.func,
    agreementName: PropTypes.string
};

export default function AgreementDialog({ open, handleSucces, handleFail, handleClose, agreementName, setAgreementName }) {
    const onChange = useCallback(event => setAgreementName(event.target.value));
    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create Agreement</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To create new agreement you need to enter its name
                </DialogContentText>
                <TextField
                    value={agreementName}
                    onChange={onChange}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Agreement Name"
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleFail} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSucces} color="primary">
                    Create
                </Button>
            </DialogActions>
        </Dialog>);
}
