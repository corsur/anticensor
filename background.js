chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    var sites, pattern, site, redirectUrl;
    sites = JSON.parse(localStorage.getItem('sites') || '[]');
    for (var i=0; i<sites.length; i++) {
      site = sites[i];
      try {
        pattern = new RegExp(site, 'ig');
      } catch(err) {
        //bad pattern
        continue;
      }
      match = details.url.match(pattern);
      if (match && (details.url.indexOf("web.archive.org") == -1)) {
		  
		//chrome.tabs.update({url: "https://google.com"});
			
		var url = details.url;
		var redirectUrl = "not a URL";


		var archiveUrl = "https://archive.org/wayback/available?url=" + url;
		
		
		var xhr = new XMLHttpRequest();
		xhr.open("GET", archiveUrl, false);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				redirectUrl = JSON.parse(xhr.responseText).archived_snapshots.closest.url;
			}
		}
		xhr.send();
		
		if (!(redirectUrl.indexOf("web.archive.org") == -1)) {
			chrome.tabs.update({url: redirectUrl});
		}
		else {
			chrome.tabs.update({url: "https://web.archive.org/save/" + url});
		}

	  }
    }
    return {};
  },
  {
    urls: [
      "<all_urls>",
    ],
    types: ["main_frame"]
  },
  ["blocking"]
);