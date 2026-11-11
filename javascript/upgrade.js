// ============================================================
// upgrade.js
// Een upgrade uit het tabblad "Upgrades".
// Bij het kopen wordt de "effect"-functie uitgevoerd.
// ============================================================

class Upgrade {
    constructor(name, cost, description, effect) {
        this.name = name;            // naam van de upgrade
        this.baseCost = cost;        // startprijs
        this.cost = cost;            // huidige prijs
        this.description = description;  // korte tekst, bijv. "Grandmas x2"
        this.effect = effect;        // functie die iets verandert in het spel
        this.level = 0;              // hoe vaak je hem gekocht hebt
    }

    // Probeert deze upgrade te kopen. Geeft true terug als het gelukt is.
    buy(game) {
        if (game.cookies < this.cost) return false;   // te weinig koekjes

        game.cookies -= this.cost;                    // betalen
        this.level++;                                 // level omhoog
        this.cost = Math.round(this.baseCost * 1.5 ** this.level);  // 50% duurder
        this.effect();                                // de bonus activeren
        return true;
    }
}