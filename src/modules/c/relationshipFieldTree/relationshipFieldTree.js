/* eslint-disable @lwc/lwc/no-unknown-wire-adapters */
import { LightningElement, api, track, wire } from 'lwc';
import { store, connectStore } from '../../store/store';
import actions from '../../store/actions';
import { INITIAL_SOURCE } from '../../utils/itemsSource';
import { createCustomEvent } from '../../utils/customEvent';

export default class RelationshipFieldTree extends LightningElement {

    @api sobject = '';
    @api relationshipName = '';
    @track fieldsSource;

    _timerId;

    constructor() {
        super();
        this.fieldsSource = { 
            ...INITIAL_SOURCE
        };
    }

    connectedCallback() {
        store.dispatch(actions.sObject.describeSObjectIfNeeded(this.sobject));
    }

    @wire(connectStore, { store })
    storeUpdated({ createJsonUi, sObject }) {

        const source = this.fieldsSource;

        if (!source.rawItems && sObject[this.sobject]) {
            const sObjectState = sObject[this.sobject];
            source.isLoading = sObjectState.isFetching;
            if (sObjectState.externalIdFields) {
                source.rawItems = sObjectState.externalIdFields.map(
                    (describeResult) => {
                        return {
                            name: describeResult.name,
                            label: describeResult.label,
                            relationshipFieldName: `${this.relationshipName}.${describeResult.name}`,
                            field: describeResult,
                            isSelected: false
                        };
                    }
                );
                source.rawItemMap = source.rawItems.reduce((accum, item) => { 
                    accum[item.name] = item;
                    return accum; 
                }, {});
            } else if (sObjectState.error) {
                // error
                console.error(sObjectState.error);
            }
        }
        if (source.rawItems && createJsonUi.selectedFields) {
            for (let item of source.rawItems) {
                item.isSelected = createJsonUi.selectedFields.some(selectedField => 
                    selectedField.fieldName === item.relationshipFieldName)
            }
        }
    }

    selectField(event) {
        event.stopPropagation();
        const selectItem = this.fieldsSource.rawItemMap[event.currentTarget.dataset.name];
        const fieldName = selectItem.relationshipFieldName;

        if (selectItem.isSelected === false) {
            this.dispatchEvent(createCustomEvent('select', { metadata: selectItem.field, fieldName }));
        } else {
            this.dispatchEvent(createCustomEvent('deselect', { fieldName }));
        }
    }
}
