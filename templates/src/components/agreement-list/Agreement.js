import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import companyService from '../../api/CompanyService';
import { stages } from '../../constants';
import { useHistory } from 'react-router-dom';
import { Container, Box, Card, Typography, Grid, Button } from '@material-ui/core';
import agreementService from '../../api/AgreementService';

Agreement.propTypes = {
    agreementObj: PropTypes.object,
    setAgreements: PropTypes.func
};

export default function Agreement({ agreementObj, setAgreements }) {
    const history = useHistory();
    const [agreement, setAgreement] = useState(agreementObj);
    const [companies, setCompanies] = useState([]);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        agreement.company_ids.map(id => {
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
    const onClick = useCallback(() => history.push(`/agreement/${agreement.id}`));

    const handleArchive = useCallback(() => {
        agreementObj.status = 5;
        agreementService.update(agreementObj)
            .then(response => {
                if (response) {
                    setAgreement(agreementObj);
                } else {
                    history.push('/login');
                }
            });
    });
    const handleRemoveFromArchive = useCallback(() => {
        agreementObj.status = agreementObj.company_ids.length > 1? 1: 0;
        agreementService.update(agreementObj)
            .then(response => {
                if (response) {
                    setAgreement(agreementObj);
                } else {
                    history.push('/login');
                }
            });
    });
    const handleDelete = useCallback(() => {
        agreementService.delete(agreement.id)
            .then(response => {
                if (response) {
                    setAgreements(old => old.filter(el => el.id != agreement.id));
                } else {
                    history.push('/login');
                }
            });
    });
    return (
        <Box mb={2}>
            <Card variant="outlined">
                <Box onClick={onClick}>
                    <Typography component="h5" variant="h5">
                        {agreement.name}
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
                    Status: {stages[agreement.status]}
                    </Typography>
                </Box>
                {user.role == 0 && user.company_id === '0' ?
                    <Container>
                        {agreement.status != 5?
                            <Button
                                onClick={handleArchive}>
                            Archive
                            </Button>
                            : <Button
                                onClick={handleRemoveFromArchive}>
                                Remove from Archive
                            </Button>}
                        <Button
                            onClick={handleDelete}>
                            Delete
                        </Button>
                    </Container>
                    : <div></div>
                }


            </Card>
        </Box>
    );
}
