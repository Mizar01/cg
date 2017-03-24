var deck = []
var discardDeck = []
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
	"Drummer"   : ["6"],
	"Scarecrow" : ["16"],
	"Surrender" : ["3"],
	"Spy"       : ["12"],
	"Spring"    : ["3"],
	"Winter"    : ["3"]
}

function start() {
	initDeck()
	deck = shuffle(deck)
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


function calculatePoints() {
	players.forEach(function(p) {
		var tp = 0
		p.playSet.forEach(function (c) {
			tp += c.value
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
		if (!p.hasPassed  && p.handSet.length > 0) {
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
				deck.push(new window[ct]()) 
			}
		}
	}
}
function shuffle2(set) {
	// choose 2 cards and swap them for a number of times
	for (var i = 0; i < 1000; i++) {
		var i1 = Utils.randInt(0, set.length - 1)
		var i2 = Utils.randInt(0, set.length - 1)
		var tc = set[i1]
		set[i1] = set[i2]
		set[i2] = tc
	}
	return set
}

function shuffle(set) {
	var set2 = []
	while (set.length > 0) {
		moveRandomCard(set, set2)
	}
	return set2
}

function htmlListCards(set, id) {
	var t = ""
	for (var ci in set) {
		var c = set[ci]
		var cname = c.short ? c.short : c.name
		var cvalue = c.value != 0 ? "(" + c.value + ")" : ""
		t += "<div class='cssCard'>" + cname + cvalue + "</div>"
		// t += "<span>[" + cname + "<strong>" + (c.value != 0 ? "(" + c.value + ")" : "") + "</strong>]</span>"
	}
	$("#" + id).html(t)
}

function showDeck(deck, dt="fullDeck") {
	htmlListCards(deck, dt)
}

function showPlayerDeck(pIndex, dt="handSet") {
	htmlListCards(players[pIndex][dt], "player" + (parseInt(pIndex) + 1) + "-" + dt)
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
	moveRandomCard(deck, p.handSet)
}

function moveCard(set1, set2, index) {
	set2.push(set1[index])
	set1.splice(index, 1)	
}

function moveRandomCard(set1, set2) {
	var i1 = Utils.randInt(0, set1.length - 1)
	moveCard(set1, set2, i1)
}

/**
 * Get a card from a set without removing it from the set.
 */
function getRandomCard(set) {
	return set[Utils.randInt(0, set.length - 1)]
}


function htmlInit() {
	$(".expandBox").each(function() {
		$(this).css("cursor", "pointer")
		$(this).html("[+]" + $(this).html())
	})	
	$(".expandBox").click(function() {
		$("#" + this.dataset.ref).toggleClass("hidden")
		$(this).html("[-]" + $(this).html().substring(3))
	})
}




Utils = {
	randInt: function(min, max) {
		var rnd = min + Math.random() * (max - min)
		return Math.round(rnd)
	}
}




