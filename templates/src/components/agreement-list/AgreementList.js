import React, { useEffect, useState } from 'react';
import { Card, Container, Grid, Typography, Box, Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';


export default function AgreementList() {
    const [agreements, setAgreements] = useState([]);
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log(user);
        axios.get(`http://localhost:5000/api/agreements?company_id=${user.company_id}`,{
            auth: localStorage.getItem('auth_token'),
            
        })
            .then(response => response.data)
            .then(json => setAgreements(json));
    }, []);
    return (
        <Container >
            {agreements.map(el => <Agreement key={el.id} agreementId={el.id} name={el.name} companies={el.company_ids} stage={el.status} />)}
        </Container>
    );
}

Agreement.propTypes = {
    agreementId: PropTypes.string,
    name: PropTypes.string,
    companies: PropTypes.array,
    stage: PropTypes.number,
};

const stages = {
    0: 'In Process',
    1: 'Harmonizing',
    2: 'Agreed',
    3: 'Singing',
    4: 'Signed',
    5: 'Archived'
};

function Agreement({ agreementId, name, companies, stage }) {
    return (
        <Box mb={2}>
            <Link underline="none" component={RouterLink} to={`/agreement/${agreementId}`}>
                <Card variant="outlined">
                    <Typography component="h5" variant="h5">
                        {name}
                    </Typography>
                    <Grid container spacing={2}>
                        {companies.map(el => (
                            <Grid key={el} item>
                                <Typography variant="subtitle1" color="textSecondary">
                                    {el}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                    <Typography variant="h6" component="h6">
                    Status: {stages[stage]}
                    </Typography>

                </Card>
            </Link>
        </Box>
    );
}
