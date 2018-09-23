var elemMap = {};
function elem(id) { 
     if(elemMap[id] == undefined) 
         elemMap[id] = document.getElementById(id);
     return elemMap[id];
}

function snitchMap(b) { if(b) return "*"; else return "°"; }

function update(event) {
    let data = JSON.parse(event.data);
    switch(data.type) {
      case "teamSetup":
         let namelength = Math.max(data.teamAname.length, data.teamBname.length);
         elem("team-a-title").innerText = data.teamAname;
         elem("team-a-title").className = "ui button " + data.teamAcolor;
         elem("team-a-title").style.width = namelength * 15 + "px";
         elem("team-b-title").innerText = data.teamBname;
         elem("team-b-title").className = "ui button " + data.teamBcolor;
         elem("team-b-title").style.width = namelength * 15 + "px";
         break;
      case "time":
         elem("game-time").innerText = data.gameTime;
         break;
      case "score":
        elem("team-a-score").innerText = data.teamAscore;
        elem("team-a-snitches").innerText = data.teamAsnitches.map(snitchMap);
        elem("team-b-score").innerText = data.teamBscore;
        elem("team-b-snitches").innerText = data.teamBsnitches.map(snitchMap);
        break;
      case "period":
        switch(data.period) {
          case 1:
            elem("overtime").style.display = "none";
            elem("sndovertime").style.display = "none";
            break;
          case 2:
            elem("overtime").style.display = "initial";
            elem("sndovertime").style.display = "none";
            break;
          case 3:
            elem("overtime").style.display = "none";
            elem("sndovertime").style.display = "initial";
            break;
        }
    }
}

var socket = null;

$(document).ready(function() {
    socket = new WebSocket("ws://localhost:8080/socket");
    socket.onopen = function() {
      socket.send("ready");
    };
    socket.onmessage = update;
});
