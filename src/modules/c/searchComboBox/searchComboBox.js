/* eslint-disable @lwc/lwc/no-unknown-wire-adapters */
import { LightningElement, api } from 'lwc';
import { createCustomEvent } from '../../utils/customEvent';

const SLDS_IS_OPEN = 'slds-is-open';

export default class SearchComboBox extends LightningElement {
    @api label;
    @api name;
    @api isLoading;
    @api items;

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

    handleFocus(event) {
        event.stopPropagation();
        const combobox = this.template.querySelector('.icj-combobox');
        combobox.classList.add(SLDS_IS_OPEN);
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
        this.dispatchEvent(
            createCustomEvent('keyup', { keyword: event.target.value })
        );
    }

    handleClickItem(event) {
        event.stopPropagation();
        const selectedItem = event.currentTarget.dataset.name;
        const combobox = this.template.querySelector('.icj-combobox__input');
        combobox.value = selectedItem;
        this.dispatchEvent(createCustomEvent('selectitem', { selectedItem }));
    }
}
