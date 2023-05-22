const audio = document.querySelector("audio");
const remainingTimeEl = document.querySelector("#remainingTime");
const seekbar = document.querySelector(".seekbar");
const stadiumVid = document.querySelector(".stadiumVid");
const galleryImgs = document.querySelectorAll(".imgGallery > li > img");
var mouseDown = false;
const YT_API = "AIzaSyDc_Ue0rYcie9yljDgsJ5vpE-oBT2z5no8";

document.querySelectorAll(".no-js").forEach(elem => {
	elem.style.display = "none";
});

document.querySelectorAll(".prevMatch, .nextMatch").forEach(elem => {
	elem.style.display = "flex";
});

function showImgIndex(i) {
	for (var j = 0; j < galleryImgs.length; j++) {
		if (galleryImgs[j].classList.contains("fullscreen") && j+i >= 0 && j+i < galleryImgs.length) {
			hideImg();
			showImg(galleryImgs[j+i]);
			break;
		}
	}
}

function nextImg(e) {
	if (e.keyCode == '37') {
		showImgIndex(-1);
	}
	else if (e.keyCode == '39') {
		showImgIndex(1);
	}
}

function showImg(elem) {
	var div = document.createElement("div");
	div.setAttribute("id", "hideBg");
	document.getElementById("blackContainer").appendChild(div);
	elem.classList.add("fullscreen");
	document.getElementById("closeBtn").style.display = "block";
	document.querySelector(".hymn").style.display = "none";
	document.querySelector(".scrollTop").style.display = "none";
	document.querySelectorAll(".imgScale").forEach(img => {
		img.style.display = "none";
	});
	if (!elem.classList.contains("textImg")) {
		document.querySelectorAll(".prevImg, .nextImg").forEach(btn => {
			btn.style.display = "flex";
		});
		var index = Array.prototype.indexOf.call(elem.parentNode.parentNode.children, elem.parentNode);
		if (index == 0) {
			document.querySelector(".prevImg").style.display = "none";
		} else if (index + 1 == galleryImgs.length) {
			document.querySelector(".nextImg").style.display = "none";
		}
	}
	document.addEventListener("keydown", nextImg);
}

function hideImg() {
	document.querySelector(".hymn").style.display = "flex";
	var scrollTopBtn = document.querySelector(".scrollTop");
	var headerHeight = document.querySelector(".header").offsetHeight;
	if (window.pageYOffset >= headerHeight) {
		scrollTopBtn.style.display = "flex";
	} else {
		scrollTopBtn.style.display = "none";
	}
	document.getElementById("hideBg").parentNode.removeChild(document.getElementById("hideBg"));
	document.getElementById("closeBtn").style.display = "none";
	document.querySelectorAll(".imgScale").forEach(img => {
		img.style.display = "block";
		img.classList.remove("fullscreen");
	});
	document.querySelectorAll(".prevImg, .nextImg").forEach(btn => {
		btn.style.display = "none";
	});
	document.removeEventListener("keydown", nextImg);
}

