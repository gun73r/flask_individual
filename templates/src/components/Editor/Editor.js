import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { v4 as uuid4 } from 'uuid';
import ReactQuill from 'react-quill';
import Delta from 'quill-delta';
import 'react-quill/dist/quill.snow.css';
import propType from 'prop-types';
import { get } from '../../api';

Editor.propTypes = {
    socket: propType.object
};

Editor.modules = {
    toolbar: [
        [{ 'header': [] }, { 'font': [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'align': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' },
            { 'indent': '-1' }, { 'indent': '+1' }],
        ['clean'],
        [{ 'background': [] }]
    ]
};

Editor.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'align', 'background'
];

export default function Editor({ socket }) {
    const { agreementId } = useParams();
    const id = uuid4();
    const [content, setContent] = useState(new Delta());
    const [name, setName] = useState('');
    let ref = null;
    let selection;
    useEffect(() => {
        let data;
        get('/api/agreements', {
            id: agreementId
        })
            .then(response => {
                const respData = response.data;
                switch (response.status) {
                case 200: {
                    setName(respData.name);
                    data = new Delta();
                    if (respData.ots) {
                        for (const ot of respData.ots) {
                            data = data.compose(new Delta(ot));
                        }
                        setContent(data);
                    }
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

        socket.connect();
        socket.emit('join', { agreementId });
        socket.on('patch', (obj) => {
            const ots = obj.ots;
            if (obj.id !== id) {
                data = data.compose(ots);
                setContent(data);
            }
        });

        return () => {
            socket.emit('leave', { agreementId });
            socket.disconnect();
        };
    }, []);
    return (
        <Container>
            <Typography component="h5" variant="h5">
                {name}
            </Typography>
            <ReactQuill
                modules={Editor.modules}
                formats={Editor.formats}
                ref={el => ref = el}
                theme="snow"
                value={content}
                onChange={(data, delta, source) => {
                    switch (source) {
                    case 'api': {
                        if (selection) {
                            const ops = delta.ops;
                            for (const op of ops) {
                                if ('insert' in op) {
                                    selection.index += op['insert'].length;
                                }
                                if ('delete' in op) {
                                    selection.index -= op['delete'];
                                }
                            }
                            if (ref) {
                                ref.editor.setSelection(selection);
                            }
                        }
                        break;
                    }
                    case 'user': {
                        socket.emit('change', { agreementId, id, ots: delta });
                        break;
                    }

                    }
                }
                }
                onChangeSelection={(range, source) => {
                    if (source == 'user') {
                        selection = range;
                        console.log(selection);
                    }
                }}
            />
        </Container>
    );
}
