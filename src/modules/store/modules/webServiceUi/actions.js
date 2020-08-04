import * as actionTypes from './actionTypes';

export function changeObjectType(objectType) {
    return {
        type: actionTypes.CHANGE_OBJECT_TYPE,
        payload: { objectType }
    };
}

export function changeExternalIdField(externalIdField) {
    return {
        type: actionTypes.CHANGE_EXTERNAL_ID_FIELD,
        payload: { externalIdField }
    };
}
