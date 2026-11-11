// ============================================================
// game-ui.js
// Alles wat met het SCHERM te maken heeft:
//   - knoppen koppelen aan acties
//   - tabbladen wisselen
//   - tellers, winkel en overzicht tekenen
//   - het zwevende "+1" bij een klik
// ============================================================

class GameUI {
    constructor(game) {
        this.game = game;

        // HTML-elementen die we vaak nodig hebben
        this.cookieCount = document.getElementById("cookie-count");
        this.cpsCount = document.getElementById("cps-count");
        this.cookieTotal = document.getElementById("cookie-total");
        this.cpsTotal = document.getElementById("cps-total");
        this.clickTotal = document.getElementById("click-total");
    }

    // ---------- Knoppen koppelen ----------

    bindEvents() {
        // Klik op de koek
        document.getElementById("cookie-btn").addEventListener("click", (event) => {
            this.game.clickCookie(event);
        });

        // Klik op een tabblad
        document.querySelectorAll(".tab-btn").forEach((button) => {
            button.addEventListener("click", () => this.showTab(button));
        });

        // Opslaan-knop: even "Opgeslagen" tonen
        const saveButton = document.getElementById("save-btn");
        saveButton.addEventListener("click", () => {
            const saved = this.game.saveManager.save();
            saveButton.textContent = saved ? "Opgeslagen" : "Opslaan mislukt";
            window.setTimeout(() => {
                saveButton.textContent = "Opslaan";
            }, 1600);
        });

        // Reset-knop
        const resetButton = document.getElementById("reset-btn");
        if (resetButton) resetButton.addEventListener("click", () => this.game.resetGame());
    }

    // ---------- Tabbladen ----------

    // Toont het paneel van het aangeklikte tabblad en verbergt de rest
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

    // ---------- Zwevend "+1" ----------

    showFloatingEffect(event) {
        const effect = makeElement("div", "float-effect", "+" + formatNumber(this.game.cookiesPerClick));
        effect.style.left = event.clientX + "px";
        effect.style.top = event.clientY + "px";
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 800);   // na 0,8 seconde weghalen
    }

    // ---------- Tellers (bovenaan en links) ----------

    showCounters() {
        const cookies = formatNumber(Math.floor(this.game.cookies));
        const cps = formatNumber(this.game.totalCps, 1);
        const perClick = formatNumber(this.game.cookiesPerClick);

        this.cookieCount.textContent = cookies + " cookies";
        this.cpsCount.textContent = cps + " per seconde · " + perClick + " per klik";
        this.cookieTotal.textContent = cookies;
        this.cpsTotal.textContent = cps;
        this.clickTotal.textContent = perClick;
    }

    // ---------- Winkel ----------

    // Tekent de gebouwen (rechts) en de upgrades (tabblad Upgrades)
    renderShops() {
        this.renderShop(
            this.game.units,
            "production-list",
            (unit) => `${formatNumber(unit.cps, 1)} /s`,
            (unit) => unit.buy(this.game)
        );
        this.renderShop(
            this.game.upgrades,
            "upgrades-list",
            (upgrade) => upgrade.description,
            (upgrade) => upgrade.buy(this.game)
        );
    }

    // Tekent één lijst met knoppen.
    //   items          = de dingen om te tonen (gebouwen of upgrades)
    //   listId         = id van het HTML-element waar de lijst in komt
    //   getDescription = functie die de kleine tekst onder de naam maakt
    //   buyItem        = functie die het item koopt
    renderShop(items, listId, getDescription, buyItem) {
        const list = document.getElementById(listId);
        list.innerHTML = "";   // eerst leegmaken, anders komt alles dubbel
        const isProduction = listId === "production-list";

        items.forEach((item) => {
            list.appendChild(this.createShopRow(item, isProduction, getDescription, buyItem));
        });
    }

    // Maakt de knop voor één gebouw of upgrade
    createShopRow(item, isProduction, getDescription, buyItem) {
        const canAfford = this.game.cookies >= item.cost;
        const priceLabel = `${formatNumber(item.cost)} koekjes`;

        // De knop zelf (grijs als je te weinig koekjes hebt)
        const row = makeElement("button", "shop-item");
        row.type = "button";
        row.disabled = !canAfford;
        row.classList.toggle("is-affordable", canAfford);
        row.setAttribute(
            "aria-label",
            canAfford
                ? `Koop ${item.name} voor ${priceLabel}`
                : `${item.name} kost ${priceLabel}; nog koekjes nodig`
        );

        // Icoon: de eerste letter van de naam
        const icon = makeElement("span", "item-icon", item.name.charAt(0));
        icon.setAttribute("aria-hidden", "true");

        // Naam en beschrijving
        const copy = makeElement("span", "item-copy");
        copy.append(
            makeElement("strong", "", item.name),
            makeElement("span", "", getDescription(item))
        );

        // Prijs en status
        const cost = makeElement("span", "item-cost", priceLabel);
        cost.appendChild(makeElement("span", "", this.getStatusText(item, isProduction, canAfford)));

        row.append(icon, copy, cost);

        // Bij een klik: kopen, scherm verversen en opslaan
        row.addEventListener("click", () => {
            if (buyItem(item)) {
                this.game.update();
                this.game.saveManager.save();
            }
        });

        return row;
    }

    // De kleine tekst rechts onder de prijs
    getStatusText(item, isProduction, canAfford) {
        if (isProduction) return `bezit: ${formatNumber(item.owned)}`;   // gebouwen
        return canAfford ? "NU KOPEN" : "koekjes nodig";                 // upgrades
    }

    // ---------- Overzicht ----------

    renderOverview() {
        this.renderUnitOverview();
        this.renderBoughtUpgrades();
    }

    // Lijst met hoeveel je van elk gebouw hebt
    renderUnitOverview() {
        const overview = document.getElementById("overview-list");
        overview.innerHTML = "";

        this.game.units.forEach((unit) => {
            const item = makeElement("div", "overview-item");
            item.append(
                makeElement("span", "", unit.name),
                makeElement("span", "overview-count", formatNumber(unit.owned))
            );
            overview.appendChild(item);
        });
    }

    // Lijst met de upgrades die je gekocht hebt
    renderBoughtUpgrades() {
        const container = document.getElementById("bought-upgrades-list");
        container.innerHTML = "";

        const bought = this.game.upgrades.filter((upgrade) => upgrade.level > 0);
        if (bought.length === 0) {
            container.textContent = "Nog geen upgrades gekocht";
            return;
        }

        bought.forEach((upgrade) => {
            container.appendChild(
                makeElement("div", "", `${upgrade.name} — level ${formatNumber(upgrade.level)}`)
            );
        });
    }
}