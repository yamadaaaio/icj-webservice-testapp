import * as actionTypes from './actionTypes';

export default function soap(state = {}, action) {
    switch (action.type) {
        case actionTypes.START_EXECUTE_WEBSERVICE:
            return {
                ...state,
                isExecuting: true,
                completeDate: null
            };

        case actionTypes.EXECUTE_WEBSERVICE_SUCCEED:
            return {
                ...state,
                isExecuting: false,
                response: action.payload.response,
                completeDate: new Date(),
                error: null
            };

        case actionTypes.EXECUTE_WEBSERVICE_FAILED:
            return {
                ...state,
                isExecuting: false,
                response: null,
                error: action.payload.error,
                completeDate: new Date(),
            };

        default:
            return state;
    }
}
