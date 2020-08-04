import * as sfdc from '../../../services/sfdc';
import * as actionTypes from './actionTypes';
import { retrieveApiUsage } from '../ui/actions';

function startExecuteWebService() {
    return {
        type: actionTypes.START_EXECUTE_WEBSERVICE
    };
}

function executeWebServiceSucceed(response) {
    return {
        type: actionTypes.EXECUTE_WEBSERVICE_SUCCEED,
        payload: { response }
    };
}

function executeWebServiceFailed(error) {
    return {
        type: actionTypes.EXECUTE_WEBSERVICE_FAILED,
        payload: { error }
    };
}

export function executeWebService(method, args) {
    return (dispatch, getState) => {
        const state = getState();
        const SOAP = require('jsforce/lib/soap');
        const soapRequest = new SOAP(sfdc.connection, state.ui.soapOptions);
        dispatch(startExecuteWebService());

        soapRequest
            .invoke(method, { req: args })
            .then((res) => {
                dispatch(executeWebServiceSucceed(res));
                dispatch(retrieveApiUsage());
            })
            .catch((error) => {
                dispatch(executeWebServiceFailed(error));
            });
    };
}
