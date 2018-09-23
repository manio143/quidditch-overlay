function elem(id) { return document.getElementById(id); }

function snitchMap(b) { if(b) return "*"; else return "°"; }

function update() {
    $.get('/data', function(strData) {
         let data = JSON.parse(strData);
         let namelength = Math.max(data.teamAname.length, data.teamBname.length);
         elem("team-a-title").innerText = data.teamAname.padStart(namelength, " ");
         elem("team-a-title").className = "ui button name " + data.teamAcolor;
         elem("team-b-title").innerText = data.teamBname.padStart(namelength, " ");
         elem("team-b-title").className = "ui button name " + data.teamBcolor;
         elem("game-time").innerText = (new String(Math.floor(data.gameTime / 60))).padStart(2, '0') + " : " + (new String(data.gameTime % 60)).padStart(2, '0');
        elem("team-a-score").innerText = data.teamAscore;
        elem("team-a-snitches").innerText = data.teamAsnitches.map(snitchMap);
        elem("team-b-score").innerText = data.teamBscore;
        elem("team-b-snitches").innerText = data.teamBsnitches.map(snitchMap);
    });
}

$(document).ready(function() {
    setInterval(update, 300);
});
