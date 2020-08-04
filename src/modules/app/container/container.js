/* eslint-disable @lwc/lwc/no-unknown-wire-adapters */
import { LightningElement, wire, track } from 'lwc';
import * as sfdc from '../../services/sfdc';
import { store, connectStore } from '../../store/store';
import actions from '../../store/actions';

const SLDS_TAB_ITEM = 'slds-tabs_default__item';
const SLDS_ACTIVE_TAB_ITEM = 'slds-tabs_default__item slds-is-active';
const SLDS_SHOW = 'slds-show';
const SLDS_HIDE = 'slds-hide';

export default class AppContainer extends LightningElement {
    isLoading;
    isLoggedIn;

    @track
    tabs = [
        {
            name: 'execWebService',
            title: 'Webサービス実行',
            className: SLDS_TAB_ITEM
        },
        {
            name: 'createJson',
            title: 'JSON生成',
            className: SLDS_TAB_ITEM
        }
    ];

    constructor() {
        super();
        this.isLoading = true;
        sfdc.init(this._loggedInCallback.bind(this));
    }

    @wire(connectStore, { store })
    storeUpdated({ ui }) {
        this.isLoggedIn = ui.isLoggedIn;
        for (let tab of this.tabs) {
            tab.className =
                tab.name === ui.selectedTabName
                    ? SLDS_ACTIVE_TAB_ITEM
                    : SLDS_TAB_ITEM;
        }

        const tabContents = this.template.querySelectorAll(
            'div.slds-tabs_default__content'
        );
        for (let content of tabContents) {
            if (content.dataset.tabName === ui.selectedTabName) {
                content.classList.add(SLDS_SHOW);
                content.classList.remove(SLDS_HIDE);
            } else {
                content.classList.add(SLDS_HIDE);
                content.classList.remove(SLDS_SHOW);
            }
        }
    }

    _loggedInCallback(user, webService) {
        this.isLoading = false;
        if (user) {
            store.dispatch(actions.ui.loggedin(user, webService));
            store.dispatch(actions.ui.retrieveApiUsage());
            store.dispatch(actions.ui.changeTab('execWebService'));
        }
    }

    handleChangeTab(event) {
        if (this.isLoggedIn) {
            store.dispatch(actions.ui.changeTab(event.target.dataset.tabName));
        }
    }
}
