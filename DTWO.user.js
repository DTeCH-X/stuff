// ==UserScript==
// @name        Maelstrom ADDON Alliance members Who's Online (DTeCH)
// @namespace   MTAAlliancemembersWhosOnlineDTeCH
// @description Show player online status via Color.
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @version     2.2.1i
// @author      DTeCH, White X Dragon, Der_Flake
// @icon        http://eistee82.github.io/ta_simv2/icon.png
// @updateURL   https://cdn.rawgit.com/DTeCH-X/stuff/master/DTWO.meta.js
// @downloadURL https://cdn.rawgit.com/DTeCH-X/stuff/master/DTWO.user.js
// ==/UserScript==


eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('z{(w(){w 1R(){4 N=0;1U(29){1G 2l:N=1;17;1C:N=2;17}8.h("1y "+14.2p+" 25, 2t "+N);4 X={1m:1,20:2,1W:0,1T:3};4 U={};U[X.1m]="#2x";U[X.20]="#2y";U[X.1W]="#2z";U[X.1T]="#2A";w 1A(){2i(22,2B);8.h("1y 1j");4 5=9.v.k.T.1v;5.1p=w(1z){z{4 1t=9.1B.1H.1I().1K().2w().d;4 1h=l.2v();o(1t[1h]!==x){4 21=1t[1h].X;Y U[21]}}L(H){8.h("13 1p E: ",H)}Y 1z};5.W=w(2s){z{}L(H){8.h("13 W E: ",H)}};4 1b=g(5.1J,/2r;l\\.([A-Z]{6})\\(/,"9.v.k.T 1J",1);4 10=1b[1];8.h("10 = "+1b[1]);o(1b===V||10.1a!==6){8.E("1i - 9.v.k.T.2o x");Y}5.1g=5[10];8.h("5.1g = "+5[10]);4 1l=O(5.1g);5.2n=1l;4 1n=1l.j(/\\{g="#1x";\\}/M,"{g=\\"#1x\\";}11{g=l.1p(g);}");5[10]=S R("a","b",1n);5.2m=S R("a","b",1n);4 7=V;1U(N){1G 1:7=g(5.y,/18:\\{?l\\.(.{6})\\(.*19:\\{?l\\.(.{6})\\(/,"9.v.k.T y",2);17;1C:7=g(5.y,/18:\\{?\\$I\\.(.{6})\\.(.{6})\\(.*19:\\{?\\$I\\..{6}\\.(.{6})\\(/,"9.v.k.T y",3);4 G=9.v.k.k.1v;4 1k=g(G.y,/\\.(.{6})\\(a,n,s\\);/,"9.v.k.k y",1);17}o(7===V||7[1].1a!==6){8.E("1i - 9.v.k.T y 2j x");Y}o(N>1){5[7[2]]=$I[7[1]][7[2]];5[7[3]]=$I[7[1]][7[3]];4 1O=O(5.y);4 t=1O.j(/18:(\\{?).{0,2}\\$I\\.(.{6})\\.(.{6}).{0,2}\\(/M,"18: $1 l.$3(");4 q=t.j(/19:(\\{?).{0,2}\\$I\\.(.{6})\\.(.{6}).{0,2}\\(/M,"19: $1 l.$3(");4 F=q.j(/1u:(\\{?).{0,2}\\$I\\.(.{6})\\.(.{6}).{0,2}\\(/M,"1u: $1 l.$3(");5[1k[1]]=S R("a","b","c",F);5.y=5[1k[1]]}z{4 u=V,Q=V;o(N===1){u=O(5[7[1]]);Q=u.j(/c\\.D\\);/M,"c.D); l.W(a); ");5[7[1]]=S R("a","b","c","d",Q)}11{u=O(5[7[2]]);Q=u.j(/d\\.D\\);/M,"d.D); l.W(b);");5[7[2]]=S R("a","b","c","d","e",Q)}}L(P){8.h("13 1j B E: ",P)}z{o(N===1){4 K=O(5[7[2]]);4 J=K.j(/c.D\\);/M,"c.D); l.W(a); ");5[7[2]]=S R("a","b","c","d","e",J)}11{4 1Y=O(5[7[3]]);4 1Z=1Y.j(/d.D\\);/M,"d.D); l.W(b);");5[7[3]]=S R("a","b","c","d","e","f","g",1Z)}}L(P){8.h("13 1j C E: ",P)}}w g(1f,23,m,p){4 24=1f.1s();4 1r=24.j(/\\s/26,"");4 12=1r.27(23);28(4 i=1;i<p+1;i++){o(12!==V&&12[i].1a===6){8.h(m,i,12[i])}11{8.E("1i - ",m,i,"2a 2b");8.2c(m,1r)}}Y 12}w 22(){8.h("2d\'s 1m: 2e 2f 2g 2h");4 1Q=9.1B.1H.1I();4 1N=1Q.1K();1N.2k()}w O(1f){4 1F=1f.1s();4 1E=1F.j(/(\\n\\r|\\n|\\r|\\t)/1X," ");4 1P=1E.j(/\\s+/1X," ");4 1q=1P.j(/w.*?\\{/,"");Y 1q.2q(0,1q.1a-1)}w 1e(){z{o(1o 9!=="x"&&9.v!==x&&9.v.k!==x&&9.v.k.T!==x){1A()}11{14.1d(1e,1D)}}L(H){8.h("1e: ",H)}}w 16(){z{o(1o 9==="x"||1o 2u==="x"){14.1d(16,1V)}}L(H){8.h("16: ",H)}}o(/1L\\.1S/i.1M(1c.1w)){14.1d(1e,1D);14.1d(16,1V)}}z{o(/1L\\.1S/i.1M(1c.1w)){4 15=1c.2C("2D");15.2E="2F";15.2G="("+1R.1s()+")();";15.2H="2I/2J";1c.2K("2L")[0].2M(15)}}L(c){8.h("13: 2N E: ",c)}})()}L(e){8.h("2O 2P 2Q-2R 2S: ",e)}',62,179,'||||var|regionCityPrototype||visUpdateParts|console|ClientLib||||||||log||replace|Region|this|||if|||||||Vis|function|undefined|VisUpdate|try||||Font|error|||ex||||catch|im|injectionMode|getFunctionBody|||Function|new|RegionCity|onlineStateColor|null|CityBackgroundColor|OnlineState|return||setCanvasValue_Name|else|matches|MaelstromTools_CityOnlineStateColorer|window|scriptTag|MaelstromTools_CityOnlineStateColorerTool_checkIfLoaded|break|Own|Alliance|length|updateColorParts|document|setTimeout|MaelstromTools_CityOnlineStateColorerInclude_checkIfLoaded|functionObject|SetCanvasValue_ORG|playerId|Error|Include|fc|setCanvasValueFunctionBody|Online|setCanvasValueFunctionBodyFixed|typeof|CityTextcolor|headerRemoved|shrinkedText|toString|members|Enemy|prototype|domain|000000|Maelstrom_CityOnlineStateColorer|defaultColor|CityOnlineStateColorerInclude|Data|default|10000|singleLine|string|case|MainData|GetInstance|UpdateColor|get_Alliance|commandandconquer|test|alliance|visUpdate|spacesShrinked|mainData|OnlineStatusCityColor_Main|com|Hidden|switch|25000|Offline|gm|K2|J2|Away|onlineState|requestOnlineStatusUpdate|regEx|functionBody|loaded|gim|match|for|PerforceChangelist|not|found|warn|Who|requesting|online|status|udpate|setInterval|paramter|RefreshMemberData|373715|SetCanvasValue_FIXED|SetCanvasValue_BODY|SetCanvasValue|__mscc_version|substring|createHelper|backgroundBlock|Serverversion|MaelstromTools|get_PlayerId|get_MemberData|00FF00|FFFF00|FF0000|C2C2C2|45000|createElement|script|id|xxx|innerHTML|type|text|javascript|getElementsByTagName|head|appendChild|init|TA|Script|Bug|Fixes|Pack'.split('|'),0,{}))