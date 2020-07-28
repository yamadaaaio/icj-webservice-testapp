import { jsforce } from 'jsforce';
import { LightningElement } from 'lwc';

export default class App extends LightningElement {
    handleClick() {
        jsforce.browser.init({
            clientId:
                '3MVG9n_HvETGhr3DXo.3MwroNCdEYZwkgH93FbdMarRV_9dFU5IBqP1VU9CvXvMThsjkuLPCD23M3lubW1oEd',
            redirectUri: 'https://evening-chamber-04072.herokuapp.com/'
        });

        jsforce.browser.login('http://login.salesforce.com');
    }
}
