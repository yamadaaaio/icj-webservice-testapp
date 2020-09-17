import * as actionTypes from './actionTypes';

export default function apexLog(state = {}, action) {
    switch (action.type) {
        case actionTypes.START_FETCH_APEX_LOG:
            return {
                ...state,
                isFetching: true,
                records: null,
                error: null
            };

        case actionTypes.FETCH_APEX_LOG_SUCCEED:
            return {
                ...state,
                isFetching: false,
                records: action.payload.records,
                error: null
            };

        case actionTypes.FETCH_APEX_LOG_FAILED:
            return {
                ...state,
                isFetching: false,
                records: null,
                error: action.payload.error
            };

        case actionTypes.CLEAR_RESULT:
            return {
                ...state,
                isFetching: false,
                records: null,
                error: null
            };

        default:
            return state;
    }
}
