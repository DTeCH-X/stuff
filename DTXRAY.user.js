// ==UserScript==
// @version       2.1.1i
// @name          TA X-Ray Player Offence Link Button - (DTeCH)
// @namespace     TAXRay
// @icon          http://eistee82.github.io/ta_simv2/icon.png
// @description   Creates a "X-Ray" button when selecting a base in Command & Conquer: Tiberium Alliances. The share button takes you to http://cncopt.com/ and fills in the selected base information so you can analyze or share the base.
// @include       http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @include       http*://*.cncopt.com/*
// @include       http*://cncopt.com/*
// @grant         GM_log
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @grant         GM_xmlhttpRequest
// @grant         GM_updatingEnabled
// @grant         unsafeWindow
// @contributor   PythEch (http://userscripts-mirror.org/users/220246)
// @contributor   jerbri (http://userscripts-mirror.org/users/507954)
// @contributor   DTeCH, Der_Flake
// @updateURL     https://cdn.rawgit.com/DTeCH-X/stuff/master/DTXRAY.meta.js
// @downloadURL   https://cdn.rawgit.com/DTeCH-X/stuff/master/DTXRAY.user.js
// ==/UserScript==

eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('1r{(S(){A 4I=S(){A 2N=Y;A 2E=Y;A 4G=Y;A 4C={4A:"w",4z:"c",\'4y 2j\':"t",4x:"b",4v:"m",4u:"f",\'1s 2i\':"r",\'1s 2g\':"e",\'1s 1d\':"a",\'4t 2e\':"g",\'4s 2d\':"q",4r:"p",4q:"d",4p:"s",\'4o 29\':"z",\'4n 2j\':"t",\'1l 2g\':"e",\'1l 2i\':"r",\'1l 1d\':"a",\'4i 26\':"p",4h:"b",\'4f 24\':"z",4e:"c",4d:"s",4c:"f",\'4b 49\':"m",\'48 1U 1T\':"q",47:"g",\'46 1d\':"d",45:"w",44:"w",43:"b",40:"t",3X:"g",3V:"r",3U:"q",3T:"n",3S:"y",3R:"o",3Q:"s",3M:"u",3L:"m",2P:"a",3J:"v",3H:"d",3G:"f",3F:"e",\'\':""};A 3E={\'3D 2e\':"g",3C:"c",3B:"f",3A:"j",3z:"k",3y:"m",\'3x 2d\':"q",3w:"o",3v:"a",3u:"p",3t:"d",3s:"r",\'3r 3o\':"s",\'3n 29\':"z",\'3m 26\':"b",3l:"a",\'3k 24\':"z",3j:"r",3i:"c",3h:"s",\'3g 1U 1T\':"q",3f:"m",3e:"k",3c:"l",\'3b 1d\':"o",\'3a 39\':"p",36:"v",35:"t",\'\':""};S 33(B){J(A k H B){C(T B[k]=="11"&&B[k]&&0 H B[k]&&8 H B[k]){C(T B[k][0]=="11"&&B[k][0]&&B[k][0]&&0 H B[k][0]&&15 H B[k][0]){C(T B[k][0][0]=="11"&&B[k][0][0]&&"1E"H B[k][0][0]){12 B[k]}}}}12 Y}S 32(B){A 10=B.7O();J(A k H 10){C(21>=22){C(T 10[k]==="11"&&10[k]&&"d"H 10[k]&&"c"H 10[k]&&10[k].c>0){12 10[k].d}}O{C(T 10[k]==="11"&&10[k]&&"l"H 10[k]){12 10[k].l}}}}S 31(1q){12 1q.1b().n H 3E}S 30(1q){12 1q.1b().n H 4C}S 2s(B){A 27=[];J(A k H B){C(T B[k]=="11"&&B[k]){J(A 19 H B[k]){C(21>=22){C(T B[k][19]=="11"&&B[k][19]&&"d"H B[k][19]){A 1a=B[k][19].d;C(T 1a=="11"&&1a){J(A i H 1a){C(T 1a[i]=="11"&&1a[i]&&"1J"H 1a[i]){27.1g(1a)}}}}}O{C(T B[k][19]=="11"&&B[k][19]&&"l"H B[k][19]){A 1c=B[k][19].l;C(T 1c=="11"&&1c){J(A 1u H 1c){C(T 1c[1u]=="11"&&1c[1u]&&"1J"H 1c[1u]){27.1g(1c)}}}}}}}}12 27}S 2Z(B){A 13=2s(B);J(A i=0;i<13.1K;++i){J(A j H 13[i]){C(30(13[i][j])){12 13[i]}}}12[]}S 2B(2W){A 13=2s(2W);J(A i=0;i<13.1K;++i){J(A j H 13[i]){C(31(13[i][j])){12 13[i]}}}12[]}S 2T(){M.P("Q-X 7S 2S v"+1n.5c+" 7P");A W={R:Y,1k:{4M:"a",5M:"r",\'7M 2m\':"u",8l:"s",\'8u 3K\':"p",\'4R 2K\':"y",7G:"d",7H:"b",7L:"f",\'2R 2I\':"q",\'2R 2H\':"w",\'7T 2m\':"e",7U:"z",8i:"x",8n:"i",8q:"s",8r:"r",\'8s 2U\':"b",\'8x 2U\':"v",\'4K 2m\':"u",\'2V 2H\':"w",\'4P 2K\':"y",4Q:"h",\'2V 2I\':"q",4T:"n",4U:"r",\'57 3K\':"p",58:"h",\'59 2K\':"y",5a:"d",\'5b 2m\':"u",\'2X 2I\':"q",5d:"b",5e:"s",5f:"f",5g:"n",\'5j 5k\':"e",5l:"z",5m:"i",5q:"a",7E:"x",\'2X 2H\':"w",4A:"w",4z:"c",\'4y 2j\':"t",4x:"b",4v:"m",4u:"f",\'1s 2i\':"r",\'1s 2g\':"e",\'1s 1d\':"a",\'4t 2e\':"g",\'4s 2d\':"q",4r:"p",4q:"d",4p:"s",\'4o 29\':"z",\'4n 2j\':"t",\'1l 2g\':"e",\'1l 2i\':"r",\'1l 1d\':"a",\'4i 26\':"p",4h:"b",\'4f 24\':"z",4e:"c",4d:"s",4c:"f",\'4b 49\':"m",\'48 1U 1T\':"q",47:"g",\'46 1d\':"d",45:"w",44:"w",43:"b",40:"t",3X:"g",3V:"r",3U:"q",3T:"n",3S:"y",3R:"o",3Q:"s",3M:"u",3L:"m",2P:"a",3J:"v",3H:"d",3G:"f",3F:"e",\'3D 2e\':"g",3C:"c",3B:"f",3A:"j",3z:"k",3y:"m",\'3x 2d\':"q",3w:"o",3v:"a",3u:"p",3t:"d",3s:"r",\'3r 3o\':"s",\'3n 29\':"z",\'3m 26\':"b",3l:"a",\'3k 24\':"z",3j:"r",3i:"c",3h:"s",\'3g 1U 1T\':"q",3f:"m",3e:"k",3c:"l",\'3b 1d\':"o",\'3a 39\':"p",36:"v",35:"t",\'<7F>\':"."},2Y:S(){1r{A R=W.R;A 2f=R.2r();A B=V.1H.1F.1D().2v().34(2f);A 1o=V.1H.1F.1D().2v().8e();A 18=V.1H.1F.1D().8k();A 37=V.1H.1F.1D().8m();A 38=B.1j()>2?1o.1j():B.1j();A 2h=B.1j()>2?1o:B;4G=R;2E=B;2N=1o;M.P("Q-X 8t 23: ",B);M.P("Q-X 3d 23: ",1o);M.P("Q-X 2h 23: ",2h);A D="4L://W.2J/?4N=";D+="3|";1B(B.1j()){I 1:D+="G|";L;I 2:D+="N|";L;I 3:I 4:I 5:I 6:D+="F|";L;1y:M.P("Q-X: 3p 3q: "+B.1j());D+="E|";L}1B(38){I 1:D+="G|";L;I 2:D+="N|";L;I 3:I 4:I 5:I 6:D+="F|";L;1y:M.P("Q-X: 3p 3q: "+1o.1j());D+="E|";L}D+=B.5h()+"|";A 1x=[];J(A 2w=0;2w<20;++2w){A 2u=[];J(A 2t=0;2t<9;++2t){2u.1g(Y)}1x.1g(2u)}A 1C=2Z(B);C(21>=22){J(A 1u H 1C){A 1Y=1C[1u];1x[1Y.1X()][1Y.1M()+8]=1Y}}O{J(A 1V=0;1V<1C.1K;++1V){A 1Z=1C[1V];1x[1Z.1X()][1Z.1M()+8]=1Z}}A 1z=[];J(A 2C=0;2C<20;++2C){A 2A=[];J(A 2z=0;2z<9;++2z){2A.1g(Y)}1z.1g(2A)}A 1A=2B(2h);M.P("Q-X 7V 8c 8d: ",2B(B));C(21>=22){J(A 3I H 1A){A 1W=1A[3I];1z[1W.1X()][1W.1M()+16]=1W}}O{J(A 2b=0;2b<1A.1K;++2b){A 1L=1A[2b];1z[1L.1X()][1L.1M()+16]=1L}}A 3N=33(B);A 3O=32(B);A 3P=[];J(A 17=0;17<20;++17){3P=[];J(A j=0;j<9;++j){A 1v=17>16?Y:3N[j][17];A 1t=0;A 1i=Y;C(1v&&1v.1E>=0){1i=3O[1v.1E];1t=1i.1J()}A 1e=1x[j][17];C(1e){1t=1e.1J()}A 1h=1z[j][17];C(1h){1t=1h.1J()}C(1t>1){D+=1t}1B(17>16?0:B.3W(j,17)){I 0:C(1i){A 1N=1i.4O();C(3Y.3Z[1N].n H W.1k){D+=W.1k[3Y.3Z[1N].n]}O{M.P("Q-X [5]: 1O 1i: "+1N,1i);D+="."}}O C(1e){C(1e.1b().n H W.1k){D+=W.1k[1e.1b().n]}O{M.P("Q-X [5]: 1O 1q: "+1e.1b().n);D+="."}}O C(1h){C(1h.1b().n H W.1k){D+=W.1k[1h.1b().n]}O{M.P("Q-X [5]: 1O 1q: "+1h.1b().n);D+="."}}O{D+="."}L;I 1:C(1v.1E<0){D+="c"}O{D+="n"}L;I 2:C(1v.1E<0){D+="t"}O{D+="h"}L;I 4:D+="j";L;I 5:D+="h";L;I 6:D+="l";L;I 7:D+="k";L;1y:M.P("Q-X [4]: 1O 4S 41: "+B.3W(j,17));D+=".";L}}}C(18&&2N.42()==2E.42()){D+="|"+18.4V();D+="|"+18.4W();D+="|"+18.4X();D+="|"+18.4Y();D+="|"+18.4Z();D+="|"+18.51();D+="|"+18.52()}C(37.53()!=1.2){D+="|54"}1n.55(D,"56")}1m(e){M.P("Q-X [1]: ",e)}}};C(!1P.1Q.1R.1S.2p.2q){1P.1Q.1R.1S.2p.2q=1P.1Q.1R.1S.2p.4a}A 1G=0;A 1I=Y;A 2M=5i;1P.1Q.1R.1S.2p.4a=S(R){1r{A 2L=14;W.R=R;C(14.4g!=1){14.4g=1;14.25=[];J(A i H 14){1r{C(14[i]&&14[i].5n=="5o"){A D=5p 28.5r.5s.2S("X-5t","5u:5v/5w;5x,5y+5z/5A+5B/5C/5D/5E/5F/5G+5H/5I+5J/5K+5L+4J/5N/5O/5P/5Q/+5R/5S/5T/5U+5V/5W+5X+5Y/5Z/60/61/62+63/64/65/66/67+68+69+6a/6b/6c+6d+6e+6f/6g+6h+6i+6j+6k/6l/6m+6n+6o+6p/6q+6r/6s/6t+6u+6v+6w/6x+6y+6z+6A+6B/6C/6D/6E+6F/6G+6H+6I/6J+6K/6L/6M/6N+6O/6P+6Q+6R+6S+6T/6U/6V+6W/6X+6Y/6Z/70+71+72++73/Z/74/m/75+x+76/77+78+79+7a/7b/7c//7d+7e+7f+7g/7h+7i/7j/7k/7l+7m/7n+7o+7p+7q+7r/7s/7t+7u+7v/7w+7x+7y/7z+K+7A+7B=");D.7C("7D",S(){A 4j=28.4k.4l.4m();4j.7I().7J();W.2Y()});14[i].7K(D);14.25.1g(D)}}1m(e){M.P("Q-X [2]: ",e)}}}A U=1p;1B(R.7N()){I V.1f.2a.2c.7Q:1B(R.7R()){I V.1f.2G.2D.2y.3d:U=1w;L;I V.1f.2G.2D.2y.7W:I V.1f.2G.2D.2y.7X:U=1w;L;1y:}L;I V.1f.2a.2c.7Y:U=1p;M.P("Q-X: 7Z 23 80.. 81 82 83 84\'t 85 86 87 88 89");L;I V.1f.2a.2c.8a:U=1w;L;I V.1f.2a.2c.8b:U=1w;L;1y:}A 4w=U;S 2F(){1r{U=4w;A R=W.R;A 2x=1p;C(1I!=Y){8f(1I)}C(R&&R.2r){A 2f=R.2r();A B=V.1H.1F.1D().2v().34(2f);C(!B||B.8g()==0){2x=1w;U=1p}}O{U=1p}C(U!=2M){2M=U;J(A i=0;i<2L.25.1K;++i){2L.25[i].8h(U)}}C(!2x){1G=0}O{C(1G>0){1G--;1I=2k(2F,8j)}O{1I=Y}}}1m(e){M.P("Q-X [3]: ",e);U=1p}}1G=50;2F()}1m(e){M.P("Q-X [3]: ",e)}14.2q(R)}}S 2l(){1r{C(T 28!="4B"){A a=28.4k.4l.4m();C(a){2T()}O{1n.2k(2l,2O)}}O{1n.2k(2l,2O)}}1m(e){C(T M!="4B"){M.P(e)}O C(1n.4D){4D.8o(e)}O{8p(e)}}}C(/4E\\.2J/i.4F(2n.4H)){1n.2k(2l,2O)}};A 2o=2n.8v("8w");A 2Q=4I.8y();2o.8z="("+2Q+")();";2o.41="8A/8B";C(/4E\\.2J/i.4F(2n.4H)){2n.8C("8D")[0].8E(2o)}})()}1m(e){M.P("8F 8G 8H-8I 8J: ",e)}',62,542,'||||||||||||||||||||||||||||||||||||var|city|if|link||||in|case|for||break|console||else|log|CNCOpt|selected_base|function|typeof|tf|ClientLib|cncopt||null||cityBuildings|object|return|arr|this|||i6|alliance|k2|lst1|get_UnitGameData_Obj|lst2|Tank|defense_unit|Vis|push|offense_unit|building|get_CityFaction|keymap|NOD_Def_Art|catch|window|own_city|false|unit|try|GDI_Art|level|i2|spot|true|defense_units|default|offense_units|offense_unit_list|switch|defense_unit_list|GetInstance|BuildingIndex|MainData|check_ct|Data|check_timer|get_CurrentLevel|length|unit5|get_CoordY|techId|Unhandled|webfrontend|gui|region|RegionCityMenu|Soldiers|Rocket|i3|unit3|get_CoordX|unit1|unit2||PerforceChangelist|376877|City|Hand|__cncopt_links|Bike|ret|qx|Trooper|VisObject|i5|EObjectType|Squad|Guardian|city_id|Air|doCity|Inf|Barrier|setTimeout|cnc_check_if_loaded|Center|document|script_block|prototype|__cncopt_real_showMenu|get_Id|getUnitArrays|j2|col|get_Cities|i1|still_loading|ERegionCityType|j3|col2|getOffenseUnits|i4|RegionCity|tcity|check_if_button_should_be_enabled|Region|Facility|HQ|com|Yard|self|button_enabled|scity|1000|FOR_Turret_VS_Inf_ranged|txt|GDI_Defense|Button|cncopt_create|Booster|FOR_Defense|xCity|NOD_Defense|make_sharelink|getDefenseUnits|isDefenseUnit|isOffenseUnit|findBuildings|findTechLayout|GetCity|NOD_Vertigo|NOD_Venom|server|doLinkCity|Artilery|NOD_Specter|NOD_Scorpion|NOD_Salamander|Own|NOD_Reckoner|NOD_Militants|NOD_Militant|NOD_Confessor|NOD_Commando|NOD_Cobra|NOD_Black|NOD_Avatar|NOD_Attack|GDI_Zone|Team|Unknown|faction|GDI_Sniper|GDI_Riflemen|GDI_Predator|GDI_Pitbull|GDI_Paladin|GDI_Orca|GDI_Missile|GDI_Mammoth|GDI_Kodiak|GDI_Juggernaut|GDI_Firehawk|GDI_Commando|GDI_APC|offense_unit_map|FOR_Turret_VS_Air_ranged|FOR_Turret_VS_Air|FOR_Turret_VS_Veh_ranged|i8|FOR_Turret_VS_Veh|Plant|FOR_Turret_VS_Inf|FOR_Veh_VS_Air|techLayout|buildings|row|FOR_Veh_VS_Veh|FOR_Veh_VS_Inf|FOR_Mammoth|FOR_Sniper|FOR_Inf_VS_Air|FOR_Inf_VS_Veh|GetResourceType|FOR_Inf_VS_Inf|GAMEDATA|Tech|FOR_Barrier_VS_Veh|type|get_AllianceId|FOR_Barbwire_VS_Inf|FOR_Wall|NOD_Def_Wall|NOD_Def_Scorpion|NOD_Def_Reckoner|NOD_Def_Militant|Nest|showMenu|NOD_Def_MG|NOD_Def_Flak|NOD_Def_Confessor|NOD_Def_Cannon|NOD_Def_Black|__cncopt_initialized|NOD_Def_Barbwire|NOD_Def_Attack|bt|core|Init|getApplication|NOD_Def_Antitank|GDI_Def_Zone|GDI_Def_Sniper|GDI_Def_Predator|GDI_Def_Pitbull|GDI_Def_Missile|GDI_Def_APC|GDI_Flak|GDI_Turret|orig_tf|GDI_Barbwire|GDI_Antitank|GDI_Cannon|GDI_Wall|undefined|defense_unit_map|opera|commandandconquer|test|tbase|domain|cncopt_main|lVUAtG0GQOXhrE|FOR_Trade|http|GDI_Accumulator|map|get_MdbBuildingId|FOR_Construction|FOR_Harvester_Tiberium|GDI_Construction|resource|FOR_Harvester_Crystal|NOD_Refinery|get_POITiberiumBonus|get_POICrystalBonus|get_POIPowerBonus|get_POIInfantryBonus|get_POIVehicleBonus||get_POIAirBonus|get_POIDefenseBonus|get_TechLevelUpgradeFactorBonusAmount|newEconomy|open|_blank|NOD_Power|NOD_Harvester|NOD_Construction|NOD_Airport|NOD_Trade|__cncopt_version|NOD_Barracks|NOD_Silo|NOD_Factory|NOD_Harvester_Crystal|get_Name|123456|NOD_Command|Post|NOD_Support_Art|NOD_Support_Ion|basename|Composite|new|NOD_Accumulator|ui|form|Ray|data|image|png|base64|iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAKQWlDQ1BJQ0MgUHJvZmlsZQAASA2dlndUU9kWh8|9N73QEiIgJfQaegkg0jtIFQRRiUmAUAKGhCZ2RAVGFBEpVmRUwAFHhyJjRRQLg4Ji1wnyEFDGwVFEReXdjGsJ7601896a|cdZ39nnt9fZZ|9917oAUPyCBMJ0WAGANKFYFO7rwVwSE8vE9wIYEAEOWAHA4WZmBEf4RALU|L09mZmoSMaz9u4ugGS72yy|UCZz1v9|kSI3QyQGAApF1TY8fiYX5QKUU7PFGTL|BMr0lSkyhjEyFqEJoqwi48SvbPan5iu7yZiXJuShGlnOGbw0noy7UN6aJeGjjAShXJgl4GejfAdlvVRJmgDl9yjT0|icTAAwFJlfzOcmoWyJMkUUGe6J8gIACJTEObxyDov5OWieAHimZ|SKBIlJYqYR15hp5ejIZvrxs1P5YjErlMNN4Yh4TM|0tAyOMBeAr2|WRQElWW2ZaJHtrRzt7VnW5mj5v9nfHn5T|T3IevtV8Sbsz55BjJ5Z32zsrC|9FgD2JFqbHbO|GDI_Refinery|vIADyBQC03pzzHoZsXpLE4gwnC4vs7GxzAZ9rLivoN|ufgm|Kv4Y595nL7vtWO6YXP4EjSRUzZUXlpqemS0TMzAwOl89k|fcQ|PAOWnNycMsnJ|AF|GF6FVR6JQJhIlou4U8gViQLmQKhH|V4X8YNicHGX6daxRodV8AfYU5ULhJB8hvPQBDIwMkbj96An3rWxAxCsi|vGitka9zjzJ6|uf6Hwtcim7hTEEiU|b2DI9kciWiLBmj34RswQISkAd0oAo0gS4wAixgDRyAM3AD3iAAhIBIEAOWAy5IAmlABLJBPtgACkEx2AF2g2pwANSBetAEToI2cAZcBFfADXALDIBHQAqGwUswAd6BaQiC8BAVokGqkBakD5lC1hAbWgh5Q0FQOBQDxUOJkBCSQPnQJqgYKoOqoUNQPfQjdBq6CF2D|qAH0CA0Bv0BfYQRmALTYQ3YALaA2bA7HAhHwsvgRHgVnAcXwNvhSrgWPg63whfhG|AALIVfwpMIQMgIA9FGWAgb8URCkFgkAREha5EipAKpRZqQDqQbuY1IkXHkAwaHoWGYGBbGGeOHWYzhYlZh1mJKMNWYY5hWTBfmNmYQM4H5gqVi1bGmWCesP3YJNhGbjS3EVmCPYFuwl7ED2GHsOxwOx8AZ4hxwfrgYXDJuNa4Etw|XjLuA68MN4SbxeLwq3hTvgg|Bc|BifCG|Cn8cfx7fjx|GvyeQCVoEa4IPIZYgJGwkVBAaCOcI|YQRwjRRgahPdCKGEHnEXGIpsY7YQbxJHCZOkxRJhiQXUiQpmbSBVElqIl0mPSa9IZPJOmRHchhZQF5PriSfIF8lD5I|UJQoJhRPShxFQtlOOUq5QHlAeUOlUg2obtRYqpi6nVpPvUR9Sn0vR5Mzl|OX48mtk6uRa5Xrl3slT5TXl3eXXy6fJ18hf0r|pvy4AlHBQMFTgaOwVqFG4bTCPYVJRZqilWKIYppiiWKD4jXFUSW8koGStxJPqUDpsNIlpSEaQtOledK4tE20Otpl2jAdRzek|9OT6cX0H|i99AllJWVb5SjlHOUa5bPKUgbCMGD4M1IZpYyTjLuMj|M05rnP48|bNq9pXv|8KZX5Km4qfJUilWaVAZWPqkxVb9UU1Z2qbapP1DBqJmphatlq|9Uuq43Pp893ns|dXzT|5PyH6rC6iXq4|mr1w|o96pMamhq|GhkaVRqXNMY1GZpumsma5ZrnNMe0aFoLtQRa5VrntV4wlZnuzFRmJbOLOaGtru2nLdE|pN2rPa1jqLNYZ6NOs84TXZIuWzdBt1y3U3dCT0svWC9fr1HvoT5Rn62fpL9Hv1t|ysDQINpgi0GbwaihiqG|YZ5ho|FjI6qRq9Eqo1qjO8Y4Y7ZxivE|41smsImdSZJJjclNU9jU3lRgus|0zwxr5mgmNKs1u8eisNxZWaxG1qA5wzzIfKN5m|krCz2LWIudFt0WXyztLFMt6ywfWSlZBVhttOqw|sPaxJprXWN9x4Zq42Ozzqbd5rWtqS3fdr|tfTuaXbDdFrtOu8|2DvYi|yb7MQc9h3iHvQ732HR2KLuEfdUR6|jhuM7xjOMHJ3snsdNJp9|dWc4pzg3OowsMF|AX1C0YctFx4bgccpEuZC6MX3hwodRV25XjWuv6zE3Xjed2xG3E3dg92f24|ysPSw|RR4vHlKeT5xrPC16Il69XkVevt5L3Yu9q76c|Oj6JPo0|E752vqt9L|hh|QL9dvrd89fw5|rX|08EOASsCegKpARGBFYHPgsyCRIFdQTDwQHBu4IfL9JfJFzUFgJC|EN2hTwJNQxdFfpzGC4sNKwm7Hm4VXh|eHcELWJFREPEu0iPyNLIR4uNFksWd0bJR8VF1UdNRXtFl0VLl1gsWbPkRoxajCCmPRYfGxV7JHZyqffS3UuH4|ziCuPuLjNclrPs2nK15anLz66QX8FZcSoeGx8d3xD|iRPCqeVMrvRfuXflBNeTu4f7kufGK|eN8V34ZfyRBJeEsoTRRJfEXYljSa5JFUnjAk9BteB1sl|ygeSplJCUoykzqdGpzWmEtPi000IlYYqwK10zPSe9L8M0ozBDuspp1e5VE6JA0ZFMKHNZZruYjv5M9UiMJJslg1kLs2qy3mdHZZ|KUcwR5vTkmuRuyx3J88n7fjVmNXd1Z752|ob8wTXuaw6thdauXNu5Tnddwbrh9b7rj20gbUjZ8MtGy41lG99uit7UUaBRsL5gaLPv5sZCuUJR4b0tzlsObMVsFWzt3WazrWrblyJe0fViy|KK4k8l3JLr31l9V|ndzPaE7b2l9qX7d|B2CHfc3em681iZYlle2dCu4F2t5czyovK3u1fsvlZhW3FgD2mPZI|0MqiyvUqvakfVp|qk6oEaj5rmvep7t|2d2sfb17|fbX|TAY0DxQc|HhQcvH|I91BrrUFtxWHc4azDz|ui6rq|Z39ff0TtSPGRz0eFR6XHwo911TvU1zeoN5Q2wo2SxrHjccdv|eD1Q3sTq|lQM6O5|AQ4ITnx4sf4H|eDDzZeYp9qukn|2ttBailqh1tzWibakNml7THvf6YDTnR3OHS0|989Iz2mZqzymdLz5HOFZybOZ93fvJCxoXxi4kXhzpXdD66tOTSna6wrt7LgZevXvG5cqnbvfv8VZerZ645XTt9nX297Yb9jdYeu56WX|aem172296XCz|ZbjrY6|BX3n|l37L972un3ljv|dGwOLBvruLr57|17cPel93v3RB6kPXj|Mejj9aP1j7OOiJwpPKp6qP6391fjXZqm99Oyg12DPs4hnj4a4Qy|lfmvT8MFz6nPK0a0RupHrUfPjPmM3Xqx9MXwy4yX0|OFvyn|tveV0auffnf7vWdiycTwa9HrmT9K3qi|OfrW9m3nZOjk03dp76anit6rvj|2gf2h|2P0x5Hp7E|4T5WfjT93fAn88ngmbWbm3|eE8|syOll|AAABlElEQVRYCe1XMVLDMBC0aDKkyAfCTCqavAPKFKlp|Kc8ADekgbfQ8QSgARcwgdLsijuPEEccmYBSWDMbn3R7e5eTrExc0zRFznGUMzlzDwUMHTA74JwrgSZE6mENY8UuTQ2|hiFAmgMbgO9ni5Czix3Gik3NeRwbJx|DdAfUwIxkjBcA5tdCu|aMYaxozGBTk9rjMDYuoAKBgUslwf51AVLEUrQvVduv6wTOUggrXfOEPRUgWivJUWoO3wEs6r7fwh6p8w8KGEGfOdrzALvQfX|FfRomlwImWJ|E611zxlhxzAEwlz8PeBYVwH2|6BLdl5|5JGflxMAjzzAvov8u5RoJuQWPwAI4jlvNNfGRQ|6NwemlAy1|QVB0EYvGc3IAcmvDV4svSSc8A7yh3iHy48Cdzk68kQAuY9vB|14mSTrZzwAL4L5ynH0|tn6ei|fBYPXWWUOM7Us5hGvjDPTS4Rc5AZ4BFrELnsCbGgX00tHfAgbzG9xvKYK|Bbci0GvmQdx|Cc4yDegpwNGP6YDB3I34EP9lEHY16kIUAAAAAASUVORK5CYII|addListener|execute|NOD_Support_Air|last|GDI_Airport|GDI_Barracks|getBackgroundArea|closeCityInfo|add|GDI_Factory|GDI_Trade|get_VisObjectType|get_CityBuildingsData|loaded|RegionCityType|get_Type|Link|GDI_Command|GDI_Support_Art|Offense|Alliance|Enemy|RegionGhostCity|Ghost|selected|ignoring|because|we|don|know|what|to|do|here|RegionNPCBase|RegionNPCCamp|Unit|List|get_CurrentOwnCity|clearTimeout|get_OwnerId|setEnabled|GDI_Support_Air|100|get_Alliance|GDI_Silo|get_Server|GDI_Support_Ion|postError|GM_log|FOR_Silo|FOR_Refinery|FOR_Tiberium|Target|GDI_Power|createElement|script|FOR_Crystal|toString|innerHTML|text|javascript|getElementsByTagName|head|appendChild|TA|Script|Bug|Fixes|Pack'.split('|'),0,{}))