/* eslint-disable @lwc/lwc/no-unknown-wire-adapters */
import { LightningElement, api, track, wire } from 'lwc';
import { store, connectStore } from '../../store/store';
import actions from '../../store/actions';
import { INITIAL_SOURCE, filterItems } from '../../utils/itemsSource';
import { createCustomEvent } from '../../utils/customEvent';

export default class SearchField extends LightningElement {

    @api sobject = '';
    @track items;
    @track fieldsSource;

    get isNotFound() {
        return (this.fieldsSource) && 
               (!this.fieldsSource.isLoading) && 
               (this.items) && (this.items.length === 0)
    }

    constructor() {
        super();
        this.fieldsSource = { 
            ...INITIAL_SOURCE,
            sObjectName: null,
            sObjectLabel: null
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
            if (sObjectState.data) {
                source.sObjectName = sObjectState.data.name;
                source.sObjectLabel = sObjectState.data.label;
                source.rawItems = sObjectState.data.fields.map(
                    (describeResult) => {
                        const isReference = (describeResult.referenceTo.length === 1);
                        return {
                            name: describeResult.name,
                            label: describeResult.label,
                            field: describeResult,
                            isSeleted: false,
                            isExpanded: false,
                            referenceTo: isReference ? describeResult.referenceTo[0] : null
                        };
                    }
                );
                source.rawItemMap = source.rawItems.reduce((accum, item) => { 
                    accum[item.name] = item;
                    return accum; 
                }, {});

                this.items = source.rawItems;

            } else if (sObjectState.error) {
                // error
                console.error(sObjectState.error);
            }
        }

        if (source.rawItems) {
            if (createJsonUi.selectedFields) {
                for (let item of source.rawItems) {
                    item.isSelected = createJsonUi.selectedFields.some(selectedField => 
                        selectedField.fieldName === item.name)
                }
            }
        }
    }

    focusSearchBox(event) {
        event.preventDefault();
        const valueLength = event.target.value.length;
        event.target.selectionStart = 0;
        event.target.selectionEnd = valueLength;
    }

    filterField(event) {
        this.items = filterItems(
            this.fieldsSource.rawItems, event.target.value);
    }

    selectField(event) {
        event.stopPropagation();
        const selectItem = this.fieldsSource.rawItemMap[event.currentTarget.dataset.name];
        const fieldName = selectItem.field.name;

        if (selectItem.isSelected === false) {
            this.dispatchEvent(createCustomEvent('select', { metadata: selectItem.field, fieldName }));
        } else {
            this.dispatchEvent(createCustomEvent('deselect', { fieldName }));
        }
    }

    handleSelectRelationshipField(event) {
        this.dispatchEvent(createCustomEvent('select', event.detail));
    }

    handleDeselectRelationshipField(event) {
        this.dispatchEvent(createCustomEvent('deselect', event.detail));
    }

    clickReturn() {
        this.dispatchEvent(createCustomEvent('return'));
    }

    expandTree(event) {
        event.stopPropagation();
        const expandItemName = event.target.dataset.name;
        const field = this.fieldsSource.rawItemMap[expandItemName];
        field.isExpanded = !field.isExpanded;
    }
}
