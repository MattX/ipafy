var transcribing = false;
var tabToTranscribing = new Map();
tabToTranscribing.getOrDefault = function(key, def) {
    if (this.has(key)) return this.get(key);
    else return def;
};
var dict = null;

function extractLine(line) {
    var m = line.match(/^([-A-Z0-9]+)  (.+)$/);
    if (m == null) {
        return null;
    }
    return m.slice(1);
}

function parseDict(lines) {
    var trimmedLines = lines.map(function(x) { return x.trim(); });
    dict = new Map();
    trimmedLines.map(extractLine).filter(function (x) { return x != null;}).forEach(function (entry) {
        dict.set(entry[0], entry[1]);
    });
    return dict;
}

/** Returns a promise */
function getCurrentTabId() {
    return new Promise(function(accept, reject) {
        browser.tabs.query({currentWindow: true, active: true}).then(function (response) { return accept(response[0].id); }, reject);
    });
}

function getDict() {
    $.get(browser.runtime.getURL("resources/cmudict"), null, null, "text").then(function (data) {
        dict = parseDict(data.split("\n"));
    }, function (error) { console.log("error: " + error); });
}

function wrapIdGetter(f) {
    return function(tabId) {
        if (tabId === undefined) {
            getCurrentTabId().then(f);
        }
        else {
            f(tabId);
        }
    }
}

function sendDict(tabId) {
    if (dict == null) {
        return;
    }
    browser.tabs.sendMessage(tabId, {action: "send-dict", dict: dict});
}

function doTranscribe(tabId) {
    browser.tabs.sendMessage(tabId, {action: "do-transcribe", dict: dict});
}

var sendDict = wrapIdGetter(sendDict);
var doTranscribe = wrapIdGetter(doTranscribe);

function messageDispatcher(message, sender) {
    switch(message.action) {
    case "toggle-transcription":
        // implies a check
        getCurrentTabId().then(function(tabId) {
            tabToTranscribing.set(tabId, !tabToTranscribing.getOrDefault(tabId, false));
            doTranscribe(tabId);
            browser.runtime.sendMessage({action: "send-check", transcribing: tabToTranscribing.getOrDefault(tabId, false)});
        });
        break;
    case "transcript-check-page":
        getCurrentTabId().then(function(tabId) {
            if (tabToTranscribing.getOrDefault(tabId, false)) {
                doTranscribe(tabId);
            }
        });
        break;
    case "transcript-page":
        doTranscribe();
        break;
    case "transcript-check-popup":
        getCurrentTabId().then(function(tabId) {
            browser.runtime.sendMessage({action: "send-check", transcribing: tabToTranscribing.getOrDefault(tabId, false)});
        });
        break;
    case "get-dict":
        sendDict();
        break;
    }
}

function deletedTabListener(tabId) {
    tabToTranscribing.delete(tabId);
}

browser.browserAction.onClicked.addListener(sendDict);
browser.tabs.onRemoved.addListener(deletedTabListener);
browser.runtime.onMessage.addListener(messageDispatcher);
getDict();

