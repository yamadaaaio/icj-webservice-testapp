import { register, ValueChangedEvent } from '@lwc/wire-service';

export function connectStore(store) {
    return store.getState();
}

register(connectStore, (eventTarget) => {
    let store;
    let unsubscribe;

    const notifyStateChange = () => {
        const state = connectStore(store);
        eventTarget.dispatchEvent(new ValueChangedEvent(state));
    };

    eventTarget.addEventListener('config', (config) => {
        store = config.store;
        console.log('config');
    });

    eventTarget.addEventListener('connect', () => {
        unsubscribe = store.subscribe(notifyStateChange);
        notifyStateChange();
        console.log('connect');
    });

    eventTarget.addEventListener('disconnect', () => {
        if (unsubscribe) {
            unsubscribe();
        }
        console.log('disconnect');
    });
});
