Card = function(n, v, canBeAffected, desc) {
	this.name = n 
    this.value = v
    this.canBeAffected = canBeAffected
    this.otherEffects = [] //Effects not caused by other cards currently played
    this.desc = desc
    this.modifier = null // function affecting the entire playSet
    this.modifierComboEnabled = false // the effect cannot be generally combined with other cards of the same type
    this.owner = null
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

    this.getFinalValue = function() {
        var v = this.value
        // special card effects
        for (var e in this.otherEffects) {
            v = this.applyEffect(v, e)
        }
        if (this.canBeAffected) {
            var targetCard = this
            getAllActiveModifierCards().forEach(function(mCard) {
                v = mCard.modifier(targetCard, v)
            })
        }
        return v
    }

    this.applyEffect = function(value, modifier) {
        var name = modifier.split(",")[0]
        var factor = modifier.split(",")[1]
        if (name == "mult") {
            return value * factor;
        }
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
    // Double the strength of all your mercenary cards
    this.modifier = function(targetCard, currentValue) {
        if (targetCard.owner.name == this.owner.name) {
            return currentValue * 2
        } else {
            return currentValue
        }
    }
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
