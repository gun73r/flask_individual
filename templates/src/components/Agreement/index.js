import React, { useEffect, useState } from 'react';
import {Tabs, Tab, TabList, TabPanel} from 'react-tabs';
import PropTypes from 'prop-types';
import Editor from './Editor';
import Companies from './Companies';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { Container, Typography } from '@material-ui/core';
import AgreementService from '../../api/AgreementService';
import 'react-tabs/style/react-tabs.css';

Agreement.propTypes = {
    socket: PropTypes.object,
};

export default function Agreement({socket}) {
    const history = useHistory();
    const {agreementId} = useParams();
    const [tabIndex, setTabIndex] = useState(0);
    const [agreement, setAgreement] = useState({});

    const agreementService = new AgreementService();

    useEffect(() => {
        const fetch = async () => {
            const response = await agreementService.get({id: agreementId});
            if (response) {
                setAgreement(response.data);
            }
            else {
                history.push('/login');
            }
        };
        fetch();
    }, []);

    return (
        <Container>
            { Object.keys(agreement).length == 0?
                <Typography component="h3" variant="h3">
                    Loading...
                </Typography>
                : <div>
                    <Typography component="h3" variant="h3">
                        {agreement.name}
                    </Typography>
                    <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
                        <TabList>
                            <Tab>Editor</Tab>
                            <Tab>Companies</Tab>
                        </TabList>
                        <TabPanel>
                            <Editor socket={socket} agreement={agreement} history={history}/>
                        </TabPanel>
                        <TabPanel>
                            <Companies agreement={agreement} history={history}/>
                        </TabPanel>
                    </Tabs>
                </div>
            }
        </Container>

    );
}
