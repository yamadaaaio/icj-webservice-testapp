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

    get salesforceUrl() {
        return this.user
            ? `${this.user.urls.custom_domain}`
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

        // ブラウザにログイン情報が残るため、./secur/logout.jsp にアクセスして完全にログアウトする
        const logoutIframeContainer = this.template.querySelector('.icj-logout-iframe-container');
        const iframe = document.createElement('iframe');
        iframe.src = `${this.user.urls.custom_domain}/secur/logout.jsp`;
        logoutIframeContainer.appendChild(iframe);
        setTimeout(() => {
            // アクセスしたら消す
            logoutIframeContainer.removeChild(iframe);
            store.dispatch(actions.ui.loggedout());
        }, 1000);
    }
}
