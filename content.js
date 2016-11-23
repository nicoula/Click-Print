/* Listen for messages */
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	console.log("message received by content.js");
	if (msg.command && msg.command == "get_div" && msg.custom_div_name != "") {	
		sendResponse(document.getElementById(msg.custom_div_name).innerHTML);
	}
});