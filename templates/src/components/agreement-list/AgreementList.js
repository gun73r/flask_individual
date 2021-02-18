import React from 'react';
import { Container } from '@material-ui/core';
import PropTypes from 'prop-types';

export default function AgreementList() {
    return (
        <Container>
        </Container>
    );
}

Agreement.propTypes = {
    name: PropTypes.string,
    companies: PropTypes.array,
    stage: PropTypes.number,
};

function Agreement({ name, companies, stage }) {
    return (
        <Container>{name + ' ' + companies.map(el => el.toString()) + ' ' + stage}</Container>
    );
}
