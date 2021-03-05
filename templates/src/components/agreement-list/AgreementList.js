import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import agreementService from '../../api/AgreementService';
import Agreement from './Agreement';


export default function AgreementList() {
    const [agreements, setAgreements] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        agreementService.get({ company_id: user.company_id })
            .then(response => {
                if (response) {
                    setAgreements(response.data);
                }
                else {
                    history.push('/login');
                }
            });
    }, []);
    return (
        <Container >
            { agreements.length !== 0 ?
                agreements.map(el => <Agreement key={el.id} agreementObj={el} setAgreements={setAgreements}/>)
                : <Typography variant="h4" component="h4">
                    {'Your company don\'t have any Agreements yet.'}
                </Typography>
            }
        </Container>
    );
}
