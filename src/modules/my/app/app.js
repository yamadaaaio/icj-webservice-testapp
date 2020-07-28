import jsforce from 'jsforce';
import { LightningElement } from 'lwc';

export default class App extends LightningElement {
    handleClick(event) {
        const jsforceOptions = {
            clientId:
                '3MVG9n_HvETGhr3DXo.3MwroNCdEYZwkgH93FbdMarRV_9dFU5IBqP1VU9CvXvMThsjkuLPCD23M3lubW1oEd',
            redirectUri: 'https://evening-chamber-04072.herokuapp.com/',
            proxyUrl: 'http://localhost:3001/proxy/',
            loginUrl:
                event.target.dataset.env === 'sandbox'
                    ? 'https://test.salesforce.com'
                    : 'https://login.salesforce.com'
        };

        jsforce.browser.login(jsforceOptions);
    }
}
