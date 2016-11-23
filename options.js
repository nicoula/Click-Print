window.onload = function get_div_name() {
	chrome.extension.sendMessage({command: "get_div_name"}, function(msg) {
		document.querySelector('.my_div_name').innerHTML = msg;
		
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


//FIXME enregistrer le nouveau div name quelque part ..