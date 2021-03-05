import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';


PrivateRoute.propTypes = {
    component: PropTypes.component,
};

export default function PrivateRoute({ component: Component, ...rest }) {

    const token = localStorage.getItem('auth_token');
    return (
        <Route
            {...rest}
            render={props =>
                token ? (
                    <Component {...props} {...rest} />
                ) : (

                    <Redirect to="/login"/>
                )
            }

        />
    );
}
