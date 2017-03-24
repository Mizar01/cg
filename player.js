function Player(name) {
	this.name = name
	this.handSet = []   // cards player holds in his hands
	this.playSet = []   // cards already played and in game on the table

	this.chosenCardIndex
	this.playCard = false

	this.ai = true
	this.aiFakeTime = 20
	this.timeRatio = 0.1

	this.hasPassed = false

	this.points = 0

	this.run = function() {
		if (this.ai && this.aiFakeTrigger()) {
console.log("player " + this.name + " is at phase " + phase)
			// TODO : the switch should only be for ai actions. Everything decided by 
			// the game rules should not be here.
			switch(phase) {
				case "PICK_CARD":
					this.chooseRandomCard()
					break;
				case "SHOW_CARD":
					this.play()
					break
				case "END_PLAY_CARD":
					this.reset()
					break
			}
		}
	}

	this.aiFakeTrigger=function() {
		if (this.aiFakeTime <= 0) {
			this.aiFakeTime = 10 + Utils.randInt(100, 200) * this.timeRatio
			return true
		}else {
			this.aiFakeTime--
			return false
		}

	}
	this.chooseRandomCard = function() {
		this.chosenCardIndex = Utils.randInt(0, this.handSet.length - 1)
	}

	this.getChosenCard = function() {
		return this.handSet[this.chosenCardIndex]
	}

	this.play = function() {
		this.cardIsPlayed = true
	}

	this.reset = function() {
		this.chosenCardIndex = null
		this.cardIsPlayed = false
	}




}