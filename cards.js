class Card {

    constructor(n, v, canBeAffected, desc) {
    	this.name = n 
        this.value = v
        this.canBeAffected = canBeAffected
        this.otherEffects = [] //Effects not caused by other cards currently played
        this.desc = desc
        this.modifierComboEnabled = false // the effect cannot be generally combined with other cards of the same type
        this.owner = null
        this.modCombo = false // there can't be more than one card of the same type and player as modifier (good or bad)
    }

    run() {
    	// As simple as possible
        // TODO : logic to put card in the table shouldn't be here
    	this.putOnTable()
    	this.end()
    }

    putOnTable() {
    	console.log(cPlayer.name + " is playing a " + this.name + " card.")
    	var cp = cPlayer
    	moveCard(cp.handSet, cp.playSet, cp.chosenCardIndex)
    	// cp.chosenCardIndex = null

    }

    end() {
    	phase = "END_PLAY_CARD"
    }

    getFinalValue() {
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

    applyEffect(value, modifier) {
        var name = modifier.split(",")[0]
        var factor = modifier.split(",")[1]
        if (name == "mult") {
            return value * factor;
        }
    }

}

class Mercenary extends Card {
    constructor(v) {
        super("Mercenary", v, true, "Mercenary desc")
        this.short = "M"
    }
}

class Bishop extends Card {
    constructor() {
	   super("Bishop", 0, false, "Bishop Desc")
    }
}

class Heroine extends Card {
    constructor() {
	   super("Heroine", 10, false, "Heroine Desc")
    }
}

class Drummer extends Card {
    constructor() {
	   super("Drummer", 0, false, "Drummer Desc")
    }
    // Double the strength of all your mercenary cards
    modifier(targetCard, currentValue) {
        if (targetCard.owner.name == this.owner.name) {
            return currentValue * 2
        } else {
            return currentValue
        }
    }
}

class Spy extends Card {
    constructor() {
	   super("Spy", 1, false, "Spy Desc")
    }
}

class Spring extends Card {
    constructor() {
	   super("Spring", 0, false, "Spring Desc")
    }
}

class Winter extends Card {
    constructor() {
	   super("Winter", 0, false, "Winter Desc")
    }
}

class Surrender extends Card {
    constructor() {
	   super("Surrender", 0, false, "Surrender Desc")
    }
}

class Scarecrow extends Card {
    constructor() {
	   super("Scarecrow", 0, false, "Scarecrow Desc")
    }
}
