/* eslint-disable @lwc/lwc/no-unknown-wire-adapters */
import { LightningElement, track, wire } from 'lwc';
import { store, connectStore } from '../../store/store';
import actions from '../../store/actions';
import * as tabs from '../../app/container/tabs';

const KEY_SPLITTER = '-';

export default class CreateJsonPanel extends LightningElement {

    selectedSObject;
    @track fields;
    @track rows;
    _focus;

    constructor() {
        super();
        this.fields = [];
        this.rows = [];
        this.addDataRow(0);
    }

    get isSelectedSObject() {
        return this.selectedSObject != null; 
    }

    get isEmpty() {
        return this.fields.length === 0;
    }

    renderedCallback() {
        if (this._focus) {
            const dataColumns = this.template.querySelectorAll('.icj-data-column');
            dataColumns[this._focus].focus();
            this._focus = null;
        }
    }

    @wire(connectStore, { store })
    storeUpdated({ createJsonUi }) {

        this.selectedSObject = createJsonUi.selectedSObjectName;

        if (createJsonUi.selectedFields) {
            const selectedFields = createJsonUi.selectedFields;

            const addFields = selectedFields.filter(selectedField => 
                !this.fields.some(field => 
                    field.fieldName === selectedField.fieldName)
            );

            for (let row of this.rows) {
                for (let addField of addFields) {
                    row.columns.push({
                        key: `${row.key}${KEY_SPLITTER}${addField.fieldName}`,
                        name: addField.fieldName,
                        type: addField.metadata.type,
                        value: null
                    });
                }

                row.columns = row.columns.filter(column => 
                    selectedFields.some(field => 
                        field.fieldName === column.name));

                row.fields = row.columns.reduce((rowFields, column) => { 
                    return { ...rowFields, [column.name]: column }
                }, {});
            }

            this.fields = selectedFields;
        }

        if (this.isEmpty) {
            this.rows = [];
            this.addDataRow(0);
        }
    }

    addDataRow(rowIndex) {
        const row = {
            key: rowIndex,
            rowNo: rowIndex + 1,
            columns: [],
            fields: {}
        };

        for (let field of this.fields) {
            const column = {
                key: `${row.key}${KEY_SPLITTER}${field.fieldName}`,
                name: field.fieldName,
                type: field.metadata.type,
                value: null
            };
            row.columns.push(column);
            row.fields[field.fieldName] = column;
        }

        this.rows.push(row);
    }

    handleSelectSObject(event) {
        store.dispatch(actions.createJsonUi.selectSObject(
            event.detail.selectedSObject));
    }

    handleSelectField(event) {
        store.dispatch(actions.createJsonUi.selectField(
            event.detail.fieldName, event.detail.metadata));
    }

    handleDeselectField(event) {
        store.dispatch(actions.createJsonUi.deselectField(
            event.detail.fieldName));
    }

    removeField(event) {
        const fieldName = event.target.dataset.name;
        store.dispatch(actions.createJsonUi.deselectField(fieldName));
    }

    changeColumnValue(event) {
        const [rowIndex, fieldName] = event.target.dataset.columnKey.split(KEY_SPLITTER);
        this.updateColumnValue(rowIndex, fieldName, event.target.value);
    }

    updateColumnValue(rowIndex, fieldName, value) {
        this.rows[rowIndex].fields[fieldName].value = value === "" ? null : value;
    }

    moveCell(event) {

        if ([13, 37, 38, 39, 40].some(keyCode => event.keyCode === keyCode) === false) {
            // 矢印キー、エンターのみセル移動
            return;
        }

        const valueLength = event.target.value.length;
        if ((event.keyCode === 37 && event.target.selectionStart !== 0) ||
            (event.keyCode === 39 && event.target.selectionStart !== valueLength)) {
            // 左矢印キーはカーソルが先頭の場合のみ、
            // 右矢印キーはカーソルが末尾の場合のみセル移動
            return;
        }

        event.preventDefault();
        const dataColumns = this.template.querySelectorAll('.icj-data-column');
        const max = dataColumns.length - 1;
        let current = 0;
        for (; current < max; current++) {
            if (dataColumns[current].dataset.columnKey === event.target.dataset.columnKey) {
                break;
            }
        }
        
        let next = current;

        if (event.keyCode === 37) {
            // 左矢印キー
            next--;
        }
        else if (event.keyCode === 38) {
            // 上矢印キー
            next -= this.fields.length;
        }
        else if (event.keyCode === 39) {
            // 右矢印キー
            next ++;
        }
        else if (event.keyCode === 40 || event.keyCode === 13) {
            // 下矢印キーまたはエンター
            next += this.fields.length;
        }

        if (next < 0) {
            // 要素がないため移動しない
            return;
        }

        if (max < next) {
            // 行を追加する
            const [rowIndex, fieldName] = event.target.dataset.columnKey.split(KEY_SPLITTER);
            this.updateColumnValue(rowIndex, fieldName, event.target.value);
            this.addDataRow(parseInt(rowIndex, 10) + 1);
            this._focus = next;
            return;
        }

        dataColumns[next].focus();
    }

    handleReturn() {
        store.dispatch(actions.createJsonUi.clearSelectedSObject());
    }

    clearAllValues() {
        this.rows.forEach(row => row.columns.forEach(column => { column.value = null; }));
    }

    clearAllFields() {
        store.dispatch(actions.createJsonUi.clearSelectedField());
    }
    
    createJson() {
        const records = [];
        const isEmptyRow = row => !row.columns.some(({value}) => value !== null);
        for(let row of this.rows) {
            if (isEmptyRow(row)) {
                continue;
            }

            console.log(JSON.stringify(row, null, 4));

            const record = row.columns.reduce((prev, column) => {
                let value;
                if (column.value == null) {
                    value = null;
                } else if (column.type === 'double' || column.type === 'percent') {
                    value = parseFloat(column.value);
                    if (Number.isNaN(value)) {
                        value = 'NaN';
                    }
                } else if (column.type === 'boolean') {
                    value = column.value.toLowerCase() === "true";
                } else {
                    value = column.value;
                }
                prev = { ...prev, [column.name]: value};
                return prev;
            }, {});

            records.push(record);
        }

        store.dispatch(actions.createJsonUi.createJson(JSON.stringify(records, null, 4)));
        store.dispatch(actions.ui.changeTab(tabs.EXEC_WEB_SERVICE))
    }
}
