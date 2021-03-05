import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import {roles} from '../../constants';

User.propTypes = {
    fullName: PropTypes.string,
    role: PropTypes.number
};

export default function User({ fullName, role }) {
    return (
        <Card>
            <CardContent>
                <Typography component="h5" variant="h5">
                    {fullName}
                </Typography>
                <Typography variant="subtitle1">
                    {roles[role]}
                </Typography>
            </CardContent>
        </Card>
    );
}
