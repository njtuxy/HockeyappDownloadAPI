var request = require('request');
var fs = require('fs');
var argv = require('electron').argv();


var api_token = argv.params["api_token"]
var app_token = argv.params["app_token"]
var file = argv.params["file"]

if(api_token===undefined){
	console.log("I need your HockyApp Api token as the first parameter");
	process.exit();
}

if(app_token===undefined){
	console.log("I need your HockyApp App token as the second parameter");
	process.exit();
}

if(file===undefined){
	console.log("I need a name for the output file, e.g. Starwars.ipa");
	process.exit();
}

var options1 = {
  url: 'https://rink.hockeyapp.net/api/2/apps/'+ app_token +'/app_versions',
  headers: {
    'X-HockeyAppToken': api_token
  }
};

request(options1, function(error, response, body){
	
	if (!error && response.statusCode == 200) {
	    var info = JSON.parse(body);    
	    var download_url = info.app_versions[0].download_url;
	    console.log("Get download url successfully!")
	    var options2 = {
	    	url: 'https://rink.hockeyapp.net/api/2/apps/'+ app_token +'/app_versions?include_build_urls=true&build_url=' + download_url,
	    	headers: {
			    'X-HockeyAppToken': api_token
  			}
	    }

	    request(options2, function(error, response, body){
	    	if (!error && response.statusCode == 200) {
	    		var info = JSON.parse(body);
	    		var build_url = info.app_versions[0].build_url;
	    		console.log("Get build_url url successfully!");
	    		console.log("Start to download the build file, which may take a minute");
	    		request.get(build_url).pipe(fs.createWriteStream(file));
	    	}
	    })

	}
})
 

