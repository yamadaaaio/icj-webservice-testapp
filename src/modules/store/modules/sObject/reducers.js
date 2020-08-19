import * as actionTypes from './actionTypes';

function sObject(state = {}, action) {
    switch (action.type) {
        case actionTypes.START_DESCRIBE_SOBJECT:
            return {
                ...state,
                isFetching: true,
                data: null,
                externalIdFields: null,
                error: null
            };

        case actionTypes.DESCRIBE_SOBJECT_SUCCEED: {
            const data = action.payload.data;
            const externalIdFields = data.fields.filter(
                (field) => field.idLookup === true
            );
            return {
                ...state,
                isFetching: false,
                data,
                externalIdFields,
                error: null
            };
        }

        case actionTypes.DESCRIBE_SOBJECT_FAILED:
            return {
                ...state,
                isFetching: false,
                data: null,
                externalIdFields: null,
                error: action.payload.error
            };

        default:
            return state;
    }
}

export default function sObjects(state = {}, action) {
    switch (action.type) {
        case actionTypes.START_DESCRIBE_SOBJECT:
        case actionTypes.DESCRIBE_SOBJECT_SUCCEED:
        case actionTypes.DESCRIBE_SOBJECT_FAILED: {
            const sObjectState = state[action.payload.sObjectType];
            return {
                ...state,
                [action.payload.sObjectType]: sObject(sObjectState, action)
            };
        }

        default:
            return state;
    }
}
