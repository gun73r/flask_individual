import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { stages } from '../../constants';
import { Button, Container, Typography } from '@material-ui/core';
import approvalService from '../../api/ApprovalService';
import signatureService from '../../api/SignatureService';

Stage.propTypes = {
    agreement: PropTypes.object,
    history: PropTypes.object
};

export default function Stage({ agreement, history }) {
    const [approvals, setApprovals] = useState([]);
    const [signatures, setSignatures] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        approvalService.get({ agreement_id: agreement.id })
            .then(response => {
                if (response) {
                    setApprovals(response.data);
                } else {
                    history.push('/login');
                }
            });
        signatureService.get({ agreement_id: agreement.id })
            .then(response => {
                if (response) {
                    setApprovals(response.data);
                } else {
                    history.push('/login');
                }
            });

    }, []);

    const handleApprove = useCallback(() => {
        approvalService.create({
            agreement_id: agreement.id,
            user_id: user.id,
        })
            .then(response => {
                if (response) {
                    setApprovals(old => [...old, response.data]);
                } else {
                    history.push('/login');
                }
            });
    });

    const handleCancelApprove = useCallback(() => {
        approvalService.delete({
            agreement_id: agreement.id,
            user_id: user.id,
        })
            .then(response => {
                if (response) {
                    setApprovals(approvals.filter(el => el.user_id != user.id));
                } else {
                    history.push('/login');
                }
            });

    });

    const handleSign = useCallback(() => {
        signatureService.create({
            agreement_id: agreement.id,
            head_id: user.id,
        })
            .then(response => {
                if (response) {
                    setSignatures(old => [...old, response.data]);
                } else {
                    history.push('/login');
                }
            });
    });

    const handleCancelSign = useCallback(() => {
        signatureService.delete({
            agreement_id: agreement.id,
            head_id: user.id,
        })
            .then(response => {
                if (response) {
                    setSignatures(signatures.filter(el => el.head_id != user.id));
                } else {
                    history.push('/login');
                }
            });
    });
    let button = <div></div>;
    if (agreement.status == 1) {
        button =
            approvals.filter(el => el.user_id == user.id).length == 0 ?
                <Button
                    color="primary"
                    onClick={handleApprove}>
                    Approve
                </Button>
                : <Button
                    color="primary"
                    onClick={handleCancelApprove}>
                    Cancel Approve
                </Button>;
    } else if (agreement.status == 3 && user.role == 0) {
        button = signatures.filter(el => el.head_id == user.id) ?
            <Button
                color="primary"
                onClick={handleSign}>
                Sign
            </Button>
            : <Button
                color="primary"
                onClick={handleCancelSign}>
                Cancel Sign
            </Button>;
    }
    return (
        <Container>
            <Typography component="h3" variant="h3">
                Current Stage: {stages[agreement.status]}
            </Typography>
            {button}
        </Container>
    );
}
