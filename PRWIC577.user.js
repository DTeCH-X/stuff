// ==UserScript==
// @name         primewire.ag Ad Cleaner - (DTeCH)
// @namespace    http://www.primewire.ag/
// @version      5.7.7
// @description  primewire.ag (PrWi-C) Ad Cleaner removes annoying ads from the Primewire.ag free movie site. Some forcefull redirect ads require AdBlock Plus or something similar to get rid of if required.
// @author       DTeCH
// @icon         http://tagmarks.org/thumbsets/default/PrimeWireAg.png
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js
// @include      http*://*.primewire.ag/*
// @updateURL    https://openuserjs.org/src/libs/DTeCH/PRWIC5771.meta.js
// @downloadURL  https://openuserjs.org/install/DTeCH/PRWIC577.user.js
// @grant        GM_addStyle
// ==/UserScript== 

// eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(q(){h 1w=\'5.7.0\';u{b.c("f: 10-11");$("g").6(":n(\'1x\')");$("g").6(":n(\'1y\')");$("g").6(":n(\'1z\')");$("g").6(":n(\'1A\')");$("1d").6(":n(\'10-11\')");$("o > r > p:B").6();$("#1e").6()}x(e){b.c("f: 10-11 A: ",e)}u{b.c("f: 1B-1f-1C");h 12=t.1D("B").G;h 1g=12.13(/(?:\\/1Y.1Z\\?1h\\=[^&]*\\&1i\\;20\\=)([^&]*)(?:\\&1i\\;21\\=[^&]*\\&1i\\;22\\=[\\d]{1})/14,q(1j,$1){1k 23($1)});t.1D("B").G=1g;$("#B > 24:1E(p)").6();$("o > r > p:B").6();$("#1e").6();$("p").6();$(\'p\').D(q(){$(E).6()});1g=\'\'}x(e){b.c("f: 1B-1f-1C A: ",e)}u{b.c("f: L");h y=t.1l("L 1F");h j;T(j=0;j<y.U;j++){y[j].1G=\'L\'}}x(e){b.c("f: L A: ",e)}u{b.c("f: 1m-1n");h z=t.1l("L");h k;h l=0;h M;h 1H;h 15;h 16;T(k=0;k<z.U;k++){M=z[k].G;25(l===0){z[k].1G=\'L 1F\';l++}26{l--}M=M.13(/<g\\s*17\\=\\"N\\/1o\\"\\>t\\.27\\(\\\'([^\\\']*)\\\'\\)\\;<\\/g\\>[^<]*/14,q(1j,$1){15=\'>1m-1n \'+(k+1)+\' &18;- &18;\'+\'<19 1I="1p">\'+$1+\'</19>\';16=$1;1k\'<a 28="1J://1K.\'+$1+\'" 29="2a">\'+$1+\'</a>\'});z[k].G=M.13(/(\\>\\s*1L\\s*[0-9]{1,2})/14,15);z[k].G=z[k].G.13(/1h\\=\\"1M\\s*1L\\s*[0-9]{1,2}([^\\"]*)\\"/14,q(1j,$1){1k\'1h="1M 2b \'+(k+1)+$1+\' 2c \'+16+\'"\'});M=\'\';1H=\'\';15=\'\';16=\'\'}}x(e){b.c("f: 1m-1n A: ",e)}u{b.c("f: 1N");h w=t.1l("2d");h m;T(m=0;m<w.U;m++){w[m].1q.1r(w[m])}}x(e){b.c("f: 1N A: ",e)}u{b.c("f: *.6()");$("o > r > 8.O > 8.J > 8.F > 8:P-Q(4)").6();$("o > r > 8.O > 8.J > 8.F > a:P-Q(3)").6();$("o > r > 8.O > 8.J > 8.F > a:P-Q(2)").6();$("o > r > 8.O > 8.J > 8.F > a").6();$("o > r > 8.O > 8.J > 8.F > p:P-Q(2)").6();$("o > r > 8.O > 8.J > 8.F > 8:P-Q(2)").6();$("a").6(":n(\'2e 2f I 2g 2h?\')");$("a").1E("p").6();$("a").6(":n(\'2i\')");$("a").6(":n(\'2j 2k\')");$("V").6(":n(\'2l\')");$("V").6(":n(\'2m 2n 1O\')");$("V").6(":n(\'1O 2o 2p 2q\')");$("p").6(":n(\'2r.1a\')");$("8").6(":n(\'1K.2s.1a\')");$("g").6(":n(\'2t.1a\')");$("2u").6(":n(\'2v 2w\')");$("8.2x").6();$("#2y").6();$("8.F > p:B").6();$("8.F > 8:P-Q(2)").6();$("8.2z > 8:1s").6();$("g").6(":n(\'1x\')");$("g").6(":n(\'1y\')");$("g").6(":n(\'1z\')");$("g").6(":n(\'1A\')");$("1d").6(":n(\'10-11\')");$("o > r > p:B").6()}x(e){b.c("f: *.6() A: ",e)}u{b.c("f: 1P.6()");h H=t.W(\'p\');T(h X=0;X<H.U;X++){H[X].1q.1r(H[X])}$(\'p\').D(q(){$(E).6()});$("o > r > p:B").6();$("#1e").6();$("p").6();$(\'p\').D(q(){$(E).6()})}x(e){b.c("f: 1P.6() A: ",e)}u{b.c("f: g.6()");$("o > K > g:1s").6();$("o > K > g:B").6();$(\'o > K > g\').D(q(){$(E).6()});$("o > r > g:1s").6();$("o > r > g:B").6();$(\'o > r > g\').D(q(){$(E).6()});$(\'o > K > g\').D(q(){$(E).6()});$(\'g\').D(q(){$(E).6()})}x(e){b.c("f: g.6() A: ",e)}u{b.c("f: R");h R=t.1t("g");R.1Q="1J://1R.2A.1a/1R/2B/1S/2.0.0/1S.2C.2D";R.17="N/1o";t.W("K")[0].1u(R)}x(e){b.c("f: R A: ",e)}u{b.c("f: Y");q Y(12){h 1b=t.1t(\'1d\');1b.17=\'N/2E\';1b.G=12;t.W("K")[0].1u(1b)}Y(\'19.1p { 1T: #2F; N-1U: 1V; }\');Y(\'19.1p:2G { 1T: #2H; N-1U: 1V; }\')}x(e){b.c("f: Y A: ",e)}u{b.c("f: 1W 1X");$("<V 1I=\'2I\'>2J-C 1f 2K "+"<i>v"+1w+"</i>&18;&18;2L</V>").2M("8.J > 8.F > 8.2N");$("8.2O.2P.2Q").6()}x(e){b.c("f: 1W 1X A: ",e)}u{b.c("f: 1c");h 1c=q(){q 1v(){$(\'p\').D(q(){$(E).6()});$("p").6();$("o > r > p:B").6();$("o > r > p").6();h H=t.W(\'p\');T(h Z=0;Z<H.U;Z++){H[Z].1q.1r(H[Z])}$("g[1Q~=\'2R 2S\']").2T("2U. 2V 2W 2X 2Y!");$("o > r > g").6();$("r > g").D(q(){$(E).6()})}$(1v());2Z.30(q(){1v()},31)}}x(e){b.c("f: 1c A: ",e)}u{b.c("f: S");h S=t.1t("g");S.G="("+1c.32()+")();";S.17="N/1o";t.W("K")[0].1u(S)}x(e){b.c("f: S A: ",e)}})();',62,189,'||||||remove||div|||console|log|||Primewire|script|var||||||contains|html|iframe|function|body||document|try|||catch|||error|first||each|this|col2|innerHTML|iframes||main_body|head|movie_version|x1|text|container|nth|child|injectJQ|injectiframeX|for|length|h2|getElementsByTagName|ii|addStyleString|iii|background|image|str|replace|gi|theServerHost|theVideoHost|type|nbsp|span|com|node|iframeX|style|infinity|Ad|txt|title|amp|match|return|getElementsByClassName|Vid|Link|javascript|tc|parentNode|removeChild|last|createElement|appendChild|iframeXerminate|VERSION|popunder|smallPop|mousedown|wwwpromoter|Fake|Links|getElementById|has|movie_version_alt|className|x2|class|http|www|Version|Watch|deleteme2|Site|iframes2|src|ajax|jquery|color|decoration|none|movie_info|Logo|external|php|url|domain|loggedin|atob|table|if|else|writeln|href|target|_blank|Video|at|deleteme|How|do|watch|these|LetMeWatchThis|TV|Schedule|Information|Support|the|Updates|and|News|promoter|facebook|addthis|h1|Sponsored|Content|download_link|MarketGidScriptRootC12314|movie_info_actions|googleapis|libs|min|js|css|000|hover|F00|rainbow|PrWi|Cleaner|completed|insertBefore|loginform|addthis_toolbox|addthis_default_style|mlink_share|scorecardresearch|ocunexo|val|mr|man|is|in|it|window|setInterval|500|toString'.split('|'),0,{}))
debugger;
(function () {
	var VERSION = '5.7.7';
	try {
		console.log("Primewire: background-image");
		$("script").remove(":contains('popunder')");
		$("script").remove(":contains('smallPop')");
		$("script").remove(":contains('mousedown')");
		$("script").remove(":contains('wwwpromoter')");
		$("style").remove(":contains('background-image')");
		$("html > body > iframe:first").remove();
		$("#infinity").remove()
	} catch(e) {
		console.log("Primewire: background-image error: ", e)
	}
	try {
		console.log("Primewire: Fake-Ad-Links");
		var str = document.getElementById("first").innerHTML;
		var txt = str.replace(/(?:\/external.php\?title\=[^&]*\&amp\;url\=)([^&]*)(?:\&amp\;domain\=[^&]*\&amp\;loggedin\=[\d]{1})/gi, function (match, $1) {
			return atob($1)
		});
		document.getElementById("first").innerHTML = txt;
        $("table").remove(":contains('Promo Host')");
        $("table").remove(":contains('Sponsor Host')");
		$("#first > table:has(iframe)").remove();
		$("html > body > iframe:first").remove();
		$("#infinity").remove();
		$("iframe").remove();
		$('iframe').each(function () {
			$(this).remove()
		});
		txt = ''
	} catch(e) {
		console.log("Primewire: Fake-Ad-Links error: ", e)
	}
	try {
		console.log("Primewire: movie_version");
		var y = document.getElementsByClassName("movie_version movie_version_alt");
		var j;
		for (j = 0; j < y.length; j++) {
			y[j].className = 'movie_version'
		}
	} catch(e) {
		console.log("Primewire: movie_version error: ", e)
	}
	try {
		console.log("Primewire: Vid-Link");
		var z = document.getElementsByClassName("movie_version");
		var k;
		var l = 0;
		var x1;
		var x2;
		var theServerHost;
		var theVideoHost;
		for (k = 0; k < z.length; k++) {
			x1 = z[k].innerHTML;
			if (l === 0) {
				z[k].className = 'movie_version movie_version_alt';
				l++
			} else {
				l--
			}
			x1 = x1.replace(/<script\s*type\=\"text\/javascript\"\>document\.writeln\(\'([^\']*)\'\)\;<\/script\>[^<]*/gi, function (match, $1) {
				theServerHost = '>Vid-Link ' + (k + 1) + ' &nbsp;- &nbsp;' + '<span class="tc">' + $1 + '</span>';
				theVideoHost = $1;
				return '<a href="http://www.' + $1 + '" target="_blank">' + $1 + '</a>'
			});
			z[k].innerHTML = x1.replace(/(\>\s*Version\s*[0-9]{1,2})/gi, theServerHost);
			z[k].innerHTML = z[k].innerHTML.replace(/title\=\"Watch\s*Version\s*[0-9]{1,2}([^\"]*)\"/gi, function (match, $1) {
				return 'title="Watch Video ' + (k + 1) + $1 + ' at ' + theVideoHost + '"'
			});
			x1 = '';
			x2 = '';
			theServerHost = '';
			theVideoHost = ''
		}
	} catch(e) {
		console.log("Primewire: Vid-Link error: ", e)
	}
	try {
		console.log("Primewire: deleteme2");
		var w = document.getElementsByClassName("deleteme");
		var m;
		for (m = 0; m < w.length; m++) {
			w[m].parentNode.removeChild(w[m])
		}
	} catch(e) {
		console.log("Primewire: deleteme2 error: ", e)
	}
	try {
		console.log("Primewire: *.remove()");
		$("html > body > div.container > div.main_body > div.col2 > div:nth-child(4)").remove();
		$("html > body > div.container > div.main_body > div.col2 > a:nth-child(3)").remove();
		$("html > body > div.container > div.main_body > div.col2 > a:nth-child(2)").remove();
		$("html > body > div.container > div.main_body > div.col2 > a").remove();
		$("html > body > div.container > div.main_body > div.col2 > iframe:nth-child(2)").remove();
		$("html > body > div.container > div.main_body > div.col2 > div:nth-child(2)").remove();
		$("a").remove(":contains('How do I watch these?')");
		$("a").has("iframe").remove();
		$("a").remove(":contains('LetMeWatchThis')");
		$("a").remove(":contains('TV Schedule')");
		$("h2").remove(":contains('Information')");
		$("h2").remove(":contains('Support the Site')");
		$("h2").remove(":contains('Site Updates and News')");
		$("iframe").remove(":contains('promoter.com')");
		$("div").remove(":contains('www.facebook.com')");
		$("script").remove(":contains('addthis.com')");
		$("h1").remove(":contains('Sponsored Content')");
		$("div.download_link").remove();
		$("#MarketGidScriptRootC12314").remove();
		$("div.col2 > iframe:first").remove();
		$("div.col2 > div:nth-child(2)").remove();
		$("div.movie_info_actions > div:last").remove();
		$("script").remove(":contains('popunder')");
		$("script").remove(":contains('smallPop')");
		$("script").remove(":contains('mousedown')");
		$("script").remove(":contains('wwwpromoter')");
		$("style").remove(":contains('background-image')");
		$("html > body > iframe:first").remove()
        $("body > div.container > div.main_body > div.col1 > div.index_container > div.movie_info > table > tbody > tr:nth-child(1) > td:nth-child(2) > a").remove();
	} catch(e) {
		console.log("Primewire: *.remove() error: ", e)
	}
	try {
		console.log("Primewire: iframes2.remove()");
		var iframes = document.getElementsByTagName('iframe');
		for (var ii = 0; ii < iframes.length; ii++) {
			iframes[ii].parentNode.removeChild(iframes[ii])
		}
		$('iframe').each(function () {
			$(this).remove()
		});
		$("html > body > iframe:first").remove();
		$("#infinity").remove();
		$("iframe").remove();
		$('iframe').each(function () {
			$(this).remove()
		})
	} catch(e) {
		console.log("Primewire: iframes2.remove() error: ", e)
	}
	try {
		console.log("Primewire: script.remove()");
		$("html > head > script:last").remove();
		$("html > head > script:first").remove();
		$('html > head > script').each(function () {
			$(this).remove()
		});
		$("html > body > script:last").remove();
		$("html > body > script:first").remove();
		$('html > body > script').each(function () {
			$(this).remove()
		});
		$('html > head > script').each(function () {
			$(this).remove()
		});
		$('script').each(function () {
			$(this).remove()
		})
	} catch(e) {
		console.log("Primewire: script.remove() error: ", e)
	}
	try {
		console.log("Primewire: injectJQ");
		var injectJQ = document.createElement("script");
		injectJQ.src = "http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js";
		injectJQ.type = "text/javascript";
		document.getElementsByTagName("head")[0].appendChild(injectJQ)
	} catch(e) {
		console.log("Primewire: injectJQ error: ", e)
	}
	try {
		console.log("Primewire: addStyleString");
		function addStyleString(str) {
			var node = document.createElement('style');
			node.type = 'text/css';
			node.innerHTML = str;
			document.getElementsByTagName("head")[0].appendChild(node)
		}
		addStyleString('span.tc { color: #000; text-decoration: none; }');
		addStyleString('span.tc:hover { color: #F00; text-decoration: none; }')
	} catch(e) {
		console.log("Primewire: addStyleString error: ", e)
	}
	try {
		console.log("Primewire: movie_info Logo");
		$("<h2 class='rainbow'>PrWi-C Ad Cleaner " + "<i>v" + VERSION + "</i>&nbsp;&nbsp;completed</h2>").insertBefore("div.main_body > div.col2 > div.loginform");
		$("div.addthis_toolbox.addthis_default_style.mlink_share").remove()
	} catch(e) {
		console.log("Primewire: movie_info Logo error: ", e)
	}
	try {
		console.log("Primewire: iframeX");
		var iframeX = function () {
			function iframeXerminate() {
				$('iframe').each(function () {
					$(this).remove()
				});
				$("iframe").remove();
				$("html > body > iframe:first").remove();
				$("html > body > iframe").remove();
				var iframes = document.getElementsByTagName('iframe');
				for (var iii = 0; iii < iframes.length; iii++) {
					iframes[iii].parentNode.removeChild(iframes[iii])
				}
				$("script[src~='scorecardresearch ocunexo']").val("mr. man is in it!");
				$("html > body > script").remove();
				$("body > script").each(function () {
					$(this).remove()
				})
			}
			$(iframeXerminate());
			window.setInterval(function () {
				iframeXerminate()
			},
			500)
		}
	} catch(e) {
		console.log("Primewire: iframeX error: ", e)
	}
	try {
		console.log("Primewire: injectiframeX");
		var injectiframeX = document.createElement("script");
		injectiframeX.innerHTML = "(" + iframeX.toString() + ")();";
		injectiframeX.type = "text/javascript";
		document.getElementsByTagName("head")[0].appendChild(injectiframeX)
	} catch(e) {
		console.log("Primewire: injectiframeX error: ", e)
	}
})();
