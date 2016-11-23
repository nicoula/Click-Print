// function called during the load of options.html
window.onload = function get_div_name() {
        // Get the current div_name. background.js is going to reply
	chrome.extension.sendMessage({command: "get_div_name"}, function(msg) {
		document.querySelector('.my_div_name').innerHTML = msg;
		
                // Add a listener on the button apply to change the current div_name
		document.querySelector("#button1").addEventListener("click", function() {
			var new_div_name = document.querySelector("#input_box").value;
			if (new_div_name != "") {
				// send message to background.js to change the div name
				chrome.extension.sendMessage({command: "set_new_div_name", name: new_div_name}, function(msg) {				
					document.querySelector('.my_div_name').innerHTML = new_div_name;
				});				
			}			
		});		
	});
};		
