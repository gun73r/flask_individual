import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types';
import inviteService from '../../api/InviteService';
import companyService from '../../api/CompanyService';

InviteDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    agreement: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};

export default function InviteDialog({ open, setOpen, agreement, history }) {
    const [company, setCompany] = useState({});
    const [companies, setCompanies] = useState([]);
    useEffect(() => {
        companyService.get({})
            .then(response => {
                if (response) {
                    const user = JSON.parse(localStorage.getItem('user'));
                    setCompanies(response.data.filter(el => el.id != user.company_id));
                } else {
                    history.push('/login');
                }

            });
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    const handleSend = () => {
        setOpen(false);
        inviteService.create({
            to_company_id: company.id,
            agreement_id: agreement.id
        });
    };

    const onChange = useCallback((event, value) => setCompany(value));
    const renderInput = useCallback((params) => <TextField {...params} label="Company" variant="outlined" />);
    const getOptionLabel = useCallback((option) => option.name);

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Send Invite</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    You can invite up to two companies to create Agreement.
                </DialogContentText>
                <Autocomplete
                    id="combo-box-demo"
                    value={company}
                    onChange={onChange}
                    options={companies}
                    getOptionLabel={getOptionLabel}
                    style={{ width: 300 }}
                    renderInput={renderInput}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSend} color="primary">
                    Invite
                </Button>
            </DialogActions>
        </Dialog>
    );
}
