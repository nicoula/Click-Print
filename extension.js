chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	if (msg.command && msg.command == "set_div") {
		var elem_empty_div = document.getElementById("empty_div");
		if (msg.new_div && elem_empty_div) {
			elem_empty_div.innerHTML = msg.new_div;
			elem_empty_div.style.fontWeight = "bold";
			elem_empty_div.style.fontSize = "medium";
			window.print();
		} 
	}
});