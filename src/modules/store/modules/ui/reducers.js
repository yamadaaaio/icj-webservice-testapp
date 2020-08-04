import * as actionTypes from './actionTypes';

export default function ui(state = {}, action) {
    switch (action.type) {
        case actionTypes.LOGGEDIN:
            return {
                ...state,
                isLoggedIn: true,
                soapOptions: action.payload.soapOptions,
                user: action.payload.user
            };

        case actionTypes.LOGGEDOUT:
            return {
                isLoggedIn: false
            };

        case actionTypes.CHANGE_TAB:
            return {
                ...state,
                selectedTabName: action.payload.selectedTabName
            };

        case actionTypes.UPDATE_LIMITS:
            return {
                ...state,
                apiUsage: action.payload.apiUsage
            };

        default:
            return state;
    }
}
