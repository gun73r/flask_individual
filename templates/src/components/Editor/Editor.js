import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { v4 as uuid4 } from 'uuid';
import ReactQuill from 'react-quill';
import axios from 'axios';
import Delta from 'quill-delta';
import 'react-quill/dist/quill.snow.css';
import propType from 'prop-types';

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
    useEffect(() => {
        let data;
        axios.get(`http://localhost:5000/api/agreements?id=${agreementId}`, {
            auth: localStorage.getItem('auth_token')
        })
            .then(response => response.data)
            .then(json => {
                console.log(json);
                data = new Delta();
                if(json.ots) {
                    for(const ot of json.ots) {
                        data = data.compose(new Delta(ot));
                    }
                    setContent(data);
                }
                setName(json.name);
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

        return () => socket.disconnect();
    }, []);
    return (
        <Container>
            <Typography component="h5" variant="h5">
                {name}
            </Typography>
            <ReactQuill
                modules={Editor.modules}
                formats={Editor.formats}
                theme="snow"
                value={content}
                onChange={(data, delta, source) => {
                    if (source === 'user') {
                        console.log(delta);
                        socket.emit('change', { agreementId, id, ots: delta });
                    }
                }
                }
            />
        </Container>
    );
}
