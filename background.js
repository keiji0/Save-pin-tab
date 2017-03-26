var pintab = (function(){
    var tabkey = 'pintabs';
    var tabs = localStorage.getItem(tabkey) ?
        JSON.parse(localStorage.getItem(tabkey)) :
        {};
    return {
        all: function (){
            return tabs;
        },
        set: function (url){
            tabs[url] = true;
            localStorage.setItem(tabkey, JSON.stringify(tabs));
        },
        get: function (url){
            return tabs[url];
        },
        del: function (url){
            delete tabs[url];
            localStorage.setItem(tabkey, JSON.stringify(tabs));
        }
    };
})();

function parseurl(url){
    return url.split('#')[0].split('?')[0];
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    var url = parseurl(tab.url);
    if (changeInfo.pinned) {
        pintab.set(url);
    } else if ('pinned' in changeInfo) {
        pintab.del(url);
    }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if (changeInfo.url) {
        var url = parseurl(tab.url);
        if (pintab.get(url)) {
            chrome.tabs.update(tab.id, { 'pinned':true });
        }
    }
});
