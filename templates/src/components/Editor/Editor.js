import React, { useState, useEffect } from 'react';
import { Container } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { v4 as uuid4 } from 'uuid';
import ReactQuill from 'react-quill';
import Delta from 'quill-delta';
import 'react-quill/dist/quill.snow.css';
import propType from 'prop-types';

Editor.propTypes = {
    socket: propType.object
};

export default function Editor({socket}) {
    const { agreementId } = useParams();
    const id = uuid4();
    const [content, setContent] = useState(new Delta().insert('hui'));
    useEffect(() => {
        let data = new Delta().insert('hui');
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
            <ReactQuill
                theme="snow"
                value={content}
                onChange={(data, delta, source) => {

                    if (source === 'user') {
                        socket.emit('change', { agreementId, id, ots: delta });
                    }
                }
                }
            />
        </Container>
    );
}