if (document.title === "Real Madrid - Titles") {
	var liArray = document.querySelectorAll("li:not(li:first-child)");
	liArray.forEach(function(elem) {
	    elem.addEventListener("click", function() {
			var trophyYears = document.getElementById("trophyYears");
			trophyYears.innerHTML = '<ion-icon class="closeTYbtn" onclick="hideTrophyYears();" name="close-outline"></ion-icon>';
			trophyYears.style.display = "flex";
	        var years = elem.dataset.years;
			var yearPar = document.createElement("div");
			yearPar.textContent = years.replaceAll(" ", ", ").replaceAll("-", "‑");
			var div = document.createElement("div");
			var title = document.createElement("p");
			var newImg = document.createElement("img");
			var innerDiv = elem.getElementsByTagName("div")[0];
			newImg.src = innerDiv.getElementsByTagName("img")[0].src;
			var ogTitle = innerDiv.getElementsByTagName("div")[0].getElementsByTagName("p")[0].textContent;
			var result = ogTitle.replace(/[0-9]/g, "").replace("X - ", "");
			title.textContent = result;
			newImg.setAttribute("class", "trophyImg");
			div.setAttribute("class", "outerTrophyImg");
			div.appendChild(newImg);
			div.appendChild(title);
			trophyYears.appendChild(yearPar);
			trophyYears.appendChild(div);
			trophyYears.parentNode.classList.add("outerTY");
	    });
	});
	
	function hideTrophyYears() {
		var ty = document.getElementById("trophyYears");
		ty.setAttribute("style", "pointer-events: auto;");
		var TYinner = '<ion-icon class="closeTYbtn" onclick="hideTrophyYears();" name="close-outline"></ion-icon>';
		ty.innerHTML = TYinner;
		ty.setAttribute("style", "display: none; pointer-events: none;");
		document.querySelector(".outerTY").classList.remove("outerTY");
	}
}

function changeSrc(elem) {
	var mainVideo = document.querySelector(".mainVid");
	var oldVideoSrc = mainVideo.src;
	mainVideo.src = elem.dataset.url;
	elem.dataset.url = oldVideoSrc;
	var oldImgSrc = elem.src;
	elem.src = mainVideo.dataset.img;
	mainVideo.dataset.img = oldImgSrc;
}

function stopHymn(audio, elem) {
	audio.pause();
	elem.innerHTML = '<ion-icon name="play-outline"></ion-icon>';
}

function playHymn(elem) {
	if (audio.paused) {
		audio.play();
		elem.innerHTML = '<ion-icon name="pause-outline"></ion-icon>';
	} else {
		stopHymn(audio, elem);
	}
}

function setTime(time) {
	document.querySelector("#currentTime").textContent = time;
}

function restartHymn() {
	audio.currentTime = 0;
	setTime("00:00");
}

function closeHymn() {
	$(".hymn").removeClass("hymnHover");
}

$(".hymn").mouseover(function(){
	$(this).addClass("hymnHover");
});

$(".hymn").mouseout(function(){
	$(this).removeClass("hymnHover");
});

function formatTime(seconds) {
	var minutes = Math.floor(seconds / 60);
	minutes = (minutes >= 10) ? minutes : "0" + minutes;
	var seconds = Math.floor(seconds % 60);
	seconds = (seconds >= 10) ? seconds : "0" + seconds;
	return minutes + ":" + seconds;
}

function remainingTime() {
	var remaining = audio.duration - audio.currentTime;
	remainingTimeEl.textContent = "-" + formatTime(remaining);
}

audio.onloadedmetadata = function() {
	remainingTimeEl.textContent = "-" + formatTime(audio.duration);
}

audio.ontimeupdate = function() {
	setTime(formatTime(this.currentTime));
	remainingTime();
	if (!mouseDown) {
		seekbar.value = 100 * this.currentTime / this.duration;
	}
}

audio.onended = function() {
	stopHymn(this, document.querySelector("#playbtn"));
	restartHymn();
}

seekbar.addEventListener("change", () => {
  const percentage = seekbar.value / 100;
  audio.currentTime = (audio.duration || 0) * percentage;
});

seekbar.addEventListener("mousedown", () => {
  mouseDown = true;
});

seekbar.addEventListener("mouseup", () => {
  mouseDown = false;
});

var scrollTopBtn = document.querySelector(".scrollTop");
var obligatoryElem = document.querySelector(".obligatory");
var hymnElem = document.querySelector(".hymn");

scrollTopBtn.addEventListener("click", function() {
	window.scrollTo(0, 0);
});

