import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import agreementService from '../../api/AgreementService';
import companyService from '../../api/CompanyService';
import inviteService from '../../api/InviteService';
import {Box, Button, Card, Typography} from '@material-ui/core';

Invite.propTypes = {
    invite: PropTypes.object,
    agreementId: PropTypes.string,
    companyId: PropTypes.string,
    invites: PropTypes.array,
    setInvites: PropTypes.func,
};

export default function Invite({ invite, agreementId, companyId, invites, setInvites }) {
    const history = useHistory();
    const [company, setCompany] = useState({});
    const [agreement, setAgreement] = useState({});

    useEffect(() => {
        companyService.get({
            id: companyId
        })
            .then(response => {
                if (response) {
                    setCompany(response.data);
                } else {
                    history.push('/login');
                }
            });
        agreementService.get({
            id: agreementId
        })
            .then(response => {
                if (response) {
                    setAgreement(response.data);
                } else {
                    history.push('/login');
                }
            });
    }, []);

    const removeFromList = () => {
        setInvites(invites.filter(el => el.id != invite.id));
    };

    const handleAccept = () => {
        inviteService.delete(invite, 'accept')
            .then(response => {
                if (response) {
                    removeFromList();
                } else {
                    history.push('/login');
                }
            });
    };

    const handleDecline = () => {
        inviteService.delete(invite, 'decline')
            .then(response => {
                if (response) {
                    removeFromList();
                } else {
                    history.push('/login');
                }
            });
    };
    return (
        <Box mb={2}>
            <Card variant="outlined">
                <Typography component="h5" variant="h5">
                    {agreement.name}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                    {company.name}
                </Typography>
                <Button
                    onClick={handleDecline}>
                    Decline
                </Button>
                <Button
                    onClick={handleAccept}>
                    Accept
                </Button>

            </Card>
        </Box>

    );
}
