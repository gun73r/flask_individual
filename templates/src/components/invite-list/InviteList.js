import React, { useEffect, useState } from 'react';
import { Container, Typography} from '@material-ui/core';
import Invite from './Invite';
import InviteService from '../../api/InviteService';


export default function InviteList() {
    const [invites, setInvites] = useState([]);
    const inviteService = new InviteService();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        inviteService.get({
            company_id: user.company_id
        })
            .then(response => {
                if (response) {
                    setInvites(response.data);
                } else {
                    history.push('/login');
                }
            });

    }, []);
    return (
        <Container >
            { invites.length !== 0 ?
                invites.map(el => <Invite key={el.id} invite={el} agreementId={el.agreement_id} companyId={el.to_company_id} invites={invites} setInvites={setInvites} inviteService={inviteService} />)
                : <Typography compnonent="h2" variant="h2">
                    {'Your company don\'t have any invites yet.'}
                </Typography>
            }
        </Container>
    );
}
