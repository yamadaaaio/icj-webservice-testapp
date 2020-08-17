/* eslint-disable @lwc/lwc/no-unknown-wire-adapters */
import { LightningElement, wire, track } from 'lwc';
import { store, connectStore } from '../../store/store';
import actions from '../../store/actions';
import { escapeRegExp } from '../../utils/regexpUtils';

const SLDS_IS_OPEN = 'slds-is-open';
const INITIAL_SOURCE = {
    isLoading: false,
    rawItems: null,
    items: null
};
const COMBOBOX_UPDATE_DELAY = 300;

function filterItems(rawItems, keyword) {
    let items = null;

    if (!rawItems) {
        return items;
    }
    if (keyword) {
        const regexp = new RegExp(escapeRegExp(keyword), 'i');
        items = rawItems.filter((item) => {
            return regexp.test(`${item.name} ${item.label}`);
        });
    } else {
        items = rawItems;
    }

    return items;
}

export default class ExecWebServicePanel extends LightningElement {
    @track sObjectSource;
    @track externalIdFieldSource;

    methods = [
        'insertRecords',
        'updateRecords',
        'upsertRecords',
        'deleteRecords'
    ];

    _timerId;

    constructor() {
        super();
        this.sObjectSource = { ...INITIAL_SOURCE };
        this.externalIdFieldSource = { ...INITIAL_SOURCE };
    }

    @wire(connectStore, { store })
    storeUpdated({ webServiceUi, sObjects, sObject }) {
        if (!this.sObjectSource.rawItems) {
            const source = this.sObjectSource;
            source.isLoading = sObjects.isFetching;
            if (sObjects.data) {
                source.rawItems = sObjects.data.sobjects.map(
                    (describeResult) => {
                        return {
                            name: describeResult.name,
                            label: describeResult.label
                        };
                    }
                );
            } else if (sObjects.error) {
                // error
                console.error(sObjects.error);
            }
        }
        this.sObjectSource.items = filterItems(
            this.sObjectSource.rawItems,
            webServiceUi.objectType
        );

        if (sObject[webServiceUi.objectType]) {
            const source = this.externalIdFieldSource;
            const sObjectState = sObject[webServiceUi.objectType];

            if (!source.rawItems) {
                source.isLoading = sObjectState.isFetching;
                if (sObjectState.externalIdFields) {
                    source.rawItems = sObjectState.externalIdFields.map(
                        (describeResult) => {
                            return {
                                name: describeResult.name,
                                label: describeResult.label
                            };
                        }
                    );
                } else if (sObjectState.error) {
                    // error
                    console.error(sObjectState.error);
                }
            }

            console.log(webServiceUi.externalIdField);
            source.items = filterItems(
                source.rawItems,
                webServiceUi.externalIdField
            );
        } else {
            this.externalIdFieldSource = {
                ...INITIAL_SOURCE
            };
        }
    }

    focusObjectType() {
        store.dispatch(actions.sObjects.fetchSObjectsIfNeeded());
    }

    changeObjectType(event) {
        clearTimeout(this._timerId);

        this._timerId = setTimeout(() => {
            store.dispatch(
                actions.webServiceUi.changeObjectType(event.detail.keyword)
            );
        }, COMBOBOX_UPDATE_DELAY);
    }

    selectObjectType(event) {
        store.dispatch(
            actions.webServiceUi.changeObjectType(event.detail.selectedItem)
        );
    }

    focusExternalIdField() {
        const { webServiceUi } = store.getState();
        store.dispatch(
            actions.sObject.describeSObjectIfNeeded(webServiceUi.objectType)
        );
    }

    changeExternalIdField(event) {
        clearTimeout(this._timerId);

        this._timerId = setTimeout(() => {
            store.dispatch(
                actions.webServiceUi.changeExternalIdField(event.detail.keyword)
            );
        }, COMBOBOX_UPDATE_DELAY);
    }

    selectExternalIdField(event) {
        store.dispatch(
            actions.webServiceUi.changeExternalIdField(
                event.detail.selectedItem
            )
        );
    }

    openMethods() {
        const combobox = this.template.querySelector(
            '.icj-web-service-method__combobox'
        );
        combobox.classList.add(SLDS_IS_OPEN);
    }

    closeMethods() {
        const combobox = this.template.querySelector(
            '.icj-web-service-method__combobox'
        );
        combobox.classList.remove(SLDS_IS_OPEN);
    }

    selectMethod(event) {
        const selectedMethod = event.currentTarget.dataset.method;
        const combobox = this.template.querySelector(
            '.icj-web-service-method__input'
        );
        combobox.value = selectedMethod;
    }

    executeWebService() {
        const object_type = this.template.querySelector(
            '.icj-object-type c-search-combo-box'
        ).value;
        const external_id_field = this.template.querySelector(
            '.icj-external-id-field c-search-combo-box'
        ).value;
        const json_record = this.template.querySelector(
            '.icj-json-record__input'
        ).value;
        const method = this.template.querySelector(
            '.icj-web-service-method__input'
        ).value;

        store.dispatch(
            actions.soap.executeWebService(method, {
                object_type,
                external_id_field,
                json_record
            })
        );
    }
}
