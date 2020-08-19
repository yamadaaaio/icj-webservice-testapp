import * as actionTypes from './actionTypes';

export function selectSObject(selectedSObjectName) {
    return {
        type: actionTypes.SELECT_SOBJECT,
        payload: { selectedSObjectName }
    };
}

export function clearSelectedSObject() {
    return {
        type: actionTypes.CLEAR_SELECTED_SOBJECT,
        payload: { }
    };
}

export function selectField(fieldName, metadata) {
    return {
        type: actionTypes.SELECT_FIELD,
        payload: { fieldName, metadata }
    };
}

export function deselectField(fieldName) {
    return {
        type: actionTypes.DESELECT_FIELD,
        payload: { fieldName }
    };
}

export function clearSelectedField() {
    return {
        type: actionTypes.CLEAR_SELECTED_FIELD,
        payload: { }
    };
}

export function createJson(jsonString) {
    return {
        type: actionTypes.CREATE_JSON,
        payload: { jsonString }
    };
}

export function clearJsonString() {
    return {
        type: actionTypes.CLEAR_JSON_STRING,
        payload: { }
    };
}