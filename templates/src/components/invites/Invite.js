import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, Button } from '@material-ui/core';
import { get, del } from '../../api';
import PropTypes from 'prop-types';


export default function InviteList() {
    const [invites, setInvites] = useState([]);
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        get('/api/invites', {
            company_id: user.company_id
        })
            .then(response => setInvites(response.data))
            .catch(() => {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                history.push('/login');
            });
    }, []);
    return (
        <Container >
            { invites ?
                invites.map(el => <Invite key={el.id} agreementId={el.agreement_id} companyId={el.to_company_id} invites={invites} setInvites={setInvites} />)
                : <Typography variant="subtitle1">
                    Your company don&apost have any Agreements yet.
                </Typography>
            }
        </Container>
    );
}

Invite.propTypes = {
    invite: PropTypes.object,
    agreementId: PropTypes.string,
    companyId: PropTypes.string,
    invites: PropTypes.array,
    setInvites: PropTypes.func
};

function Invite({ invite, agreementId, companyId, invites, setInvites }) {
    const [company, setCompany] = useState({});
    const [agreement, setAgreement] = useState({});
    useEffect(() => {
        get('/api/companies', {
            id: companyId
        })
            .then(response => setCompany(response.data))
            .catch(err => {
                if (err.response.status == 401) {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                    history.push('/login');
                }
            });
        get('/api/agreements', {
            id: agreementId
        })
            .then(response => setAgreement(response.data))
            .catch(err => {
                if (err.response.status == 401) {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                    history.push('/login');
                }
            });
    });

    const removeFromList = () => {
        setInvites(invites.filter(el => el.id != invite.id));
    };

    const handleAccept = () => {
        del('/api/agreements', {
            invite,
            answer: 'accept'
        })
            .then(() => removeFromList())
            .catch(err => console.log(err));
    };

    const handleDecline = () => {
        del('/api/agreements', {
            invite,
            answer: 'decline'
        })
            .then(() => removeFromList())
            .catch(err => console.log(err));
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
