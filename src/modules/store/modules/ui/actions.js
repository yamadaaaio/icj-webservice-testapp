import * as actionTypes from './actionTypes';
import * as sfdc from '../../../services/sfdc';

export function loggedin(user, soapOptions) {
    return {
        type: actionTypes.LOGGEDIN,
        payload: { user, soapOptions }
    };
}

export function loggedout() {
    return {
        type: actionTypes.LOGGEDOUT
    };
}

export function changeTab(selectedTabName) {
    return {
        type: actionTypes.CHANGE_TAB,
        payload: { selectedTabName }
    };
}

export function updateLimits(apiUsage) {
    return {
        type: actionTypes.UPDATE_LIMITS,
        payload: { apiUsage }
    };
}

export function retrieveApiUsage() {
    // eslint-disable-next-line no-unused-vars
    return (dispatch, getStore) => {
        dispatch(retrieveApiUsageAsync());
    };
}

export function retrieveApiUsageAsync() {
    return async (dispatch) => {
        const limits = await sfdc.connection.request(
            `/services/data/v${sfdc.connection.version}/limits`
        );
        const apiUsage = {
            used:
                limits.DailyApiRequests.Max - limits.DailyApiRequests.Remaining,
            limit: limits.DailyApiRequests.Max
        };
        dispatch(updateLimits(apiUsage));
    };
}
