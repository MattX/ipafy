var $ = require("jquery");
var browser = require("webextension-polyfill");

var btnToggle = $("#btn-toggle");
var btnPage = $("#btn-page");
var labelStatus = $("#toggle-status");

function updateToggleText(transcribing) {
    labelStatus.html(transcribing ? "on" : "off");

    if (transcribing) {
        labelStatus.addClass("status-active");
    }
    else {
        labelStatus.removeClass("status-active");
    }
}

function messageDispatcher(message, sender) {
    switch(message.action) {
    case "send-check":
        updateToggleText(message.transcribing);
        break;
    }
    return false;
}

btnToggle.click(function() {
    browser.runtime.sendMessage({action: "toggle-transcription"});
});

btnPage.click(function() {
    browser.runtime.sendMessage({action: "transcript-page"});
});

browser.runtime.onMessage.addListener(messageDispatcher);
browser.runtime.sendMessage({action: "transcript-check-popup"});