document.addEventListener("scroll", function() {
	if (!document.querySelector(".fullscreen")) {
		var headerHeight = document.querySelector(".header").offsetHeight;
		if (window.pageYOffset >= headerHeight) {
			scrollTopBtn.style.display = "flex";
			obligatoryElem.style.display = "flex";
			(window.matchMedia("(min-width: 600px)").matches) ? hymnElem.style.top = "70px" : hymnElem.style.top = "0";
		} else {
			scrollTopBtn.style.display = "none";
			obligatoryElem.style.display = "none";
			(window.matchMedia("(min-width: 600px)").matches) ? hymnElem.style.top = "20px" : hymnElem.style.top = "0";
		}
	}
});

function loadVideo() {
	var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=UUWV3obpZVGgJ3j9FVhEjF2Q&maxResults=4&key=" + YT_API;
	$.getJSON(url, function(data) {
	    var videoId = data.items[0].snippet.resourceId.videoId;
		var newEmbedUrl = "https://www.youtube.com/embed/" + videoId;
		var mainVideo = document.querySelector(".mainVid");
		mainVideo.src = newEmbedUrl;
		document.getElementById("videoTitle").textContent = data.items[0].snippet.title;
		document.getElementById("videoDescr").innerText = data.items[0].snippet.description;
		if (!data.items[0].snippet.description) {
			document.querySelector(".videoDataHr").style.display = "none";
		}
		for (var i = 1; i < 4; i++) {
			var videoTn = data.items[i].snippet.thumbnails.medium.url;
			var img = document.querySelectorAll(".nextVid")[i-1];
			img.src = videoTn;
		}
	});
}

function chooseVideo(elem) {
	var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=UUWV3obpZVGgJ3j9FVhEjF2Q&maxResults=4&key=" + YT_API;
	var index = elem.dataset.index;
	$.getJSON(url, function(data) {
	    var videoId = data.items[index].snippet.resourceId.videoId;
		var newEmbedUrl = "https://www.youtube.com/embed/" + videoId;
		var mainVideo = document.querySelector(".mainVid");
		mainVideo.src = newEmbedUrl;
		elem.src = data.items[mainVideo.dataset.index].snippet.thumbnails.medium.url;
		elem.dataset.index = mainVideo.dataset.index;
		mainVideo.dataset.index = index;
		document.getElementById("videoTitle").textContent = data.items[index].snippet.title;
		document.getElementById("videoDescr").innerText = data.items[index].snippet.description;
		if (!data.items[index].snippet.description) {
			document.querySelector(".videoDataHr").style.display = "none";
		}
	});
}
	
function changeVideoStyle(mq) {
  if (!mq.matches) {
    document.querySelector(".nextVids").classList.add("tilted");
  } else {
    document.querySelector(".tilted").classList.remove("tilted");
  }
}

function decodeChars(string) {
  return new DOMParser().parseFromString(string, 'text/html').querySelector('html').textContent;
}

function translateText(text, source, target) {
	var sourceText = text;
	var sourceLang = source;
	var targetLang = target;
	var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="+ sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);
	return fetch(url)
		.then(response => response.json())
		.then(response => { return response[0][0][0] })
		.catch(error => { console.error(error) });
}

if (document.title === "Real Madrid - Videos") {
	loadVideo();
	var mq = window.matchMedia("(max-width: 1000px)");
	changeVideoStyle(mq);
	mq.addListener(changeVideoStyle);
}

