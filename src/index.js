import '@lwc/synthetic-shadow'; // Shadow DOMをポリフィル
import { createElement, register } from 'lwc';
import AppContainer from 'app/container';

import { registerWireService } from '@lwc/wire-service';
registerWireService(register);

const app = createElement('app-container', { is: AppContainer });
// eslint-disable-next-line @lwc/lwc/no-document-query
document.querySelector('#main').appendChild(app);
