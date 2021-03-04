import React from 'react';
import { Button,  Dialog, DialogActions, DialogContentText, DialogContent } from '@material-ui/core';
import PropTypes from 'prop-types';

ErrorDialog.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func
};

export default function ErrorDialog({ open, setOpen }) {
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    You cannot add 4th employee for this role.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}