if (document.title === "Real Madrid") {
	var corsProxy = "https://api.codetabs.com/v1/proxy?quest=";
	var rssFeed = "https://e00-marca.uecdn.es/rss/futbol/real-madrid.xml";
	fetch(corsProxy + rssFeed)
		.then(response => response.text())
		.then(xmlText => {
			var parser = new DOMParser();
			var xml = parser.parseFromString(xmlText, "text/xml");
			var items = xml.querySelectorAll("item");
			var articlesList = document.getElementById("articles-list");
			items.forEach(item => {
				var title = item.querySelector("title").textContent;
				var link = item.querySelector("link").textContent;
				var pubDate = new Date(Date.parse(item.querySelector("pubDate").textContent));
				var dateNow = new Date();
				var seconds = Math.floor((dateNow - pubDate)/1000);
				var hours = Math.floor(seconds/3600);
				var days = Math.floor(hours/24);
				hours = hours-(days*24);
				if (hours === 0) {
					time = Math.floor(seconds/60) + "min";
				} else if (days === 0) {
					time = hours + "h";
				} else if (days > 0) {
					time = days + "d " + hours + "h";
				}
				var description = decodeChars(unescape(item.querySelector("description").textContent.split("&nbsp;<a", 1)));
				var imgSrc = item.getElementsByTagNameNS("http://search.yahoo.com/mrss/", "content")[0].getAttribute("url");
				var imgElem = document.createElement("img");
				var articleElem = document.createElement("li");
				var titleElem = document.createElement("h3");
				var linkElem = document.createElement("a");
				var newsElem = document.createElement("a");
				var descriptionElem = document.createElement("p");
				var textElem = document.createElement("div");
				translateText(title, "es", "en").then(response => {
					newsElem.textContent = response;
				});
				if (imgSrc.startsWith("https://e00-marca.uecdn.es/assets/multimedia/imagenes/")) {
					imgElem.src = imgSrc;
				} else {
					imgElem.src = "https://digitalfinger.id/wp-content/uploads/2019/12/no-image-available-icon-6.png";
				}
				linkElem.setAttribute("class", "webLink");
				linkElem.textContent = "marca.com · " + time;
				newsElem.target = "_blank";
				newsElem.href = link;
				linkElem.target = "_blank";
				linkElem.href = "https://www.marca.com";
				if (description) {
					translateText(description, "es", "en").then(response => {
						descriptionElem.innerHTML = response;
					});
				}
				titleElem.appendChild(newsElem);
				textElem.appendChild(titleElem);
				textElem.appendChild(descriptionElem);
				textElem.appendChild(linkElem);
				articleElem.appendChild(imgElem);
				articleElem.appendChild(textElem);
				articlesList.appendChild(articleElem);
			});
		})
		.catch(error => {
			var newsDiv = document.querySelector(".outer-news");
			var p = document.createElement("p");
			p.textContent = "News cannot be loaded. There was an error. Refresh the page or try again later.";
			p.setAttribute("style", "text-align: center; padding: 0 3vw; margin-bottom: 5vh;");
			newsDiv.appendChild(p);
		});
	
	function addMatch(match, future) {
		var homeTeam = match.home_team;
		var awayTeam = match.away_team;
		var matchEl = document.createElement("li");
		var matchOuter = document.createElement("div");
		var matchInner = document.createElement("div");
		const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
		var md = new Date(Date.parse(match.start_at));
		var today = new Date();
		var tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		var offset = new Date().getTimezoneOffset() / 60;
		var hours = md.getHours() - offset;
		(hours.toString().length == 1) ? hours = "0" + hours : hours;
		(md.getMinutes().toString().length == 1) ? minutes = "0" + md.getMinutes() : minutes = md.getMinutes();
		var time = hours + ":" + minutes;
		var day;
		if (md.setHours(0,0,0,0) == today.setHours(0,0,0,0)) {
		    day = "Today";
		} else if (md.setHours(0,0,0,0) == tomorrow.setHours(0,0,0,0)) {
		    day = "Tomorrow";
		} else if (md.getFullYear() != today.getFullYear()) {
			var year = md.getFullYear().toString().slice(-2);
		    day = days[md.getDay()] + ", " + md.getDate() + " " + months[md.getMonth()] + " " + year;
		} else {
			day = days[md.getDay()] + ", " + md.getDate() + " " + months[md.getMonth()];
		}
		var date = day + ", " + time;
		matchOuter.textContent = match.league.name + " · " + date;
		var htEl = document.createElement("div");
		var htLogo = document.createElement("img");
		var htName = document.createElement("p");
		htLogo.src = homeTeam.logo;
		htName.textContent = homeTeam.name;
		htEl.appendChild(htLogo);
		htEl.appendChild(htName);
		matchInner.appendChild(htEl);
		var centerDiv = document.createElement("div");
		var vs = document.createElement("p");
		vs.textContent = "vs";
		if (!future) {
			var score = document.createElement("p");
			score.setAttribute("class", "score");
			score.textContent = match.home_score.current + " - " + match.away_score.current;
			centerDiv.appendChild(score);
		}
		centerDiv.appendChild(vs);
		matchInner.appendChild(centerDiv);
		var atEl = document.createElement("div");
		var atLogo = document.createElement("img");
		var atName = document.createElement("p");
		atLogo.src = awayTeam.logo;
		atName.textContent = awayTeam.name;
		atEl.appendChild(atLogo);
		atEl.appendChild(atName);
		matchInner.appendChild(atEl);
		matchEl.appendChild(matchOuter);
		matchEl.appendChild(matchInner);
		document.getElementById("nextMatches").appendChild(matchEl);
	}
	
	var scrollMatchesIndex = 0;
	
	function getSMI(e) {
		var matches = document.querySelectorAll("#nextMatches > li");
		var ulWidth = document.querySelector("#nextMatches").offsetWidth;
		for (var i = 0; i < matches.length; i++) {
			if (matches[i].getBoundingClientRect().left > 0) {
				if (ulWidth - matches[i].getBoundingClientRect().left < matches[i].getBoundingClientRect().left - 15) {
					return (e == -1) ? i : i - 1;
				} else if (matches[i].getBoundingClientRect().width > ulWidth - matches[i].getBoundingClientRect().left) {
					return (e == -1) ? i : i - 1;
				} else {
					return i;
				}
				break;
			}
		}
	}
	
	function scrollMatches(i) {
		if (i == 0) {
			scrollMatchesIndex = scrollMatchesIndex + i;
		} else {
			scrollMatchesIndex = getSMI(i) + i;
		}
		var elemWidth = document.querySelector("#nextMatches > li").getBoundingClientRect().width;
		document.getElementById("nextMatches").scrollLeft = scrollMatchesIndex * (elemWidth + 15);
	}
	
	var parser = new DOMParser();
	var url = "https://tipsscore.com/en/football/team/real-madrid";
	fetch(corsProxy + url)
		.then(response => response.text())
		.then(response => {
			var dict = [];
			var html = parser.parseFromString(response, "text/html");
			var matches = html.querySelectorAll(".event");
			matches.forEach((match, key, arr) => {
				var md = match.querySelector(".initialism").title;
				var day = md.split("-")[0];
				var month = md.split("-")[1];
				var year = md.split("-")[2].split(" ")[0];
				var time = md.split(" ")[1].replace(/ UTC/, ":00");
				var date = year + "-" + month + "-" + day + "T" + time
				var parsedDate = new Date(Date.parse(date));
				var match_url = match.querySelector("a.text-body").href;
				fetch(corsProxy + match_url)
					.then(response => response.text())
					.then(response => {
						var html = parser.parseFromString(response, "text/html");
						var home_team = html.querySelector(".order-0 .text-primary").textContent.trim();
						var away_team = html.querySelector(".order-1 .text-primary").textContent.trim();
						var leagueElem = html.querySelector(".order-0").parentNode.parentNode.children[0].children[2];
						var league = leagueElem.textContent.trim();
						var home_logo = html.querySelector(".order-0 img").src.trim();
						var away_logo = html.querySelector(".order-1 img").src.trim();
						try {
							var score = html.title.split("(")[1].split(")")[0];
							var home_score = score.split("-")[0];
							var away_score = score.split("-")[1];
						} catch (error) {
							var home_score = "";
							var away_score = "";
						}
						
						dict.push({
							home_team: {
								name: home_team,
								logo: home_logo
							},
							away_team: {
								name: away_team,
								logo: away_logo
							},
							start_at: parsedDate,
							league: {
								name: league
							},
							home_score: {
								current: home_score
							},
							away_score: {
								current: away_score
							}
						});
						if (key === arr.length - 1) {
							dict.sort((a, b) => a.start_at - b.start_at);
							dict.forEach(match => {
								var matchDate = new Date(Date.parse(match.start_at));
								var dateNow = new Date();
								if (matchDate > dateNow) {
									addMatch(match, true);
								} else {
									addMatch(match, false);
									scrollMatchesIndex += 1;
								}
							});
							document.querySelector(".outerNextUp").style.display = "block";
							scrollMatches(0);
							var rm = document.createElement("div");
							rm.setAttribute("class", "matchesMargin");
							document.getElementById("nextMatches").appendChild(rm);
						}
					})
					.catch(err => {
						document.querySelector(".outerNextUp").style.display = "none";
					});
			});
		})
		.catch(err => {
			document.querySelector(".outerNextUp").style.display = "none";
		});

	document.querySelectorAll(".imgGallery > li > img").forEach(elem => {
		elem.classList.add("imgScale");
		elem.addEventListener("click", function() {
			showImg(this);
		});
	});
	
	stadiumVid.addEventListener("loadedmetadata", function() {
		["mousemove", "click"].forEach(event => {
			stadiumVid.addEventListener(event, function() {
				this.play();
			});
		});
	});
	
	stadiumVid.addEventListener("ended", function() {
	    this.load();    
	}, false);
}

