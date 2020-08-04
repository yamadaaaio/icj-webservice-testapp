/* eslint-disable @lwc/lwc/no-unknown-wire-adapters */
import { LightningElement, wire } from 'lwc';
import { store, connectStore } from '../../store/store';
import * as sfdc from '../../services/sfdc';
import actions from '../../store/actions';

export default class Header extends LightningElement {
    isLoggedIn;
    user;
    apiUsage;

    get userLabel() {
        return this.user
            ? `${this.user.name} (${this.user.preferred_username})`
            : '';
    }

    get apiUsageLabel() {
        return this.apiUsage
            ? `${this.apiUsage.used} / ${this.apiUsage.limit}`
            : '';
    }

    @wire(connectStore, { store })
    storeUpdated({ ui }) {
        this.isLoggedIn = ui.isLoggedIn;
        this.user = ui.user;
        this.apiUsage = ui.apiUsage;
    }

    handleClickLogout() {
        sfdc.logout();
        store.dispatch(actions.ui.loggedout());
    }
}
