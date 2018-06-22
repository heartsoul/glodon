const SEARCH_TYPE_GLOBAL = "SEARCH_TYPE_GLOBAL";
const SEARCH_TYPE_QUALITY = "SEARCH_TYPE_QUALITY";
const SEARCH_TYPE_EQUIPMENT = "SEARCH_TYPE_EQUIPMENT";
const SEARCH_TYPE_BIM = "SEARCH_TYPE_BIM";


function loadSearchHistory(type) {
    let history = storage.loadSearchHistory(type)
    let items = [];
    if (history && history.length > 0) {
        items = history.split(",")
    }
    return items;
}

function saveHistory(keywords, type) {
    let history = storage.loadSearchHistory(type);
    let items = [];
    if (history && history.length > 0) {
        items = history.split(",")
    }
    let index = items.findIndex((value) => {
        return keywords === value;
    });
    if (index >= 0) {
        items.splice(index, 1)
    }
    items.unshift(keywords);
    if (items.length > 20) {
        items.pop();
    }
    let newHistory = items.join(",");
    storage.setSearchHistory(type, newHistory);
    return items;
}

export const SearchHistory = {
    SEARCH_TYPE_GLOBAL,
    SEARCH_TYPE_QUALITY,

    SEARCH_TYPE_EQUIPMENT,
    SEARCH_TYPE_BIM,

    loadSearchHistory,
    saveHistory,
}