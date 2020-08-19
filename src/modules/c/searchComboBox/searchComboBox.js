/* eslint-disable @lwc/lwc/no-unknown-wire-adapters */
import { LightningElement, api, track } from 'lwc';
import { createCustomEvent } from '../../utils/customEvent';
import { filterItems } from '../../utils/itemsSource';

const SLDS_IS_OPEN = 'slds-is-open';

export default class SearchComboBox extends LightningElement {

    @track items;
    _rawItems;

    @api label;
    @api name;
    @api isLoading;
    @api 
    set rawItems(value) {
        this._rawItems = value;
        this.items = this._rawItems;
    }
    get rawItems() {
        return this._rawItems
    }

    @api
    get value() {
        return this.template.querySelector('.icj-combobox__input').value;
    }

    get comboBoxLabel() {
        return `${this.label} (${this.name})`;
    }

    get placeHolderText() {
        return `${this.label}を検索...`;
    }

    get notFoundText() {
        return `一致する${this.label}が見つかりません。`;
    }

    get itemsNotFound() {
        return !this.isLoading && (!this.items || !this.items.length);
    }

    @api
    setComboboxInputValue(value) {
        const input = this.template.querySelector('.icj-combobox__input');
        input.value = value;
        this.filter(value);
    }

    handleFocus(event) {
        event.stopPropagation();
        const combobox = this.template.querySelector('.icj-combobox');
        combobox.classList.add(SLDS_IS_OPEN);
        const input = this.template.querySelector('.icj-combobox__input');
        this.filter(input.value);
        this.dispatchEvent(createCustomEvent('focus'));
    }

    handleBlur(event) {
        event.stopPropagation();
        const combobox = this.template.querySelector('.icj-combobox');
        combobox.classList.remove(SLDS_IS_OPEN);
        this.dispatchEvent(createCustomEvent('blur'));
    }

    handleKeyUp(event) {
        event.stopPropagation();
        this.filter(event.target.value);
        this.dispatchEvent(createCustomEvent('keyup', { keyword: event.target.value }));
    }

    handleClickItem(event) {
        event.stopPropagation();
        const selectedItem = event.currentTarget.dataset.name;
        this.setComboboxInputValue(selectedItem);
        this.dispatchEvent(createCustomEvent('selectitem', { selectedItem }));
    }

    filter(keyword) {
        this.items = filterItems(this.rawItems, keyword);
    }
}
