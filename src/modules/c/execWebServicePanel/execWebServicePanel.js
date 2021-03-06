/* eslint-disable @lwc/lwc/no-unknown-wire-adapters */
import { LightningElement, wire, track } from 'lwc';
import { store, connectStore } from '../../store/store';
import actions from '../../store/actions';
import { INITIAL_SOURCE } from '../../utils/itemsSource';

const SLDS_IS_OPEN = 'slds-is-open';

export default class ExecWebServicePanel extends LightningElement {
    @track sObjectSource;
    @track externalIdFieldSource;
    @track response;
    isExecuting;
    isExecuteSucceed;
    isExecuteFailed;
    executeCompletedDatetime;
    errorMsg;

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

    get notYet() {
        return (!this.isExecuteSucceed) && (!this.isExecuteFailed);
    }

    @wire(connectStore, { store })
    storeUpdated({ createJsonUi, webServiceUi, sObjects, sObject, soap }) {
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

        if (sObject[webServiceUi.objectType]) {

            if (webServiceUi.objectType !== this.externalIdFieldSource.objectType) {
                this.externalIdFieldSource = {
                    ...INITIAL_SOURCE
                };
            }

            const source = this.externalIdFieldSource;
            const sObjectState = sObject[webServiceUi.objectType];

            if (!source.rawItems) {
                source.isLoading = sObjectState.isFetching;
                source.objectType = webServiceUi.objectType;
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
        } else {
            this.externalIdFieldSource = {
                ...INITIAL_SOURCE
            };
        }
        
        if (soap) {
            this.isExecuting = soap.isExecuting;
         }

        if (soap.response) {
            this.isExecuteSucceed = true;
            this.isExecuteFailed = false;
            this.response = { ...soap.response.result };
            if (this.response.dml_result instanceof Array) {
                let dmlResults = [];
                let row_no = 1;
                for (let dmlResult of this.response.dml_result) {
                    dmlResults.push({
                        row_no, ...dmlResult
                    });
                    row_no++;
                }
                this.response.dml_result = dmlResults;
            } else {
                if (this.response.dml_result) {
                    this.response.dml_result = [{ row_no: 1, ...this.response.dml_result }];
                } else {
                    this.response.dml_result = null;
                }
            }
        } else if (soap.error) {
            this.isExecuteSucceed = false;
            this.isExecuteFailed = true;
            this.errorMsg = `エラーが発生しました：\n${soap.error.stack}`;
            console.error(soap.error);
        }

        if (soap.completeDate) {
            const year = ('0000' + soap.completeDate.getFullYear()).slice(-4);
            const month = ('00' + (soap.completeDate.getMonth() + 1)).slice(-2);
            const date = ('00' + (soap.completeDate.getDate())).slice(-2);
            const hour = ('00' + (soap.completeDate.getHours())).slice(-2);
            const minute = ('00' + (soap.completeDate.getMinutes())).slice(-2);
            const second = ('00' + (soap.completeDate.getSeconds())).slice(-2);

            this.executeCompletedDatetime = 
                `${year}/${month}/${date} ${hour}:${minute}:${second}`;
        }

        if (createJsonUi.jsonString) {
            const combobox = this.template.querySelector('.icj-object-type c-search-combo-box');
            const jsonInput = this.template.querySelector('.icj-json-record__input');
            combobox.setComboboxInputValue(createJsonUi.selectedSObjectName);
            jsonInput.value = createJsonUi.jsonString;
            store.dispatch(actions.createJsonUi.clearJsonString());
            store.dispatch(
                actions.webServiceUi.changeObjectType(createJsonUi.selectedSObjectName)
            );
        }
    }

    focusObjectType() {
        store.dispatch(actions.sObjects.fetchSObjectsIfNeeded());
    }

    changeObjectType(event) {
        store.dispatch(
            actions.webServiceUi.changeObjectType(event.detail.keyword)
        );
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

    selectedMethod = 'insertRecords';
    selectMethod(event) {
        this.selectedMethod = event.currentTarget.dataset.method;
        const combobox = this.template.querySelector(
            '.icj-web-service-method__input'
        );
        combobox.value = this.selectedMethod;
    }

    executeWebService() {
        const object_type = this.template.querySelector(
            '.icj-object-type c-search-combo-box'
        ).value;
        const external_id_field = this.template.querySelector(
            '.icj-external-id-field c-search-combo-box'
        ).value;
        const method = this.template.querySelector(
            '.icj-web-service-method__input'
        ).value;

        const jsonString = this.template.querySelector(
            '.icj-json-record__input'
        ).value;

        let json_record;
        try {
            const parsed = JSON.parse(jsonString);
            if (parsed instanceof Array) {
                json_record = parsed.map(record => JSON.stringify(record));
            } else {
                json_record = [ JSON.stringify(parsed) ];
            }
        } catch (e) {
            json_record = [ jsonString ];
        }

        store.dispatch(
            actions.soap.executeWebService(method, {
                object_type,
                external_id_field,
                json_record
            })
        );
    }
}
