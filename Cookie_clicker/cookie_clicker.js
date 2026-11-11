class ProductionUnit {
    constructor(name, baseCost, cps) {
        this.name = name;
        this.baseCost = baseCost;
        this.cost = baseCost;
        this.cps = cps;
        this.owned = 0;
    }
 
    buy(game) {
        if (game.cookies < this.cost) return false;
        game.cookies -= this.cost;
        this.owned++;
        this.cost = Math.round(this.baseCost * 1.8 ** this.owned);
        return true;
    }
 
    get totalCps() {
        return this.cps * this.owned;
    }
}
 
class Upgrade {
    constructor(name, cost, description, effect) {
        this.name = name;
        this.baseCost = cost;
        this.cost = cost;
        this.description = description;
        this.effect = effect;
        this.level = 0;
    }
 
    buy(game) {
        if (game.cookies < this.cost) return false;
        game.cookies -= this.cost;
        this.level++;
        this.cost = Math.round(this.baseCost * 1.5 ** this.level);
        this.effect();
        return true;
    }
}
 
class CookieGame {
    constructor() {
        this.saveKey = "cookieClickerSave";
        this.isResetting = false;
        this.cookies = 0;
        this.cookiesPerClick = 1;
        this.units = [
            new ProductionUnit("Pointer", 15, 1),
            new ProductionUnit("Grandma", 100, 2.5),
            new ProductionUnit("Farm", 500, 4),
            new ProductionUnit("Mine", 1500, 8),
            new ProductionUnit("Factory", 4000, 15),
            new ProductionUnit("Bank", 8000, 30),
            new ProductionUnit("Temple", 15000, 60),
            new ProductionUnit("Wizard Tower", 25000, 100)
        ];
 
        this.upgrades = [
            new Upgrade("Grandma's koekjesboek", 500, "Grandmas x2", () => this.multiplyUnit("Grandma", 2)),
            new Upgrade("Snellere pointers", 300, "Pointers x2", () => this.multiplyUnit("Pointer", 2)),
            new Upgrade("Betere zaden", 2000, "Farms x3", () => this.multiplyUnit("Farm", 3)),
            new Upgrade("Extra sterke klik", 1000, "Klikken geeft x2", () => { this.cookiesPerClick *= 2; }),
            new Upgrade("Efficiëntie overal", 5000, "Alle productie +10%", () => this.multiplyAllUnits(1.1))
        ];
 
        this.themes = [
            { name: "Groen", cssClass: "", image: "Gingerbread_man.jpg", unlockAt: 0, unlocked: true },
            { name: "Rode Elf", cssClass: "theme-red", image: "elf.png", unlockAt: 25000, unlocked: false }
        ];
        this.currentTheme = 0;
 
        this.cookieCount = document.getElementById("cookie-count");
        this.cpsCount = document.getElementById("cps-count");
        this.cookieTotal = document.getElementById("cookie-total");
        this.cpsTotal = document.getElementById("cps-total");
        this.clickTotal = document.getElementById("click-total");
        this.cookieImage = document.getElementById("cookie-img");
 
        this.loadGame();
        this.applyTheme();
        this.bindEvents();
        this.update();
        setInterval(() => this.tick(), 1000);
        setInterval(() => this.saveGame(), 10000);
        window.addEventListener("beforeunload", () => {
            if (!this.isResetting) this.saveGame();
        });
    }
 
    bindEvents() {
        document.getElementById("cookie-btn").addEventListener("click", (event) => {
            this.cookies += this.cookiesPerClick;
            this.updateDisplays();
            this.showFloatingEffect(event);
        });
 
        document.querySelectorAll(".tab-btn").forEach((button) => {
            button.addEventListener("click", () => this.showTab(button));
        });
 
        const saveButton = document.getElementById("save-btn");
        saveButton.addEventListener("click", () => {
            const saved = this.saveGame();
            saveButton.textContent = saved ? "Opgeslagen" : "Opslaan mislukt";
            window.setTimeout(() => {
                saveButton.textContent = "Opslaan";
            }, 1600);
        });
 
        const resetButton = document.getElementById("reset-btn");
        if (resetButton) resetButton.addEventListener("click", () => this.resetGame());
    }
 
