Card = function(n, v, a, desc) {
	this.name = n 
    this.value = v
    this.affected = a
    this.desc = desc
    this.run = function() {
    	// As simple as possible
        // TODO : logic to put card in the table shouldn't be here
    	this.putOnTable()
    	this.end()
    }

    this.putOnTable = function() {
    	console.log(cPlayer.name + " is playing a " + this.name + " card.")
    	var cp = cPlayer
    	moveCard(cp.handSet, cp.playSet, cp.chosenCardIndex)
    	// cp.chosenCardIndex = null

    }
    this.end = function() {
    	phase = "END_PLAY_CARD"
    }
}

Mercenary = function(v) {
    this.short = "M"
	Card.call(this, "Mercenary", v, true, "Mercenary desc")
}

// Define 1,2,3,4,5,6,10 values mercenary cards


Bishop = function() {
	Card.call(this, "Bishop", 0, false, "Bishop Desc")
}

Heroine = function() {
	Card.call(this, "Heroine", 10, false, "Heroine Desc")
}

Drummer = function() {
	Card.call(this, "Drummer", 0, false, "Drummer Desc")
}

Spy = function() {
	Card.call(this, "Spy", 1, false, "Spy Desc")
}

Spring = function() {
	Card.call(this, "Spring", 0, false, "Spring Desc")
}

Winter = function() {
	Card.call(this, "Winter", 0, false, "Winter Desc")
}

Surrender = function() {
	Card.call(this, "Surrender", 0, false, "Surrender Desc")
}

Scarecrow = function() {
	Card.call(this, "Scarecrow", 0, false, "Scarecrow Desc")
}
