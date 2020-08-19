import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from './middlewares/logger';

import ui from './modules/ui/reducers';
import webServiceUi from './modules/webServiceUi/reducers';
import createJsonUi from './modules/createJsonUi/reducers';
import sObjects from './modules/sObjects/reducers';
import sObject from './modules/sObject/reducers';
import soap from './modules/soap/reducers';

let middlewares = [thunk];
// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'production') {
    middlewares = [...middlewares, logger];
}

export const store = createStore(
    combineReducers({
        ui,
        webServiceUi,
        createJsonUi,
        sObjects,
        sObject,
        soap
    }),
    applyMiddleware(...middlewares)
);
