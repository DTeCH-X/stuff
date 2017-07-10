// ==UserScript==
// @name         MafiaBattle Auto-Collector v2.6.4
// @namespace    https://www.mafiabattle.com
// @icon         https://www.mafiabattle.com/images/favicon/default.png
// @version      2.6.4
// @description  Try to take over the world in MafiaBattle!
// @author       DTeCH
// @match        https://www.mafiabattle.com/partner/iframe/*
// @updateURL    https://cdn.rawgit.com/DTeCH-X/stuff/master/DTMB263.meta.js
// @downloadURL  https://cdn.rawgit.com/DTeCH-X/stuff/master/DTMB263.user.js
// @grant        GM_addStyle
// ==/UserScript==

try {
    (function () {
        // MafiaBattle Tweaks

		GM_addStyle("#dialog_bosses_fight .main .environment .boss .hitarea1 { position: absolute; top: 0px; left: 0px; right: 130px; height: 100%; width: 100%; } #dialog_bosses_fight .main .environment .boss .hitarea2 { position: absolute; top: 190px; left: 0px; right: 95px; height: 100%; width: 100%; } #dialog_bosses_fight .main .environment.carshowroom  #obstacle1, #dialog_bosses_fight .main .environment.carshowroom  #obstacle1+.boss { position: absolute; left: 273px; top: 230px; background: url(/images/bosses/environment_carshowroom _obstacle1.png) center top no-repeat; } #dialog_bosses_fight .main .environment.carshowroom  #obstacle2, #dialog_bosses_fight .main .environment.carshowroom  #obstacle2+.boss { position: absolute; left: 273px; top: 230px; background: url(/images/bosses/environment_carshowroom _obstacle2.png) center top no-repeat; } #dialog_bosses_fight .main .environment.carshowroom  #obstacle3, #dialog_bosses_fight .main .environment.carshowroom  #obstacle3+.boss { position: absolute; left: 273px; top: 230px; background: url(/images/bosses/environment_carshowroom _obstacle3.png) center top no-repeat; }");

        var mainMB = function() {
            // Main Initialization

            var seconds = 0;
            var temp;
            var timeoutMyOswego;
            var timeoutMyOswego2;
            var thirdCollect = 0;

            function MafiaBattle_checkIfLoaded() {
                try {
                    console.log("MafiaBattle: Auto-Collect");
//                    cmd('object:collect',{'type':'gemstonesfactory'});
//                    gemstonesfactory_capacity = 0;
//                    if ($("#dialog_redlight_rooms > div.main > div.roompage.open.page_1 > div.buttons_wide > div:contains('Start working!')")) {
//                        cmd('redlight:work',{'room':'1'});
//                    }
//                    if ($("#dialog_redlight_rooms > div.main > div.roompage.open.page_2 > div.buttons_wide > div:contains('Start working!')")) {
//                        cmd('redlight:work',{'room':'2'});
//                    }
//                    if ($("#dialog_redlight_rooms > div.main > div.roompage.open.page_3 > div.buttons_wide > div:contains('Start working!')")) {
//                        cmd('redlight:work',{'room':'3'});
//                    }
                    cmd('object:collect',{'type':'redlight'});
                    redlight_capacity = 0;
                    if (in_tutorial_step == 10) { tutorial_step(20); }
                    cmd('object:collect',{'type':'moneypress'});
                    moneypress_capacity = 0;
//                    cmd('object:collect',{'type':'ammunitionfactory'});
//                    ammunitionfactory_capacity = 0;
//                    play_sound('collect_ammunition',0.7);
//                    play_sound('collect_cash',0.7);
                    if ((thirdCollect === 0) || (thirdCollect === 1)) {
                        thirdCollect++;
                    } else {
                        cmd('object:collect',{'type':'nightclub'});
                        nightclub_iconity = 0;
                        nightclub_capacity = 0;
                        count_five(1);
                        thirdCollect = 0;
                        console.log("MafiaBattle: Auto-Collect thirdCollect: ", thirdCollect);
                    }
//                    play_sound('collect_cash',0.7);
                    window.setTimeout(MafiaBattle_checkIfLoaded, 540000);
                    seconds = 540;
                    if (!isNaN(timeoutMyOswego)) {
                        clearTimeout(timeoutMyOswego);
                    }
                    document.getElementById('countdown').innerHTML = "09:00";
                    countdown();
                    if (!isNaN(timeoutMyOswego2)) {
                        clearTimeout(timeoutMyOswego2);
                    }
////////                    Jail_Breaker1();
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
                try {
//                    if (document.getElementById("sound_background_theme_1")) {
//                       $("#sound_background_theme_1").remove();
//                       console.log("MafiaBattle: sound_background_theme_1 found, & removed");
//                    }
//                    if (document.getElementById("sound_ambience")) {
//                       $("#sound_ambience").remove();
//                       console.log("MafiaBattle: sound_ambience found, & removed");
//                    }
//                    if (document.getElementById("bg_animated")) {
//                       $("#bg_animated").remove();
//                       console.log("MafiaBattle: bg_animated ID found, & removed");
//                    }
//                    if (document.getElementsByClassName("bg_animated").length > 0) {
//                       $(".bg_animated").remove();
//                       console.log("MafiaBattle: bg_animated found, & removed");
//                    }


//                    if (document.getElementsByClassName("loading_top").length > 0) {
//                       $(".loading_top").remove();
//                       console.log("MafiaBattle: loading_top found, & Ignored"); // removed");
//                    }
                } catch(e) {
                    console.log("MafiaBattle: countdown-audio-imageRemover error: ", e);
                }
                timeoutMyOswego = setTimeout(countdown, 1000);
            }

            function Jail_Breaker1() {
                try {
                    if ($("#jail_jail > div:first")) {
                        var Element1 = $("#jail_jail > div:first").attr( "id" );
                        var tmpDisplayedSelector = "#user_box_";
                        if (typeof Element1 === 'undefined' || Element1 === null || Element1 === "") {
                        } else {
                            var everyJailedPlayer = document.querySelectorAll("#jail_jail div.jailed.user_box");
                            var htmlString = "";
                            var htmlEnabledString = "";
                            var IDs = [];
                            IDs = [];
                            for (var i = 0; i < everyJailedPlayer.length; i++) {
                                htmlString = $("#" + everyJailedPlayer[i].id).html().toString();
                                htmlEnabledString = $("#" + everyJailedPlayer[i].id + ".break_free").hasClass('disabled');
                                console.log("MafiaBattle: Jail_Breaker1 hasClass: ", htmlEnabledString);
                                if((htmlString.indexOf("DTeCH") !== -1) || ($("#" + everyJailedPlayer[i].id + " div.break_free").hasClass('disabled')) || (getTimeLeft($("#" + everyJailedPlayer[i].id + " div.time_left.data_countdown").text()) < 11)){
                                } else {
                                    IDs.push(everyJailedPlayer[i].id.split('_')[2]);
                                }
                            }
                            for (var ii = 0; ii < IDs.length; ii++) {
                                tmpDisplayedSelector = "#user_box_" + IDs[ii] + " .break_free";
//                                console.log("MafiaBattle: Jail_Breaker1 tmpDisplayedSelector: ", tmpDisplayedSelector);
//                                if (!$(tmpDisplayedSelector).is(":visible") ){
                                    if(!$(tmpDisplayedSelector).hasClass('disabled')) {
                                        cmd('jail:breakfree',{'user':IDs[ii]},true);
                                        close_dialog('notification');
                                    }
//                                }
                            }
                        }
                    }
                } catch(e) {
                    console.log("MafiaBattle: Jail_Breaker1 error: ", e);
                }
                timeoutMyOswego2 = setTimeout(Jail_Breaker1, 50);
//                try {
//                } catch(ee) {
//                    console.log("MafiaBattle: Jail_Breaker1 close_dialog error: ", ee);
//                }
            }

            function getTimeLeft(strTime) {
                var newTime = strTime.replace("S", "");
                newTime = strTime.replace("s", "");
                newTime = strTime.replace("M", "");
                newTime = strTime.replace("m", "");
                newTime = strTime.replace(" ", "");
                newTime = strTime.replace(/(?:\\[rn]|[\r\n]+)+/g, "");
                return Number(newTime);
            }

            function breakOutNow(item) {
				var target1 = item.split('_');
				cmd('jail:breakfree',{'user':target1[2]},true);
				close_dialog('notification');
                console.log("MafiaBattle: Jail_Breaker1 Element1: ", item);
                console.log("MafiaBattle: Jail_Breaker1");
                console.log("MafiaBattle: Jail_Breaker1 target1: ", target1);
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
            timerDiv.innerHTML = "09:00";
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
