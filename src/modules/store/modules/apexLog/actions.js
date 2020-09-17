import * as sfdc from '../../../services/sfdc';
import * as actionTypes from './actionTypes';
import { retrieveApiUsage } from '../ui/actions';

function startFetchApexLog() {
    return {
        type: actionTypes.START_FETCH_APEX_LOG
    };
}

function fetchApexLogSucceed(records) {
    return {
        type: actionTypes.FETCH_APEX_LOG_SUCCEED,
        payload: { records }
    };
}

function fetchApexLogFailed(error) {
    return {
        type: actionTypes.FETCH_APEX_LOG_FAILED,
        payload: { error }
    };
}

export function fetchApexLog(limit, offset, filterOptions) {

    return (dispatch) => {
        dispatch(startFetchApexLog());
        sfdc.connection.sobject("ApexLog")
        .find(
            filterOptions,
            {
                Id: 1,
                LogUserId: 1,
                'LogUser.Name': 1,
                LogLength: 1,
                StartTime: 1,
                Request: 1,
                Operation: 1,
                Application: 1,
                Status: 1,
                DurationMilliseconds: 1
            }
        )
        .sort({
            StartTime: -1
        })
        .limit(limit)
        .skip(offset)
        .execute(function(err, records) {
            if (err) {
                dispatch(fetchApexLogFailed(err));
            } else {
                dispatch(fetchApexLogSucceed(records));
                dispatch(retrieveApiUsage());
            }
        }) 
    };
}

export function clearResult() {
    return {
        type: actionTypes.CLEAR_RESULT
    };
}