function toggleQuiz() {
	var quiz = document.querySelector(".outerQuiz > div");
	var title = document.querySelector(".outerQuiz > h1");
	if (window.getComputedStyle(quiz).display === "block") {
	    quiz.style.display = "none";
		title.innerHTML = 'Quiz <ion-icon title="" name="chevron-down-outline"></ion-icon>';
	} else {
		quiz.style.display = "block";
		title.innerHTML = 'Quiz <ion-icon title="" name="chevron-up-outline"></ion-icon>';
	}
}

function evalQuiz() {
	var ucl = parseInt(document.querySelector('input[name = "ucl"]:checked').value);
	var founder = parseInt(document.querySelector('input[name = "founder"]:checked').value);
	var player = parseInt(document.querySelector('input[name = "player"]:checked').value);
	var hymn = parseInt(document.querySelector('input[name = "hymn"]:checked').value);
	var derby = parseInt(document.querySelector('input[name = "derby"]:checked').value);
	var result = ucl + founder + player + hymn + derby;
	document.getElementById("evalBtn").style.display = "none";
	document.querySelectorAll(".quizWrap input").forEach(elem => {
		elem.disabled = true;
	});
	document.querySelectorAll(".labelContainer input:checked").forEach(input => {
		if (input.value != 0) {
			input.parentNode.getElementsByTagName("span")[0].style.backgroundColor = "green";
		} else {
			input.parentNode.getElementsByTagName("span")[0].style.backgroundColor = "red";
		}
	});
	document.querySelectorAll(".labelContainer input").forEach(input => {
		if (input.value != 0) {
			input.parentNode.getElementsByTagName("span")[0].style.backgroundColor = "green";
		}
	});
	var resultElem = document.getElementById("results");
	var taglines = ["You aren't a Real Madrid fan!", "You are out of practice!", "You know quite something about Real Madrid!", "You are a good Madrid fan!", "You are a huge Madrid fan!", "You are a true Madridista!"]
	var tagline;
	if (result == 0) {
		tagline = taglines[0];
	} else if (result == 20) {
		tagline = taglines[1];
	} else if (result == 40) {
		tagline = taglines[2];
	} else if (result == 60) {
		tagline = taglines[3];
	} else if (result == 80) {
		tagline = taglines[4];
	} else if (result == 100) {
		tagline = taglines[5];
	}
	(result < 50) ? resultElem.style.color = "red" : resultElem.style.color = "green";
	resultElem.innerHTML = "Correctly answered: " + result + "%<br>" + tagline;
}
