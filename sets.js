class CardSet {

	constructor(player) {
		this.cards = []
		this.player = player || null	
	}

	shuffle() {
		var set2 = []
		while (this.cards.length > 0) {
			var i = Utils.randInt(0, this.cards.length - 1)
			var c = this.cards[i]
			set2.push(c)
			this.cards.splice(i, 1)
		}
		this.cards = set2
	}

	addCard(c) {
		this.cards.push(c)
	}
	
	// array like methods
	push(c) {
		this.addCard(c)
	}

	splice(index, qty) {
		this.cards.splice(index, qty || 1)
	}

	length() {
		return this.cards.length
	}


}


class PlaySet extends CardSet{

	// get all active modifiers from the playSets
	// It avoids overlapping effects of the same card name/type
	getModifierCards() {
		var mods = []
		var p = this.player
		var comboCheck = []
		this.cards.forEach(function(c) {
			if (c.modifier) {
				if (c.modCombo || !comboCheck.includes(c.name)) {
					comboCheck.push(c.name)
					mods.push(c)
				}

			}
		})
		return mods;
	}

}