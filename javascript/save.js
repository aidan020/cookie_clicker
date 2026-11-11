class SaveManager {
    constructor(game) {
        this.game = game;
        this.saveKey = "cookieClickerSave";  
    }

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
    
            localStorage.setItem(this.saveKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error("Opslaan mislukt:", error);
            return false;
        }
    }

    load() {
        try {
            const raw = localStorage.getItem(this.saveKey);
            if (!raw) return;                     

            const game = this.game;
            const data = JSON.parse(raw);          

            game.cookies = Number(data.cookies) || 0;

            (data.unlockedThemes || []).forEach((unlocked, index) => {
                const theme = game.themeManager.list[index];
                if (theme && unlocked) theme.unlocked = true;
            });
            const savedTheme = game.themeManager.list[data.currentTheme];
            game.themeManager.current = savedTheme && savedTheme.unlocked ? data.currentTheme : 0;

            (data.units || []).forEach((saved) => {
                const unit = game.units.find((item) => item.name === saved.name);
                if (unit) {
                    unit.owned = Number(saved.owned) || 0;
                    unit.cost = Math.round(unit.baseCost * 1.8 ** unit.owned);
                }
            });

            (data.upgrades || []).forEach((saved) => {
                const upgrade = game.upgrades.find((item) => item.name === saved.name);
                if (!upgrade) return;
                upgrade.level = Number(saved.level) || 0;
                upgrade.cost = Math.round(upgrade.baseCost * 1.5 ** upgrade.level);
                for (let i = 0; i < upgrade.level; i++) upgrade.effect();
            });
        } catch (error) {
            console.error("Laden mislukt:", error);
            localStorage.removeItem(this.saveKey);  
        }
    }


    clear() {
        localStorage.removeItem(this.saveKey);
    }
}
