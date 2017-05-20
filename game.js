// List of instantiable classes
const classes = {
	Mercenary,
	Bishop,
	Heroine,
	Drummer,
	Spy,
	Spring,
	Winter,
	Surrender,
	Scarecrow,
}
function getClass(name) { return classes[name] }

const deck = new CardSet()
const discardDeck = new CardSet()
var players = []
var cPlayerIndex //currentPlayer Index
var cPlayer  // currentPlayer

var phase = "PICK_CARD"
// other phases : "SHOW CARD", "PLAY_CARD", "PICK_OPPONENT_CARD", "END_TURN"

var gameSet = {
	"Mercenary" : [
			["10", "6"],
			["10", "5"],
			["10", "4"],
			["10", "3"],
			["10", "2"],
			["10", "1"],
			["8", "10"]
		],
	"Heroine"   : ["3"],
	"Bishop"    : ["6"],
	// "Drummer"   : ["6"],
	"Drummer"   : ["24"],
	"Scarecrow" : ["16"],
	"Surrender" : ["3"],
	"Spy"       : ["12"],
	"Spring"    : ["3"],
	"Winter"    : ["3"]
}

function start() {
	initDeck()
	deck.shuffle()
	var p1 = new Player("Me")
	var p2 = new Player("Tesla")
    players = [p1, p2]
    currentPlayerIndex = Utils.randInt(0, 1)
	cPlayer = players[currentPlayerIndex]
	console.log("Starting player will be " + cPlayer.name)
	gameStartGiveCards()
	gameStartPlay()
}

function gameStartPlay() {
	refreshDecks()
	setTimeout(function() { runGame() }, 200)
}

function refreshDecks() {
	showDeck(deck, "fullDeck")
	showDeck(discardDeck, "discardDeck")
	for (pi in players) {
		showPlayerDeck(pi, "handSet")
		showPlayerDeck(pi, "playSet")
	}
}

function gameEndTurn() {
	console.log("End Turn")
	// Calculate points
	goNextPlayer()
	phase = "PICK_CARD"

}

function runGame() {

	cPlayer.run()
	switch(phase) {
		case "PICK_CARD":
// console.log("chosen card" + cPlayer.getChosenCard())
			if (cPlayer.getChosenCard() != null) {
				phase = "SHOW_CARD"
			}
			break
		case "SHOW_CARD":
			if (cPlayer.cardIsPlayed) {
				phase = "PLAYING_CARD"
			}
			break
		case "PLAYING_CARD":
			cPlayer.getChosenCard().run()
		case "PICK_OPPONENT_CARD":
			break
		case "END_PLAY_CARD":
			phase = "END_TURN"
			break
		case "END_TURN":
			calculatePoints()
			showPoints()
			gameEndTurn()
			if (gameEndConditions()) {
				console.log("The game has ended")
				phase = "END_GAME"
			}
			break
		case "END_GAME":
			break
	}

	refreshDecks()

	if (phase != "END_GAME") {
		setTimeout(function() { runGame() }, 30)
	}
}


function getAllActiveModifierCards() {
	var mods = []
	players.forEach(function(p) {
		mods = mods.concat(p.playSet.getModifierCards())
	})
	return mods
}

function calculatePoints() {
	players.forEach(function(p) {
		var tp = 0
		p.playSet.cards.forEach(function (c) {
			tp += c.getFinalValue()
		})
		p.points = tp
	})
}

function showPoints() {
	var i = 1
	players.forEach(function(p) {
		$("#player" + i + "-points").html(p.points)
		i++
	})
}

function gameEndConditions() {
	var endGame = true
	players.forEach(function(p) {
// console.log("Current Player: " + p.name + " hasPassed = " + p.hasPassed + " handSetSize = " + p.handSet.length)
		if (!p.hasPassed  && p.handSet.length() > 0) {
			endGame = false
		}
	})
	return endGame
}

function goNextPlayer() {
	currentPlayerIndex = (currentPlayerIndex + 1) % players.length
	cPlayer = players[currentPlayerIndex]
	return cPlayer
}

