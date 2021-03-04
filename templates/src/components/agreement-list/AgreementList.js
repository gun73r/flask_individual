import React, { useEffect, useState, useCallback } from 'react';
import { Card, Container, Grid, Typography, Box } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import AgreementService from '../../api/AgreementService';
import CompanyService from '../../api/CompanyService';
import { stages } from '../../constants';


export default function AgreementList() {
    const [agreements, setAgreements] = useState([]);
    const history = useHistory();

    const agreementService = new AgreementService();
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
            { agreements ?
                agreements.map(el => <Agreement key={el.id} agreementId={el.id} name={el.name} companyIds={el.company_ids} stage={el.status} />)
                : <Typography variant="subtitle1">
                    {'Your company don\'t have any Agreements yet.'}
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

function Agreement({ agreementId, name, companyIds, stage }) {

    const history = useHistory();
    const [companies, setCompanies] = useState([]);
    const companyService = new CompanyService();
    useEffect(() => {
        companyIds.map(id => {
            return companyService.get({ id })
                .then(response => {
                    if (response) {
                        setCompanies(old => [...old, response.data]);
                    } else {
                        history.push('/login');
                    }
                }
                );
        });
    }, []);
    const onClick = useCallback(() => history.push(`/agreement/${agreementId}`));
    return (
        <Box mb={2}>
            <Card variant="outlined"  onClick={onClick}>
                <Typography component="h5" variant="h5">
                    {name}
                </Typography>
                <Grid container spacing={2}
                    alignContent="center"
                    justify="center"
                    alignItems="center">
                    {companies.map((el, idx) => {
                        if (el !== undefined) {
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
        </Box>
    );
}
