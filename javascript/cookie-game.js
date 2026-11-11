

class CookieGame {
    constructor() {
       
        this.cookies = 0;
        this.cookiesPerClick = 1;
        this.isResetting = false;          

       
        this.units = createUnits();
        this.upgrades = createUpgrades(this);

       
        this.themeManager = new ThemeManager(this);
        this.saveManager = new SaveManager(this);
        this.ui = new GameUI(this);

       
        this.saveManager.load();           //
        this.themeManager.apply();         // gekozen thema aanzetten
        this.ui.bindEvents();              // knoppen laten werken
        this.update();                     // scherm voor het eerst tekenen

        // --- Timers ---
        setInterval(() => this.tick(), 1000);                    // elke seconde: productie
        setInterval(() => this.saveManager.save(), 10000);       // elke 10 seconden: opslaan
        window.addEventListener("beforeunload", () => {          // pagina sluiten: opslaan
            if (!this.isResetting) this.saveManager.save();
        });
    }

    // ---------- Acties ----------

    // Je klikt op de koek
    clickCookie(event) {
        this.cookies += this.cookiesPerClick;
        this.updateCounters();
        this.ui.showFloatingEffect(event);
    }

    // Wordt elke seconde uitgevoerd: koekjes van de gebouwen erbij
    tick() {
        this.cookies += this.totalCps;
        this.updateCounters();
        this.ui.renderShops();
    }

    // Vraagt of je zeker weet dat je opnieuw wilt beginnen
    resetGame() {
        if (!confirm("Weet je zeker dat je opnieuw wilt beginnen?")) return;

        this.isResetting = true;
        try {
            this.saveManager.clear();
        } catch (error) {
            this.isResetting = false;
            console.error("Resetten mislukt:", error);
            alert("Je voortgang kon niet worden gewist. Probeer het opnieuw.");
            return;
        }
        location.reload();   // pagina opnieuw laden = beginnen bij 0
    }

    // ---------- Effecten van upgrades ----------

    // Maakt één soort gebouw sterker (bijv. Grandma x2)
    multiplyUnit(name, factor) {
        const unit = this.units.find((unit) => unit.name === name);
        if (unit) unit.cps *= factor;
    }

    // Maakt alle gebouwen sterker (bijv. +10% = factor 1.1)
    multiplyAllUnits(factor) {
        this.units.forEach((unit) => unit.cps *= factor);
    }

    // ---------- Berekenen ----------

    // Totaal aantal koekjes per seconde van alle gebouwen samen
    get totalCps() {
        return this.units.reduce((total, unit) => total + unit.totalCps, 0);
    }

    // ---------- Scherm verversen ----------

    // Alleen de tellers verversen en kijken of er een thema open gaat
    updateCounters() {
        this.ui.showCounters();
        this.themeManager.checkUnlock();
    }

    // Alles verversen: tellers, winkel en overzicht
    update() {
        this.updateCounters();
        this.ui.renderShops();
        this.ui.renderOverview();
    }
}