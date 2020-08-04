import { LightningElement, api } from 'lwc';

export default class Spinner extends LightningElement {
    @api size = 'medium';

    get className() {
        return `slds-spinner slds-spinner_${this.size} slds-spinner_brand`;
    }
}
