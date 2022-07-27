/**
 * Pin保存用の正規化されたURLを返す
 * @param {String} url
 * @returns 正規化されたURL
 */
function normalizeURL(url){
    return url.split('#')[0].split('?')[0];
}

/**
 * URL保存する
 * @param {String} url
 */
function savePinURL(url) {
    chrome.storage.local.set({
        [normalizeURL(url)]: true
    });
}

/**
 * URLが設定されていればcallbackが呼ばれる
 * @param {String} url
 * @param {*} callback
 */
function hasPinURL(url, callback) {
    url = normalizeURL(url);
    chrome.storage.local.get(url, result => {
        if (result[url]) {
            callback();
        }
    });
}

/**
 * 登録されているURLを削除する
 * @param {String} url
 */
function removePinURL(url) {
    chrome.storage.local.remove(normalizeURL(url));
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if (changeInfo.pinned) {
        savePinURL(tab.url);
    } else if ('pinned' in changeInfo) {
        removePinURL(tab.url);
    }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if (changeInfo.url) {
        hasPinURL(tab.url, () => {
            chrome.tabs.update(tab.id, { 'pinned':true });
        });
    }
});
