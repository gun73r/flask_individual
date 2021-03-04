import React, { useState, useEffect, useCallback } from 'react';
import { Container } from '@material-ui/core';
import { v4 as uuid4 } from 'uuid';
import ReactQuill from 'react-quill';
import Delta from 'quill-delta';
import 'react-quill/dist/quill.snow.css';
import PropTypes from 'prop-types';

Editor.propTypes = {
    socket: PropTypes.object,
    agreement: PropTypes.object
};

const modules = {
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

const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'align', 'background'
];

export default function Editor({ socket, agreement }) {
    const id = uuid4();
    const [content, setContent] = useState(new Delta());
    let ref = null;
    let selection;
    useEffect(() => {
        let data = new Delta();
        if (agreement.operations) {
            for (const operation of agreement.operations) {
                data = data.compose(new Delta(operation));
            }
            setContent(data);
        }

        socket.connect();
        socket.emit('join', { agreementId: agreement.id });
        socket.on('patch', (obj) => {
            const operations = obj.operations;
            if (obj.id !== id) {
                data = data.compose(operations);
                setContent(data);
            }
        });

        return () => {
            socket.emit('leave', { agreementId: agreement.id });
            socket.disconnect();
        };
    }, []);

    const onChange = useCallback((data, delta, source) => {
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
            socket.emit('change', { agreementId: agreement.id, id, operations: delta });
            break;
        }
        }
    });

    const onChangeSelection = useCallback((range, source) => {
        if (source == 'user') {
            selection = range;
        }
    });
    const setRef = useCallback(el => ref = el);

    return (
        <Container>
            <ReactQuill
                modules={modules}
                formats={formats}
                ref={setRef}
                theme="snow"
                value={content}
                onChange={onChange}
                onChangeSelection={onChangeSelection}
            />
        </Container>
    );
}
