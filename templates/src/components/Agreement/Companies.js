import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Container } from '@material-ui/core';
import InviteDialog from './InviteDialog';
import Company from './Company';

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
            {agreement.company_ids.map((id, num) => <Company key={num} history={history} companyId={id} />)}
        </Container>
    );
}
