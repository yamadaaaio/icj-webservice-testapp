import * as actionTypes from './actionTypes';

export default function soap(state = {}, action) {
    switch (action.type) {
        case actionTypes.START_EXECUTE_WEBSERVICE:
            return {
                ...state,
                isExecuting: true
            };

        case actionTypes.EXECUTE_WEBSERVICE_SUCCEED:
            return {
                ...state,
                isExecuting: false,
                response: action.payload.response,
                error: null
            };

        case actionTypes.EXECUTE_WEBSERVICE_FAILED:
            return {
                ...state,
                isExecuting: false,
                response: null,
                error: action.payload.error
            };

        default:
            return state;
    }
}
