import React from 'react';
import { Link } from 'react-router-dom';
import AssignmentIcon from '@material-ui/icons/Assignment';import CheckIcon from '@material-ui/icons/Check';
import PeopleIcon from '@material-ui/icons/People';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

const items = [
    {
        to: '/agreements',
        icon: <AssignmentIcon />,
        text: 'Agreements',
        onClick: () => {}
    },
    {
        to: '/invites',
        icon: <CheckIcon />,
        text: 'Invites',
        onClick: () => {}
    },
    {
        to: '/company',
        icon: <PeopleIcon />,
        text: 'Company',
        onClick: () => {}
    },
    {
        to: '/login',
        icon: <ExitToAppIcon />,
        text: 'Logout',
        onClick: () => localStorage.removeItem('auth_token')
    },

];

export default function MenuList() {
    return (
        <List>
            {items.map((el, num) => {
                return (
                    <ListItem key={num} button onClick={el.onClick} component={Link} to={el.to}>
                        <ListItemIcon>
                            {el.icon}
                        </ListItemIcon>
                        <ListItemText primary={el.text} />
                    </ListItem>
                );
            })
            }
        </List>
    );
}
