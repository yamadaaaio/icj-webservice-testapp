export const INITIAL_SOURCE = {
    isLoading: false,
    rawItems: null
};

export function filterItems(rawItems, keyword) {
    let items = null;

    if (!rawItems) {
        return items;
    }
    if (keyword) {
        const regexp = new RegExp(escapeRegExp(keyword), 'i');
        items = rawItems.filter((item) => {
            return regexp.test(`${item.name} ${item.label}`);
        });
    } else {
        items = rawItems;
    }

    return items;
}

function escapeRegExp(str) {
    if (!str) return '';
    return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}