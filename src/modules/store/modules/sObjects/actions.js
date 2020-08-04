import * as sfdc from '../../../services/sfdc';
import * as actionTypes from './actionTypes';
import { retrieveApiUsage } from '../ui/actions';

function startFetchSObjects() {
    return {
        type: actionTypes.START_FETCH_SOBJECTS
    };
}

function fetchSObjectsSucceed(data) {
    return {
        type: actionTypes.FETCH_SOBJECTS_SUCCEED,
        payload: { data }
    };
}

function fetchSObjecsFailed(error) {
    return {
        type: actionTypes.FETCH_SOBJECTS_FAILED,
        payload: { error }
    };
}

export function fetchSObjectsIfNeeded() {
    return (dispatch, getState) => {
        const state = getState();
        if (isLoggedIn(state) && needFetch(state)) {
            dispatch(startFetchSObjects());
            sfdc.connection
                .describeGlobal()
                .then((res) => {
                    dispatch(fetchSObjectsSucceed(res));
                    dispatch(retrieveApiUsage());
                })
                .catch((error) => {
                    dispatch(fetchSObjecsFailed(error));
                });
        }
    };
}

function needFetch({ sObjects }) {
    return !sObjects || !sObjects.data;
}

function isLoggedIn({ ui }) {
    return ui && ui.isLoggedIn;
}
