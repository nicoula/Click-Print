
var div_name = "";

// Init of the var div_name. get the value from the chrome storage.
chrome.storage.sync.get('new_div_name', function(result) {
	if (!chrome.runtime.error && !chrome.runtime.lastError && typeof result.new_div_name != "undefined") {
		div_name = result.new_div_name;
	} else {
		chrome.storage.sync.set({'new_div_name': "divCaisseApercuTicket"});
		div_name = "divCaisseApercuTicket";
	}
});

/* When the browser-action button is clicked... */
chrome.browserAction.onClicked.addListener(function(tab) {
	console.log(div_name);
	// 1) get the content which is going to be printed. Sent to content.js which have access to the information on the current webpage.
 	chrome.tabs.sendMessage(tab.id, {command: "get_div", custom_div_name: div_name},
		function(receipt_div) {
		if (receipt_div) {
			// 2) create tab
			chrome.tabs.create({url: chrome.extension.getURL("background.html")}, function (new_tab) {
				// waiting that the new page is completed.
				chrome.tabs.onUpdated.addListener(function(tabId, info) {
					if (info.status == "complete" && tabId == new_tab.id) {
						// 3) set the content of the div to the new tab & print the new tab. Sent to extension.js
						chrome.tabs.sendMessage(new_tab.id, {command: "set_div", new_div: receipt_div, id: new_tab.id}, function(msg) {
							// 4) close the new tab
							chrome.tabs.remove(new_tab.id);
						});
					}
				});
			});
		}
    });
});

// reply to options.js for getting or setting the div_name.
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
	if (msg.command) {
		if (msg.command == "get_div_name") {
                        // get the name from the chrome storage
			chrome.storage.sync.get('new_div_name', function(result) {
                                // if the name exist and there is no error
				if (!chrome.runtime.error && !chrome.runtime.lastError && typeof result.new_div_name != "undefined") {
					div_name = result.new_div_name;
					sendResponse(result.new_div_name);
				} else {
                                        // send the default value in case of runtime error. The name should had been set by chrome.storage.sync.get
					sendResponse("divCaisseApercuTicket");
				}
			});
			return true;
		} else if (msg.command == "set_new_div_name" && msg.name != "") {
			div_name = msg.name;
			chrome.storage.sync.set({'new_div_name': msg.name});			
		}
	}
});
