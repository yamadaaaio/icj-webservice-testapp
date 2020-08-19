import * as actionTypes from './actionTypes';

export default function createJsonUi(state = {}, action) {
    switch (action.type) {

        case actionTypes.SELECT_SOBJECT:
            return {
                ...state,
                selectedSObjectName: action.payload.selectedSObjectName,
                selectedFields: [],
                filterFieldName: null
            };
        
        case actionTypes.CLEAR_SELECTED_SOBJECT:
            return {
                ...state,
                selectedSObjectName: null,
                selectedFields: [],
                filterFieldName: null
            };

        case actionTypes.SELECT_FIELD:
            return {
                ...state,
                selectedFields: [ 
                    ...state.selectedFields,
                    {
                        fieldName: action.payload.fieldName,
                        metadata: action.payload.metadata
                    }],
            };

        case actionTypes.DESELECT_FIELD:
            return {
                ...state,
                selectedFields: state.selectedFields.filter(
                    field => field.fieldName !== action.payload.fieldName)
            };

        case actionTypes.CLEAR_SELECTED_FIELD:
            return {
                ...state,
                selectedFields: []
            };

        case actionTypes.CREATE_JSON:
            return {
                ...state,
                jsonString: action.payload.jsonString
            };

        case actionTypes.CLEAR_JSON_STRING:
            return {
                ...state,
                jsonString: null
            };

        default:
            return state;
    }
}
