var bleno = require('bleno');
var exec = require('child_process').exec;
var request = require('request');
var _ = require('lodash');

var uuid = 'afc21e40c7a111e7abc4cec278b6b50a'
var major = '0';
var minor = '0';
var measuredPower = -59;

bleno.on('stateChange', function(state) {
	if (state === 'poweredOn') {
		bleno.startAdvertisingIBeacon(uuid, major, minor, measuredPower, function(error) {
			if(!error) {
				console.log('IBeacon Started');
			} else {
				console.log('Failed to start IBeacon');
			}
		});
	}
});

setInterval(function() {
	console.log('checking');
	request('http://xhub.ddns.net:5555/notifications',  function(err, response, body) {
		var response = JSON.parse(body);
		if(response.notification) {
			play();
		}
	});
}, 3000);

var playerProcess = null;

function play() {
	if(playerProcess) {
		playerProcess.kill();
		playerProcess = null;
	}
	var songs = [
		{ file: 'song1.mp3', name: "Stryv - Storm (Original Mix)" },
		{ file: 'song2.mp3', name: "SmaXa - We're Coming" },
		{ file: 'song3.mp3', name: "Immortal Beats - Oh Wee" },
		{ file: 'song4.mp3', name: "Meizong - Radiation" },
		{ file: 'song5.mp3', name: "Stryv & Aaron Thompson - Ignite" },
	];
	var song = songs[Math.floor(Math.random()*songs.length)];
	console.log(`Playing ${song.name}`);
	playerProcess = exec(`omxplayer ${song.file}`);
	
}
