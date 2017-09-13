$(function(){
	$('#refreshArchive').click(function(){
		chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
			
			
			
			var url = tabs[0].url;
			
			if (url.indexOf("web.archive.org") == -1) {
				chrome.tabs.update({url: "https://web.archive.org/save/" + url});
			}
			else {
				chrome.tabs.update({url: "https://web.archive.org/save/" + url.slice(29+url.slice(28).indexOf("/"))});
			}
			
		});
	});
	$('#leaveArchive').click(function(){
		chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
			
			
			var url = tabs[0].url;
			
			if (!(url.indexOf("web.archive.org") == -1)) {
				var originalUrl = url.slice(29+url.slice(28).indexOf("/"));
				
				
				var site;
				var sitesToAdd = [];
				var sites = JSON.parse(localStorage.getItem('sites') || '[]');
				
				
				for (var i=0; i<sites.length; i++) {
					site = sites[i];
					
					if (!(originalUrl.indexOf(site) == -1)) {
						//keep track of sites that would be triggered
						sitesToAdd.push(site);
						
						//remove the sites
						sites.splice(sites.indexOf(site), 1);
	
					}
				}
				
				
				localStorage.setItem('sites', JSON.stringify(sites));
				
				chrome.tabs.update({url: originalUrl});
				
				for (var i=0; i<sitesToAdd.length; i++) {
					site = sitesToAdd[i];

					sites.push(site);
				}
				
				
				setTimeout(function () {
					localStorage.setItem('sites', JSON.stringify(sites));
					sites = JSON.parse(localStorage.getItem('sites') || '[]');
				
					$('#results').html(JSON.stringify(sites));
				}, 300);
			}
			
		});
	});
});