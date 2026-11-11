// ============================================================
// production-unit.js
// Een "gebouw" uit de winkel (Pointer, Grandma, Farm, ...).
// Elk gebouw maakt automatisch koekjes per seconde.
// ============================================================

class ProductionUnit {
    constructor(name, baseCost, cps) {
        this.name = name;          // naam, bijv. "Pointer"
        this.baseCost = baseCost;  // startprijs
        this.cost = baseCost;      // huidige prijs (wordt duurder bij elke aankoop)
        this.cps = cps;            // koekjes per seconde van 1 gebouw
        this.owned = 0;            // hoeveel je er hebt
    }

    // Probeert dit gebouw te kopen. Geeft true terug als het gelukt is.
    buy(game) {
        if (game.cookies < this.cost) return false;   // te weinig koekjes

        game.cookies -= this.cost;                    // betalen
        this.owned++;                                 // je hebt er één meer
        this.cost = Math.round(this.baseCost * 1.8 ** this.owned);  // 80% duurder
        return true;
    }

    // Koekjes per seconde van alle gebouwen van dit soort samen
    get totalCps() {
        return this.cps * this.owned;
    }
}