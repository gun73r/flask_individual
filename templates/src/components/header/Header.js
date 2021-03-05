import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, CssBaseline, AppBar, Toolbar, Typography, Divider, IconButton, Button } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { useHistory } from 'react-router-dom';
import agreementService from '../../api/AgreementService';
import MenuList from './MenuList';
import AgreementDialog from './AgreenentDialog';

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

export default function Header() {
    const history = useHistory();
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('user'));
    const [openDrawer, setOpenDrawer] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [agreementName, setAgreementName] = useState('');
    useEffect(() => {
        if (!(user)) {
            history.push('/login');
        }
    }, []);
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
        agreementService.create({
            name: agreementName,
            company_ids: [user.company_id],
        })
            .then(response => {
                if (response) {
                    history.push(`/agreement/${response.data.id}`);
                }
                else {
                    history.push('/login');
                }
            });

        setOpenModal(false);
    };

    const handleModalFailOrClose = () => {
        setOpenModal(false);
    };

    return (
        <React.Fragment className={classes.root}>
            <CssBaseline />
            <AgreementDialog
                open={openModal}
                handleSucces={handleModalSuccess}
                handleFail={handleModalFailOrClose}
                handleClose={handleModalFailOrClose}
                agreementName={agreementName}
                setAgreementName={setAgreementName} />
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
                    {user.company_id == '0' ?
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
                <MenuList />
            </Drawer>

        </React.Fragment>
    );
}
