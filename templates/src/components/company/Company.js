import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Container, Typography, Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent, Select, MenuItem, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { get, post } from '../../api';

const roles = {
    0: 'Head',
    1: 'Lawyer',
    2: 'Economist'
};

export default function Company() {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        get('/api/users', { company_id: user.company_id })
            .then(response => {
                const data = response.data;
                setUsers(data);
            })
            .catch(err => {
                if(err.response.status == 401) {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                    history.push('/login');
                }
            });
    }, []);

    const handleClick = () => {
        setOpenDialog(true);
    };
    return (
        <Container>
            <ErrorDialog
                open={openModal}
                setOpen={setOpenModal} />
            <AddEmployeeDialog
                open={openDialog}
                setOpen={setOpenDialog}
                setUsers={setUsers}
                user={user}
                setOpenModal={setOpenModal} />
            {user.role == 0 ?
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClick}>
                    Add employee
                </Button>
                : <div></div>
            }
            { users
                ? users.map(el => <User key={el.id} fullName={el.full_name} role={el.role} />)
                : <Typography variant="subtitle1">
                    No users in your company
                </Typography>}
        </Container>
    );
}

AddEmployeeDialog.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    setUsers: PropTypes.func,
    user: PropTypes.object,
    setOpenModal: PropTypes.func
};

function AddEmployeeDialog({ open, setOpen, setUsers, user, setOpenModal }) {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [role, setRole] = useState(1);

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        post('/api/users', {
            username,
            role,
            full_name: fullName,
            company_id: user.company_id
        })
            .then(response => {
                setUsers(old => [...old, response.data]);
            })
            .catch(err => {
                switch(err.response.status) {
                case 401: {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                    history.push('/login');
                    break;
                }
                case 403: {
                    setOpenModal(true);
                    break;
                }
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


ErrorDialog.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func
};

function ErrorDialog({ open, setOpen }) {
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


User.propTypes = {
    fullName: PropTypes.string,
    role: PropTypes.number
};

function User({ fullName, role }) {
    return (
        <Card>
            <CardContent>
                <Typography component="h5" variant="h5">
                    {fullName}
                </Typography>
                <Typography variant="subtitle1">
                    {roles[role]}
                </Typography>
            </CardContent>
        </Card>
    );
}