var request = require('hyperquest');
var cheerio = require('cheerio');
var color = require('colorful');
var moment = require('moment');

var BASE_URL = 'http://www.jadwalsholat.org/adzan/ajax/ajax.daily1.php';
var DEFAULT = 308; // bandung
var SHOLAT = ['Shubuh', 'Dzuhur', 'Ashr', 'Maghrib', 'Isya'];

function parse(html) {
  var $ = cheerio.load(html);
  var currentIndex = -1;
  $('td').each(function(){
    var val = $(this).text();
    var idx = SHOLAT.indexOf(val);
    if (currentIndex >= 0) {
      var arr = val.split(':')
      var schedule = moment().hour(arr[0]).minute(arr[1]);
      var dh = schedule.diff(moment(), 'hour');
      var dm = schedule.diff(moment(), 'minute');
      var c = (dh == 0) ? 'red' : 'gray';
      var n = (dh == 0) ? 'green' : 'gray';
      if (dh >= 0)
        console.log(color[n](SHOLAT[currentIndex]), 
          color[c]('in ' + schedule.fromNow(dh == 0 ? 'm': 'h')), 
          dh == 0 ? color.magenta('<-') : '', 
          dh > 0 ? val : '');
      currentIndex = -1;
    }
    if (idx >= 0) {
      currentIndex = idx;
    }
  });
}

module.exports = function () {
  var r = request(BASE_URL + '?id=' + DEFAULT);
  var body = '';
  r.on('data', function(chunk){
    body += chunk;
  });
  r.on('end', function(){
    parse(body);
  });
}
