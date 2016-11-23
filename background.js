/* When the browser-action button is clicked... */

var div_name = "";

chrome.storage.sync.get('new_div_name', function(result) {
	if (!chrome.runtime.error && !chrome.runtime.lastError && typeof result.new_div_name != "undefined") {
		div_name = result.new_div_name;
	} else {
		chrome.storage.sync.set({'new_div_name': "divCaisseApercuTicket"});
		div_name = "divCaisseApercuTicket";
	}
});

chrome.browserAction.onClicked.addListener(function(tab) {
	console.log(div_name);
	// 1) get receipt div
 	chrome.tabs.sendMessage(tab.id, {command: "get_div", custom_div_name: div_name},
		function(receipt_div) {
		if (receipt_div) {
			// 2) create tab
			chrome.tabs.create({url: chrome.extension.getURL("background.html")}, function (new_tab) {
				// waiting that the new page is completed.
				chrome.tabs.onUpdated.addListener(function(tabId, info) {
					if (info.status == "complete" && tabId == new_tab.id) {
						// 3) set the receipt div to the new tab & print the new tab
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

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
	if (msg.command) {
		if (msg.command == "get_div_name") {
			chrome.storage.sync.get('new_div_name', function(result) {
				if (!chrome.runtime.error && !chrome.runtime.lastError && typeof result.new_div_name != "undefined") {
					div_name = result.new_div_name;
					sendResponse(result.new_div_name);
				} else {
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