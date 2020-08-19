/* eslint-disable @lwc/lwc/no-unknown-wire-adapters */
import { LightningElement, wire, track } from 'lwc';
import { store, connectStore } from '../../store/store';
import actions from '../../store/actions';
import { INITIAL_SOURCE, filterItems } from '../../utils/itemsSource';
import { createCustomEvent } from '../../utils/customEvent';

export default class SearchSObject extends LightningElement {

    @track sObjectsSource;
    @track items;

    get isNotFound() {
        return (this.sObjectsSource) && 
               (!this.sObjectsSource.isLoading) && 
               (this.items) && (this.items.length === 0)
    }

    constructor() {
        super();
        this.sObjectsSource = { ...INITIAL_SOURCE };
    }

    @wire(connectStore, { store })
    storeUpdated({ ui, sObjects }) {

        if (ui.selectedTabName === 'createJson') {
            if (!this.sObjectsSource.rawItems) {
                if (!sObjects.isFetching && !sObjects.data) {
                    store.dispatch(actions.sObjects.fetchSObjectsIfNeeded());
                    return;
                }

                const source = this.sObjectsSource;
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

                    this.items = source.rawItems;

                } else if (sObjects.error) {
                    // error
                    console.error(sObjects.error);
                }
            }
        }
    }

    filterSObject(event) {
        this.items = filterItems(
            this.sObjectsSource.rawItems, event.target.value);
    }

    selectSObject(event) {
        const selectedSObject = event.currentTarget.dataset.name;
        this.dispatchEvent(createCustomEvent('select', { selectedSObject }));
    }
}
