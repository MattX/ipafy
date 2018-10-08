var transcribed = false;
var dict = null;
var pending = false;
var original = new Map();

var loadingIndicator = $('<div style="background-color: #fcc; border: 1px solid red; z-index: 10000; margin: 0; position: fixed" class="__no_transcribe">Loading...</div>');

function doTranscribe() {
    $("*").each(function() {
        var wrappedThis = $(this);
        if (wrappedThis.css('font-family').startsWith('monospace') || wrappedThis.hasClass("__no_transcribe")) {
            return;
        }
        wrappedThis.contents().each(function() {
            original.set(this, this.nodeValue);

            if (this.nodeType != 3) {
                return;
            }
            this.nodeValue = this.nodeValue.split(/\b/u).map(function(x) {
                var upper = x.toUpperCase();
                if (dict.has(upper)) {
                    return dict.get(upper);
                } else {
                    return x;
                }
            }).join("");
        });
    });
    transcribed = !transcribed;
    loadingIndicator.remove();
}

function toggleTranscribe() {
    if (transcribed) {
        $("*").contents().each(function() {
            if (original.has(this)) {
                this.nodeValue = original.get(this);
            }
        });
        original.clear();
        transcribed = !transcribed;
        loadingIndicator.remove();
    }
    else {
        if (dict == null) {
            pending = true;
            browser.runtime.sendMessage({action: "get-dict"});
        } else {
            doTranscribe();
        }
    }
}

function msgCallback(msg) {
    switch (msg.action) {
    case "do-transcribe":
        $("body").prepend(loadingIndicator);
        window.setTimeout(toggleTranscribe, 1);
        break;
    case "send-dict":
        if (pending) {
            pending = false;
            dict = msg.dict;
            doTranscribe();
        }
        break;
    }
}

browser.runtime.onMessage.addListener(msgCallback);
browser.runtime.sendMessage({action: "transcript-check-page"});

