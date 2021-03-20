// @author         jonatkins
// @name           Scoring cycle / checkpoint times
// @category       Info
// @version        0.1.0
// @description    Show the times used for the septicycle and checkpoints for regional scoreboards.


// use own namespace for plugin
var scoreCycleTimes = {};
window.plugin.scoreCycleTimes = scoreCycleTimes;

scoreCycleTimes.CHECKPOINT = 5*60*60; // 5 hours per checkpoint
scoreCycleTimes.CYCLE = 7*25*60*60;   // 7 25 hour 'days' per cycle
scoreCycleTimes.locale = navigator.languages;
scoreCycleTimes.dateTimeFormat = {
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit'
};

scoreCycleTimes.update = function () {
  // checkpoint and cycle start times are based on a simple modulus of the timestamp
  // no special epoch (other than the unix timestamp/javascript's 1970-01-01 00:00 UTC) is required

  // when regional scoreboards were introduced, the first cycle would have started at 2014-01-15 10:00 UTC - but it was
  // a few checkpoints in when scores were first added

  var now = new Date().getTime();

  var cycleStart = Math.floor(now / (window.plugin.scoreCycleTimes.CYCLE*1000)) * (window.plugin.scoreCycleTimes.CYCLE*1000);
  var cycleEnd = cycleStart + window.plugin.scoreCycleTimes.CYCLE*1000;

  var checkpointStart = Math.floor(now / (window.plugin.scoreCycleTimes.CHECKPOINT*1000)) * (window.plugin.scoreCycleTimes.CHECKPOINT*1000);
  var checkpointEnd = checkpointStart + window.plugin.scoreCycleTimes.CHECKPOINT*1000;

  var o = new Intl.DateTimeFormat(scoreCycleTimes.locale, scoreCycleTimes.dateTimeFormat);

  function formatRow (label, time) {
    var dateTime = o.format(new Date(time));
    return '<tr><td>'+label+'</td><td>'+dateTime+'</td></tr>';
  }

  var html = '<table>'
    + formatRow('Cycle start', cycleStart)
    + formatRow('Previous checkpoint', checkpointStart)
    + formatRow('Next checkpoint', checkpointEnd)
    + formatRow('Cycle end', cycleEnd)
    + '</table>';

  $('#score_cycle_times_display').html(html);

  setTimeout(scoreCycleTimes.update, checkpointEnd-now);
};

function setup () {
  $('#sidebar').append('<div id="score_cycle_times_display"></div>');
  $('#score_cycle_times_display').css({color: '#ffce00'});

  scoreCycleTimes.update();
}