    showTab(selectedButton) {
        document.querySelectorAll(".tab-btn").forEach((button) => {
            button.classList.toggle("active", button === selectedButton);
            button.setAttribute("aria-selected", button === selectedButton ? "true" : "false");
        });
        const tab = selectedButton.dataset.tab;
        document.getElementById("upgrades-panel").hidden = tab !== "upgrades";
        document.getElementById("overview-panel").hidden = tab !== "overview";
        document.getElementById("themes-panel").hidden = tab !== "themes";
    }
 
    showFloatingEffect(event) {
        const effect = document.createElement("div");
        effect.classList.add("float-effect");
        effect.textContent = "+" + this.formatNumber(this.cookiesPerClick);
        effect.style.left = event.clientX + "px";
        effect.style.top = event.clientY + "px";
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 800);
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
 
    formatNumber(value, decimalPlaces = 0) {
        const suffixes = ["K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];
        const absoluteValue = Math.abs(value);
        if (absoluteValue < 100000) return value.toFixed(decimalPlaces);
        let suffixIndex = Math.floor(Math.log10(absoluteValue) / 3) - 1;
        if (suffixIndex >= suffixes.length) return value.toExponential(1);
        let scaledValue = value / 10 ** (3 + suffixIndex * 3);
        if (Number(scaledValue.toFixed(1)) >= 1000) {
            suffixIndex++;
            if (suffixIndex >= suffixes.length) return value.toExponential(1);
            scaledValue = value / 10 ** (3 + suffixIndex * 3);
        }
        return scaledValue.toFixed(1).replace(/\.0$/, "") + suffixes[suffixIndex];
    }
 
    updateDisplays() {
        const cookies = this.formatNumber(Math.floor(this.cookies));
        const cps = this.formatNumber(this.totalCps, 1);
        const perClick = this.formatNumber(this.cookiesPerClick);
        this.cookieCount.textContent = cookies + " cookies";
        this.cpsCount.textContent = cps + " per seconde · " + perClick + " per klik";
        this.cookieTotal.textContent = cookies;
        this.cpsTotal.textContent = cps;
        this.clickTotal.textContent = perClick;
        this.checkThemeUnlock();
    }
 
    renderShop(items, listId, description, buyItem) {
        const list = document.getElementById(listId);
        list.innerHTML = "";
        const isProduction = listId === "production-list";
 
        items.forEach((item) => {
            const row = document.createElement("button");
            row.classList.add("shop-item");
            row.type = "button";
            row.disabled = this.cookies < item.cost;
            row.classList.toggle("is-affordable", !row.disabled);
            const priceLabel = `${this.formatNumber(item.cost)} koekjes`;
            row.setAttribute(
                "aria-label",
                row.disabled
                    ? `${item.name} kost ${priceLabel}; nog koekjes nodig`
                    : `Koop ${item.name} voor ${priceLabel}`
            );
 
            const icon = document.createElement("span");
            icon.classList.add("item-icon");
            icon.setAttribute("aria-hidden", "true");
            icon.textContent = item.name.charAt(0);
 
            const copy = document.createElement("span");
            copy.classList.add("item-copy");
            const name = document.createElement("strong");
            name.textContent = item.name;
            const detail = document.createElement("span");
            detail.textContent = description(item);
            copy.append(name, detail);
 
            const cost = document.createElement("span");
            cost.classList.add("item-cost");
            cost.textContent = priceLabel;
            const status = document.createElement("span");
            status.textContent = isProduction
                ? `bezit: ${this.formatNumber(item.owned)}`
                : row.disabled
                    ? "koekjes nodig"
                    : "NU KOPEN";
            cost.appendChild(status);
            row.append(icon, copy, cost);
            row.addEventListener("click", () => {
                if (buyItem(item)) {
                    this.update();
                    this.saveGame();
                }
            });
            list.appendChild(row);
        });
    }
 
    renderShops() {
        this.renderShop(this.units, "production-list", (unit) => `${this.formatNumber(unit.cps, 1)} /s`, (unit) => unit.buy(this));
        this.renderShop(this.upgrades, "upgrades-list", (upgrade) => upgrade.description, (upgrade) => upgrade.buy(this));
    }
 
    renderOverview() {
        const overview = document.getElementById("overview-list");
        overview.innerHTML = "";
        this.units.forEach((unit) => {
            const item = document.createElement("div");
            item.classList.add("overview-item");
            const name = document.createElement("span");
            name.textContent = unit.name;
            const bar = document.createElement("span");
            bar.classList.add("overview-bar");
            const fill = document.createElement("span");
            fill.style.width = `${Math.min(unit.owned * 10, 100)}%`;
            bar.appendChild(fill);
            const count = document.createElement("span");
            count.classList.add("overview-count");
            count.textContent = this.formatNumber(unit.owned);
            item.append(name, bar, count);
            overview.appendChild(item);
        });
 
        const boughtUpgrades = this.upgrades.filter((upgrade) => upgrade.level > 0);
        const upgradesOverview = document.getElementById("bought-upgrades-list");
        upgradesOverview.innerHTML = "";
        if (boughtUpgrades.length === 0) {
            upgradesOverview.textContent = "Nog geen upgrades gekocht";
            return;
        }
        boughtUpgrades.forEach((upgrade) => {
            const item = document.createElement("div");
            item.textContent = `${upgrade.name} — level ${this.formatNumber(upgrade.level)}`;
            upgradesOverview.appendChild(item);
        });
    }
 
    update() {
        this.updateDisplays();
        this.renderShops();
        this.renderOverview();
    }
 
    tick() {
        this.cookies += this.totalCps;
        this.updateDisplays();
        this.renderShops();
    }
 
    checkThemeUnlock() {
        this.themes.forEach((theme) => {
            if (!theme.unlocked && this.cookies >= theme.unlockAt) {
                theme.unlocked = true;
                this.renderThemes();
                this.saveGame();
            }
        });
    }
 
    changeTheme(index) {
        this.currentTheme = index;
        this.applyTheme();
        this.saveGame();
    }
 
    applyTheme() {
        const theme = this.themes[this.currentTheme];
        document.body.className = theme.cssClass;
        this.cookieImage.src = theme.image;
        this.renderThemes();
    }
 
    renderThemes() {
        const list = document.getElementById("themes-list");
        list.innerHTML = "";
 
        this.themes.forEach((theme, index) => {
            const row = document.createElement("button");
            row.classList.add("shop-item");
            row.type = "button";
            row.disabled = !theme.unlocked;
            row.classList.toggle("is-selected", index === this.currentTheme);
 
            const preview = document.createElement("img");
            preview.classList.add("theme-preview");
            preview.src = theme.image;
            preview.alt = "";
 
            const copy = document.createElement("span");
            copy.classList.add("item-copy");
            const name = document.createElement("strong");
            name.textContent = theme.unlocked
                ? theme.name
                : "🔒 " + theme.name + " (" + this.formatNumber(theme.unlockAt) + " koekjes)";
            copy.append(name);
 
            row.append(preview, copy);
            row.addEventListener("click", () => this.changeTheme(index));
            list.appendChild(row);
        });
    }
 
    saveGame() {
        try {
            const data = {
                cookies: this.cookies,
                currentTheme: this.currentTheme,
                unlockedThemes: this.themes.map((theme) => theme.unlocked),
                units: this.units.map((unit) => ({ name: unit.name, owned: unit.owned })),
                upgrades: this.upgrades.map((upgrade) => ({ name: upgrade.name, level: upgrade.level }))
            };
            localStorage.setItem(this.saveKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error("Opslaan mislukt:", error);
            return false;
        }
    }
 
    loadGame() {
        try {
            const raw = localStorage.getItem(this.saveKey);
            if (!raw) return;
            const data = JSON.parse(raw);
            this.cookies = Number(data.cookies) || 0;
 
            (data.unlockedThemes || []).forEach((unlocked, index) => {
                if (this.themes[index] && unlocked) this.themes[index].unlocked = true;
            });
            const savedTheme = this.themes[data.currentTheme];
            this.currentTheme = savedTheme && savedTheme.unlocked ? data.currentTheme : 0;
 
            (data.units || []).forEach((saved) => {
                const unit = this.units.find((item) => item.name === saved.name);
                if (unit) {
                    unit.owned = Number(saved.owned) || 0;
                    unit.cost = Math.round(unit.baseCost * 1.8 ** unit.owned);
                }
            });
 
            (data.upgrades || []).forEach((saved) => {
                const upgrade = this.upgrades.find((item) => item.name === saved.name);
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
 
    resetGame() {
        if (confirm("Weet je zeker dat je opnieuw wilt beginnen?")) {
            this.isResetting = true;
            try {
                localStorage.removeItem(this.saveKey);
            } catch (error) {
                this.isResetting = false;
                console.error("Resetten mislukt:", error);
                alert("Je voortgang kon niet worden gewist. Probeer het opnieuw.");
                return;
            }
            location.reload();
        }
    }
}
 
new CookieGame();
 
