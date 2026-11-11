

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

       
        this.saveManager.load();          
        this.themeManager.apply();         
        this.ui.bindEvents();           
        this.update();

        setInterval(() => this.tick(), 1000);                    
        setInterval(() => this.saveManager.save(), 10000);      
        window.addEventListener("beforeunload", () => {          
            if (!this.isResetting) this.saveManager.save();
        });
    }


    clickCookie(event) {
        this.cookies += this.cookiesPerClick;
        this.updateCounters();
        this.ui.showFloatingEffect(event);
    }

    tick() {
        this.cookies += this.totalCps;
        this.updateCounters();
        this.ui.renderShops();
    }

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
        location.reload();  
    }

    multiplyUnit(name, factor) {
        const unit = this.units.find((unit) => unit.name === name);
        if (unit) unit.cps *= factor;
    }

    multiplyAllUnits(factor) {
        this.units.forEach((unit) => unit.cps *= factor);
    }

    get totalCps() {
        return this.units.reduce((total, unit) => total + unit.totalCps, 0);
    }

    updateCounters() {
        this.ui.showCounters();
        this.themeManager.checkUnlock();
    }

    update() {
        this.updateCounters();
        this.ui.renderShops();
        this.ui.renderOverview();
    }
}
