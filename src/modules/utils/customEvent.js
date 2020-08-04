export function createCustomEvent(eventType, eventArgs) {
    const detail = eventArgs || {};
    return CustomEvent(eventType, { detail });
}
