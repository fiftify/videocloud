document.addEventListener('DOMContentLoaded', init, false);

var host = "https://learn-shell-lockround.c9users.io";

/** 
* You can manipulate the video here
* For example: Uncomment the code below and in the index to get a Start/Stop button
*/
function init() {
  const VP = document.getElementById('videoPlayer')
  const VPToggle = document.getElementById('toggleButton')
  
  VPToggle.addEventListener('click', function() {
    if (VP.paused) VP.play()
    else VP.pause()
  })
  
  var courseSelect = document.createElement('select');
  courseSelect.innerHTML = "<option>--select--</option><option>js-ess</option><option>js-asyn</option>"
  document.getElementById("videos").appendChild(courseSelect);
  
  
  courseSelect.addEventListener('change', ev => {
        var course = ev.target.value;
        fetch(`${host}/js/${course}`).then(resp => resp.json())
        .then(data => {
    
        var select = document.createElement('select');
        var files = data.files;
        var options = files.reduce((acc,currfile) => {
          return acc+`<option>${currfile}</option>`
        },'');
        select.innerHTML = options;
        document.getElementById("videos").appendChild(select);
        var s = document.getElementsByTagName('select')[1];
          s.addEventListener('change', e => {
          var player = document.getElementById('videoPlayer');
          player.setAttribute('poster','');
          player.innerHTML = `<source src="${host}/js/${course}/${encodeURIComponent(e.target.value)}" type="video/mp4">`
        });  
    
    });
    
  })
  
  
}
