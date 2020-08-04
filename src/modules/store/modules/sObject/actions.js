import * as sfdc from '../../../services/sfdc';
import * as actionTypes from './actionTypes';
import { retrieveApiUsage } from '../ui/actions';

function startDescribeSObject(sObjectType) {
    return {
        type: actionTypes.START_DESCRIBE_SOBJECT,
        payload: { sObjectType }
    };
}

function describeSObjectSucceed(sObjectType, data) {
    return {
        type: actionTypes.DESCRIBE_SOBJECT_SUCCEED,
        payload: { sObjectType, data }
    };
}

function describeSObjectFailed(sObjectType, error) {
    return {
        type: actionTypes.DESCRIBE_SOBJECT_FAILED,
        payload: { sObjectType, error }
    };
}

export function describeSObjectIfNeeded(sObjectType) {
    return (dispatch, getState) => {
        const state = getState();

        console.log('sObject.isLoggedIn(state) = ' + isLoggedIn(state));
        console.log(
            'needFetch(state, sObjectType) = ' + needFetch(state, sObjectType)
        );

        if (isLoggedIn(state) && needFetch(state, sObjectType)) {
            dispatch(startDescribeSObject(sObjectType));
            sfdc.connection
                .describeSObject(sObjectType)
                .then((res) => {
                    dispatch(describeSObjectSucceed(sObjectType, res));
                    dispatch(retrieveApiUsage());
                })
                .catch((error) => {
                    dispatch(describeSObjectFailed(sObjectType, error));
                });
        }
    };
}

function needFetch({ sObjects, sObject }, sObjectType) {
    if (!sObjects || !sObjects.data) {
        return false;
    }

    if (sObject[sObjectType]) {
        return false;
    }

    return sObjects.data.sobjects.some((sObj) => {
        return sObj.name === sObjectType;
    });
}

function isLoggedIn({ ui }) {
    return ui && ui.isLoggedIn;
}
