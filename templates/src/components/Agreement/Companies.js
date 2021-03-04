import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InviteService from '../../api/InviteService';
import CompanyService from '../../api/CompanyService';

Companies.propTypes = {
    agreement: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};

export default function Companies({ agreement, history }) {
    const [openDialog, setOpenDialog] = useState(false);

    const handleCreateInvite = () => {
        setOpenDialog(true);
    };
    return (
        <Container>
            <InviteDialog open={openDialog} setOpen={setOpenDialog} agreement={agreement} history={history} />
            {agreement.company_ids.length === 3 ?
                <div></div>
                : <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateInvite}>
                    Create Invite
                </Button>
            }
        </Container>
    );
}

InviteDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    agreement: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};

function InviteDialog({ open, setOpen, agreement, history }) {
    const [company, setCompany] = useState({});
    const [companies, setCompanies] = useState([]);

    const inviteService = new InviteService();
    const companyService = new CompanyService();
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


Company.propTypes = {
    companyId: PropTypes.string,
    companyService: PropTypes.object
};

function Company({ companyId, companyService }) {
    useEffect(() => {
        companyService.get({id: companyId})
            .then();
    }, []);
}
