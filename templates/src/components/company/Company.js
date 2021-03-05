import React, { useEffect, useState } from 'react';
import { Button, Container, Typography } from '@material-ui/core';
import userService from '../../api/UserService';
import ErrorDialog from './ErrorDialog';
import AddEmployeeDialog from './AddEmployeeDialog';
import User from './User';

export default function Company() {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        userService.get({ company_id: user.company_id })
            .then(response => {
                if (response) {
                    setUsers(response.data);
                } else {
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
                setOpenModal={setOpenModal}/>
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
