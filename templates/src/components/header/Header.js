import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {Drawer, CssBaseline, AppBar, Toolbar, List, Typography, Divider, IconButton, ListItem,
    ListItemIcon, ListItemText, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle, Button, TextField } from '@material-ui/core';
import {Link} from 'react-router-dom';
import AssignmentIcon from '@material-ui/icons/Assignment';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import ArchiveIcon from '@material-ui/icons/Archive';
import PeopleIcon from '@material-ui/icons/People';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { post } from '../../api';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24,
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
}));

const listItems = (
    <div>
        <ListItem button component={Link} to="/agreements">
            <ListItemIcon>
                <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Agreements" />
        </ListItem>
        <ListItem button component={Link} to="/archive">
            <ListItemIcon>
                <ArchiveIcon />
            </ListItemIcon>
            <ListItemText primary="Archive" />
        </ListItem>
        <ListItem button component={Link} to="/company">
            <ListItemIcon>
                <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Company" />
        </ListItem>
        <ListItem button component={Link} onClick={() => localStorage.removeItem('auth_token')} to='/login'>
            <ListItemIcon>
                <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
        </ListItem>
    </div>
);


export default function Header() {
    const history = useHistory();
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('user'));
    const [openDrawer, setOpenDrawer] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [agreementName, setAgreementName] = useState('');
    const handleDrawerOpen = () => {
        setOpenDrawer(true);
    };
    const handleDrawerClose = () => {
        setOpenDrawer(false);
    };
    const handleModalOpen = () => {
        setOpenModal(true);
    };
    const handleModalSuccess = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        post('/api/agreements', {
            name: agreementName,
            company_ids: [user.company_id],
        })
            .then(response => {
                switch(response.status) {
                case 201: {                        
                    history.push(`/agreement/${response.data.id}`);
                    break;
                }
                case 401: {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                    history.push('/login');
                    break;
                }
                }
            });
        
        setOpenModal(false);
    };

    const handleModalFailOrClose = () => {
        setOpenModal(false);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AgreementDialog 
                open={openModal}
                handleSucces={handleModalSuccess}
                handleFail={handleModalFailOrClose}
                handleClose={handleModalFailOrClose} 
                agreementName={agreementName}
                setAgreementName={setAgreementName}/>
            <AppBar position="absolute" className={clsx(classes.appBar, openDrawer && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, openDrawer && classes.menuButtonHidden)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        Zesla
                    </Typography>
                    {user.company_id == '0'?
                        <Button
                            color="inherit"
                            className={classes.button}
                            startIcon={<NoteAddIcon />}
                            onClick={handleModalOpen}
                        >Create Document</Button>
                        : <div></div>
                    }
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, !openDrawer && classes.drawerPaperClose),
                }}
                open={openDrawer}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>{listItems}</List>
            </Drawer>

        </div>
    );
}
AgreementDialog.propTypes = {
    open: PropTypes.bool,
    handleSucces: PropTypes.func,
    handleFail: PropTypes.func,
    handleClose: PropTypes.func,
    setAgreementName: PropTypes.func,
    agreementName: PropTypes.string
};

function AgreementDialog({open, handleSucces, handleFail, handleClose, agreementName, setAgreementName}) {
    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Create Agreement</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To create new agreement you need to enter its name
                </DialogContentText>
                <TextField
                    value={agreementName}
                    onChange={event => setAgreementName(event.target.value)}
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
