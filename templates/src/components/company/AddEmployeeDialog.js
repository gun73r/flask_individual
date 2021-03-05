import React, {useState } from 'react';
import { Button, Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent, Select, MenuItem, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import userService from '../../api/UserService';

AddEmployeeDialog.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    setUsers: PropTypes.func,
    user: PropTypes.object,
    setOpenModal: PropTypes.func
};

export default function AddEmployeeDialog({ open, setOpen, setUsers, user, setOpenModal }) {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [role, setRole] = useState(1);

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        userService.create({
            username,
            role,
            full_name: fullName,
            company_id: user.company_id
        })
            .then(response => {
                if (response) {
                    setUsers(old => [...old, response.data]);
                } else {
                    setOpenModal(true);
                    history.push('/login');
                }
            });
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add Employee</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Remember, you can add only 3 of both, economists and lawyers per company.
                </DialogContentText>
                <Select
                    id="Role"
                    label="Role"
                    value={role}
                    onChange={event => setRole(event.target.value)}>
                    <MenuItem value={1}>Lawyer</MenuItem>
                    <MenuItem value={2}>Economist</MenuItem>
                </Select>
                <TextField
                    value={fullName}
                    onChange={event => setFullName(event.target.value)}
                    margin="dense"
                    id="name"
                    label="Full Name"
                    fullWidth
                />
                <TextField
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                    margin="dense"
                    id="username"
                    label="Username"
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );

}
