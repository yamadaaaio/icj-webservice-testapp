import * as actionTypes from './actionTypes';

export default function sObjects(state = {}, action) {
    switch (action.type) {
        case actionTypes.START_FETCH_SOBJECTS:
            return {
                ...state,
                isFetching: true,
                data: null,
                error: null
            };

        case actionTypes.FETCH_SOBJECTS_SUCCEED:
            return {
                ...state,
                isFetching: false,
                data: action.payload.data,
                error: null
            };

        case actionTypes.FETCH_SOBJECTS_FAILED:
            return {
                ...state,
                isFetching: false,
                data: null,
                error: action.payload.error
            };

        default:
            return state;
    }
}
