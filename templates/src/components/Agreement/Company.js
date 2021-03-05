import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import companyService from '../../api/CompanyService';
import { Card, Typography } from '@material-ui/core';


Company.propTypes = {
    companyId: PropTypes.string,
    history: PropTypes.object,
};

export default function Company({ companyId, history }) {
    const [company, setCompany] = useState({});
    useEffect(() => {
        companyService.get({id: companyId})
            .then(response => {
                if(response) {
                    setCompany(response.data);
                } else {
                    history.push('/login');
                }
            });
    }, []);
    return (
        <Card>
            <Typography variant="h4" component="h4">
                {company.name}
            </Typography>
        </Card>
    );

}
