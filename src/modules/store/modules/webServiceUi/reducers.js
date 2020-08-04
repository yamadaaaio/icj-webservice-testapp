import * as actionTypes from './actionTypes';

export default function webServiceUi(state = {}, action) {
    switch (action.type) {
        case actionTypes.CHANGE_OBJECT_TYPE:
            return {
                ...state,
                objectType: action.payload.objectType
            };

        case actionTypes.CHANGE_EXTERNAL_ID_FIELD:
            return {
                ...state,
                externalIdField: action.payload.externalIdField
            };

        default:
            return state;
    }
}