function initDeck() {
	for (var ct in gameSet) {
		console.log(ct)
		if (ct == "Mercenary") {
			var mercSet = gameSet[ct]
			for (var j in mercSet) {
				var qta = parseInt(mercSet[j][0])
				var val = parseInt(mercSet[j][1])
				for (var i = 0; i < qta; i++) {
					deck.push(new Mercenary(val))
				}
			}
		}else {
			var qta = parseInt(gameSet[ct][0])
			for (var i = 0; i < qta; i++) {
				deck.push(new (getClass(ct))()) 
			}
		}
	}
}
// function shuffle2(set) {
// 	// choose 2 cards and swap them for a number of times
// 	for (var i = 0; i < 1000; i++) {
// 		var i1 = Utils.randInt(0, set.length - 1)
// 		var i2 = Utils.randInt(0, set.length - 1)
// 		var tc = set[i1]
// 		set[i1] = set[i2]
// 		set[i2] = tc
// 	}
// 	return set
// }

function htmlListCards(set, id, inPlay=false) {
	var t = ""
	for (var ci in set.cards) {
		var c = set.cards[ci]
		var cname = c.short ? c.short : c.name
		var fvalue = inPlay ? c.getFinalValue() : c.value
		var styleValue = ""
		if (c.value < fvalue) {
			styleValue = "better"
		}  
		if (c.value > fvalue) {
			styleValue = "worse"
		}
		var htmlValue = "-" + fvalue
		if (fvalue == c.value && c.value == 0) {
			htmlValue = ""
		}
		t += "<div class='cssCard'>" + cname + "<span class='" + styleValue + "'>" + htmlValue + "-" + c.value + "</span></div>"
		// t += "<span>[" + cname + "<strong>" + (c.value != 0 ? "(" + c.value + ")" : "") + "</strong>]</span>"
	}
	$("#" + id).html(t)
}

function showDeck(deck, dt="fullDeck") {
	htmlListCards(deck, dt)
}

function showPlayerDeck(pIndex, dt="handSet") {
	htmlListCards(players[pIndex][dt], "player" + (parseInt(pIndex) + 1) + "-" + dt, dt == 'playSet')
}

function gameStartGiveCards() {
	// 10 cards per player
	for (var pi in players) {
		var p = players[pi]
		giveCards(10, p)
	}
}

/** 
 * Moves some cards from the main deck to the player handSet
 */
function giveCards(qta, p) {
	for (var i = 0; i < qta; i++) {
		giveCard(p)
	}
}

function giveCard(p) {
	var c = moveRandomCard(deck, p.handSet)
	c.owner = p

}

function moveCard(set1, set2, index) {
	var c = set1.cards[index]
	set2.push(c)
	set1.splice(index, 1)
	return c	
}

function moveRandomCard(set1, set2) {
	var i1 = Utils.randInt(0, set1.length() - 1)
	return moveCard(set1, set2, i1)
}

/**
 * Get a card from a set without removing it from the set.
 */
function getRandomCard(set) {
	var cards = set.cards
	return cards[Utils.randInt(0, cards.length - 1)]
}


function htmlInit() {

	// ExpandBox
	$(".expandBox").each(function() {
		$(this).addClass("hidden")
		var id = this.id
		var title = this.dataset.title
		var preEl = "<div><small><span class='expandBoxSwitch' data-ref='" + id + "'>" + title + "</small></div>"
		$(preEl).insertBefore(this)
	})
	$(".expandBoxSwitch").each(function() {
		$(this).css("cursor", "pointer")
		$(this).html("[+]" + $(this).html())
	})
	$(".expandBoxSwitch").click(function() {
		var o = $("#" + this.dataset.ref)
		o.toggleClass("hidden")
		var plusMinus = o.hasClass("hidden") ? "+" : "-"
		$(this).html("[" +  plusMinus + "]" + $(this).html().substring(3))
	})

}




Utils = {
	randInt: function(min, max) {
		var rnd = min + Math.random() * (max - min)
		return Math.round(rnd)
	}
}

function clog(n, v) {
	console.log(n + ": " + v)
}




