// ==UserScript==
// @name         MafiaBattle Auto-Collector
// @namespace    https://www.mafiabattle.com
// @icon         https://www.mafiabattle.com/images/favicon/default.png
// @version      1.9.9
// @description  Try to take over the world in MafiaBattle!
// @author       DTeCH
// @match        https://www.mafiabattle.com/partner/iframe/*
// @updateURL    https://cdn.rawgit.com/DTeCH-X/stuff/master/DTMB199.meta.js
// @downloadURL  https://cdn.rawgit.com/DTeCH-X/stuff/master/DTMB199.user.js
// @grant        none
// ==/UserScript==

try {
    (function () {
        // MafiaBattle Tweaks
        var mainMB = function() {
            // Main Initialization

            var seconds = 0;
            var temp;
            var timeoutMyOswego;

            function MafiaBattle_checkIfLoaded() {
                try {
                    console.log("MafiaBattle: Auto-Collect");
                    cmd('object:collect',{'type':'gemstonesfactory'});
                    gemstonesfactory_capacity = 0;
                    cmd('object:collect',{'type':'redlight'});
                    redlight_capacity = 0;
                    if (in_tutorial_step == 10) { tutorial_step(20); }
                    cmd('object:collect',{'type':'moneypress'});
                    moneypress_capacity = 0;
                    cmd('object:collect',{'type':'ammunitionfactory'});
                    ammunitionfactory_capacity = 0;
                    play_sound('collect_ammunition',0.7);
                    play_sound('collect_cash',0.7);
                    window.setTimeout(MafiaBattle_checkIfLoaded, 300000);
                    seconds = 300;
                    if (!isNaN(timeoutMyOswego)) {
                        clearTimeout(timeoutMyOswego);
                    }
                    document.getElementById('countdown').innerHTML = "05:00";
                    countdown();
                } catch (e) {
                    console.log("MafiaBattle_checkIfLoaded: ", e);
                    window.setTimeout(MafiaBattle_checkIfLoaded, 5000);
                }
            }

            if (/mafiabattle\.com/i.test(document.domain)) {
                window.setTimeout(MafiaBattle_checkIfLoaded, 5000);
            }

            function countdown() {
                var time = document.getElementById('countdown').innerHTML;
                var timeArray = time.split(':');
                seconds = timeToSeconds(timeArray);
                if (isNaN(seconds)) {
                    temp = document.getElementById('countdown');
                    temp.innerHTML = "00:00";
                    return;
                }
                seconds--;
                temp = document.getElementById('countdown');
                temp.innerHTML = secondsToTime(seconds);
                timeoutMyOswego = setTimeout(countdown, 1000);
            }

            function timeToSeconds(timeArray) {
                var seconds = (timeArray[0] * 60) + (timeArray[1] * 1); // (Minutes * 60) + (Seconds * 1)
                return seconds;
            }

            function secondsToTime(secs) {
                var divisor_for_minutes = secs % (60 * 60);
                var minutes = Math.floor(divisor_for_minutes / 60);
                minutes = minutes < 10 ? '0' + minutes : minutes;
                var divisor_for_seconds = divisor_for_minutes % 60;
                var seconds = Math.ceil(divisor_for_seconds);
                seconds = seconds < 10 ? '0' + seconds : seconds;
                return minutes + ':' + seconds;
            }
        };

        try {
            var timerDiv = document.createElement("div");
            timerDiv.setAttribute("id", "countdown");
            timerDiv.setAttribute("class", "rightstats");
            timerDiv.innerHTML = "05:00";
            timerDiv.setAttribute('style','font-weight: bold; font-size: 30px; color:floralwhite; position: absolute; top:151px; right:32px;');
            var scriptAMO0 = document.createElement("script");
            scriptAMO0.innerHTML = "(" + mainMB.toString() + ")();";
            scriptAMO0.type = "text/javascript";
            if (/mafiabattle\.com/i.test(document.domain)) {
                document.getElementsByTagName("body")[0].appendChild(timerDiv);
                document.getElementsByTagName("head")[0].appendChild(scriptAMO0);
            }
        }
        catch (e) {
            console.log("MafiaBattle init error: ", e);
        }
    })();
} catch (e) {
    console.log("MafiaBattle Pack: ", e);
}
