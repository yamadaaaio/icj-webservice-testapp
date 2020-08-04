import { LightningElement } from 'lwc';
import * as sfdc from '../../services/sfdc';

export default class LoginModal extends LightningElement {
    handleClick(event) {
        const loginUrl = event.target.dataset.production
            ? sfdc.PRODUCTION_LOGIN_URL
            : sfdc.SANDBOX_LOGIN_URL;

        sfdc.login(loginUrl);
    }
}
