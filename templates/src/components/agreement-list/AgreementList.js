import React, { useEffect, useState } from 'react';
import { Card, Container, Grid, Typography, Box, Link } from '@material-ui/core';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { get } from '../../api';


export default function AgreementList() {
    const [agreements, setAgreements] = useState([]);
    const history = useHistory();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        get('/api/agreements', { company_id: user.company_id })
            .then(response => {
                setAgreements(response.data);
            })
            .catch(err => {
                switch (err.response.status) {
                case 401: {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user');
                    history.push('/login');
                    break;
                }
                }
            });
    }, []);
    return (
        <Container >
            { agreements ?
                agreements.map(el => <Agreement key={el.id} agreementId={el.id} name={el.name} companyIds={el.company_ids} stage={el.status} />)
                : <Typography variant="subtitle1">
                    Your company don&apost have any Agreements yet.
                </Typography>
            }
        </Container>
    );
}

Agreement.propTypes = {
    agreementId: PropTypes.string,
    name: PropTypes.string,
    companyIds: PropTypes.array,
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

function Agreement({ agreementId, name, companyIds, stage }) {

    const history = useHistory();
    const [companies, setCompanies] = useState([]);
    useEffect(() => {
        setCompanies([]);
        companyIds.map(id => {
            return get('/api/companies', { id })
                .then(response => setCompanies(old => [...old, response.data]))
                .catch(err => {
                    if (err.response.status == 401) {
                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('user');
                        history.push('/login');
                    }
                });
        });
        console.log(companies);
    }, []);
    return (
        <Box mb={2}>
            <Link underline="none" component={RouterLink} to={`/agreement/${agreementId}`}>
                <Card variant="outlined">
                    <Typography component="h5" variant="h5">
                        {name}
                    </Typography>
                    <Grid container spacing={2}
                        alignContent="center"
                        justify="center"
                        alignItems="center">
                        {companies.map((el, idx) => {
                            if(el !== undefined) {
                                return <Grid key={el.id} item>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        {el.name}
                                    </Typography>
                                </Grid>;
                            }
                            return <div key={idx}></div>;
                        })}
                    </Grid>

                    <Typography variant="h6" component="h6">
                        Status: {stages[stage]}
                    </Typography>

                </Card>
            </Link>
        </Box>
    );
}
