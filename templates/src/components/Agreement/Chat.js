import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container, List, ListItem, ListItemText, Select, MenuItem, TextField, Button, makeStyles, Typography, Paper } from '@material-ui/core';
import chatService from '../../api/ChatService';
import userService from '../../api/UserService';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '36ch',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
}));

Chat.propTypes = {
    agreementId: PropTypes.string,
    companyIds: PropTypes.array,
    socket: PropTypes.object,
    messages: PropTypes.array,
    setMessages: PropTypes.func,
    history: PropTypes.object
};

export default function Chat({ agreementId, companyIds, socket, history }) {
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('user'));
    const [receiver, setReceiver] = useState(null);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');

    useEffect(() => {
        companyIds.forEach(el => {
            userService.get({ company_id: el })
                .then(response => {
                    if (response) {
                        setUsers(old =>  [...old, ...response.data].filter(el => el.id != user.id));
                    } else {
                        history.push('/login');
                    }
                });
        });
        chatService.get({ agreement_id: agreementId })
            .then(response => {
                if (response) {
                    const data = response.data.filter(el => el.to_user_id === null || el.to_user_id === user.id || el.from_user_id === user.id);
                    setMessages(data);
                } else {
                    history.push('/login');
                }
            });

        socket.connect();
        socket.emit('join_chat', {agreementId});
        socket.on('message', (message) => {
            if(message.to_user_id == user.id || message.from_user_id == user.id || message.to_user_id === null) {
                setMessages(old => [...old, message]);
            }
        });
        return () => {
            socket.emit('leave_chat', { agreementId });
            socket.disconnect();
        };
    }, []);



    const onSelectChange = useCallback(event => setReceiver(event.target.value));
    const onInputChange = useCallback(event => setMessageText(event.target.value));
    const handleSend = useCallback(() => {
        socket.emit('send', {
            agreementId,
            to_user_id: receiver,
            from_user_id: user.id,
            text: messageText
        });
        setMessageText('');
    });

    return (
        <Container>
            <Paper style={{maxHeight: 500, overflow: 'auto'}}>
                <List className={classes.root}>
                    {messages.map(el => <Message key={el.id} history={history}
                        senderId={el.from_user_id}
                        receiverId={el.to_user_id}
                        userId={user.id}
                        text={el.text}/>)
                    }
                </List>
            </Paper>
            <Select value={receiver} onChange={onSelectChange}>
                <MenuItem value={null}>All</MenuItem>
                {users.map(el => <MenuItem key={el.id} value={el.id}>{el.full_name}</MenuItem>)}
            </Select>

            <TextField id="standard-basic" label="Standard" value={messageText} onChange={onInputChange} />
            <Button onClick={handleSend}>Send</Button>
        </Container>
    );
}

Message.propTypes = {
    senderId: PropTypes.string,
    receiverId: PropTypes.string,
    text: PropTypes.string,
    userId: PropTypes.string,
    history: PropTypes.object
};

function Message({ senderId, receiverId, text, userId, history }) {
    const classes = useStyles();
    const [senderName, setSenderName] = useState('');
    const [receiverName, setReceiverName] = useState('');

    useEffect(() => {
        if(receiverId === userId) {
            setReceiverName('You');
        } else if (receiverId === null) {
            setReceiverName('All');
        } else {
            userService.get({id: receiverId})
                .then(response => {
                    if(response) {
                        setReceiverName(response.data.full_name);
                    } else {
                        history.push('/login');
                    }
                });
        }

        if(senderId === userId) {
            setSenderName('You');
        } else {
            userService.get({id: senderId})
                .then(response => {
                    if(response) {
                        setSenderName(response.data.full_name);
                    } else {
                        history.push('/login');
                    }
                });
        }
    }, []);

    return (
        <ListItem alignItems="flex-start">
            <ListItemText
                primary={senderName}
                secondary={
                    <React.Fragment>
                        <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textPrimary"
                        >
                            to {receiverName}: {' '}
                        </Typography>
                        {text}
                    </React.Fragment>
                }
            />
        </ListItem>
    );

}
