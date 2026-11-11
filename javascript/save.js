// ============================================================
// save-manager.js
// Slaat je voortgang op in de browser (localStorage) en
// haalt hem weer terug als je de pagina opent.
// ============================================================

class SaveManager {
    constructor(game) {
        this.game = game;
        this.saveKey = "cookieClickerSave";   // naam waaronder het opgeslagen wordt
    }

    // Slaat alles op. Geeft true terug als het gelukt is.
    save() {
        try {
            const game = this.game;
            const data = {
                cookies: game.cookies,
                currentTheme: game.themeManager.current,
                unlockedThemes: game.themeManager.list.map((theme) => theme.unlocked),
                units: game.units.map((unit) => ({ name: unit.name, owned: unit.owned })),
                upgrades: game.upgrades.map((upgrade) => ({ name: upgrade.name, level: upgrade.level }))
            };
            // localStorage kan alleen tekst opslaan, daarom JSON.stringify
            localStorage.setItem(this.saveKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error("Opslaan mislukt:", error);
            return false;
        }
    }

    // Haalt de opgeslagen voortgang terug (als die er is)
    load() {
        try {
            const raw = localStorage.getItem(this.saveKey);
            if (!raw) return;                       // niks opgeslagen: begin opnieuw

            const game = this.game;
            const data = JSON.parse(raw);           // tekst terug naar een object

            // Koekjes
            game.cookies = Number(data.cookies) || 0;

            // Thema's: welke zijn open en welke is gekozen
            (data.unlockedThemes || []).forEach((unlocked, index) => {
                const theme = game.themeManager.list[index];
                if (theme && unlocked) theme.unlocked = true;
            });
            const savedTheme = game.themeManager.list[data.currentTheme];
            game.themeManager.current = savedTheme && savedTheme.unlocked ? data.currentTheme : 0;

            // Gebouwen: aantal terugzetten en de prijs opnieuw uitrekenen
            (data.units || []).forEach((saved) => {
                const unit = game.units.find((item) => item.name === saved.name);
                if (unit) {
                    unit.owned = Number(saved.owned) || 0;
                    unit.cost = Math.round(unit.baseCost * 1.8 ** unit.owned);
                }
            });

            // Upgrades: level terugzetten, prijs uitrekenen en het effect opnieuw toepassen
            (data.upgrades || []).forEach((saved) => {
                const upgrade = game.upgrades.find((item) => item.name === saved.name);
                if (!upgrade) return;
                upgrade.level = Number(saved.level) || 0;
                upgrade.cost = Math.round(upgrade.baseCost * 1.5 ** upgrade.level);
                for (let i = 0; i < upgrade.level; i++) upgrade.effect();
            });
        } catch (error) {
            console.error("Laden mislukt:", error);
            localStorage.removeItem(this.saveKey);   // kapotte opslag weggooien
        }
    }

    // Wist de opgeslagen voortgang (voor de reset-knop)
    clear() {
        localStorage.removeItem(this.saveKey);
    }
}