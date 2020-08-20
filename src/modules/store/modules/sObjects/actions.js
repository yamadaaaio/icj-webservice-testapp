import * as sfdc from '../../../services/sfdc';
import * as actionTypes from './actionTypes';
import { retrieveApiUsage } from '../ui/actions';

function startFetchSObjects() {
    return {
        type: actionTypes.START_FETCH_SOBJECTS
    };
}

function fetchSObjectsSucceed(data) {
    data.sobjects.sort(compareSObject);
    return {
        type: actionTypes.FETCH_SOBJECTS_SUCCEED,
        payload: { data }
    };
}

const suffixes = ['Share', 'ChangeEvent'];
function compareSObject(a, b) {

    const aSuffix = suffixes.findIndex(suffix => a.name.endsWith(suffix));
    const bSuffix = suffixes.findIndex(suffix => b.name.endsWith(suffix));

    if (aSuffix === bSuffix) {
        if (a.name < b.name) {
            return -1;
        } else if (b.name < a.name) {
            return 1;
        }
    } else if (aSuffix < bSuffix) {
        return -1;
    } else if (bSuffix < aSuffix) {
        return 1;
    }

    return 0;
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
