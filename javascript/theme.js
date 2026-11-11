// ============================================================
// theme-manager.js
// Regelt de thema's: unlocken, kiezen, toepassen en de lijst
// in het tabblad "Thema's" tekenen.
// ============================================================

class ThemeManager {
    constructor(game) {
        this.game = game;
        this.list = createThemes();   // alle thema's (zie game-data.js)
        this.current = 0;             // nummer van het gekozen thema (0 = groen)
        this.cookieImage = document.getElementById("cookie-img");
        this.listElement = document.getElementById("themes-list");
    }

    // Kijkt of je genoeg koekjes hebt om een thema te unlocken
    checkUnlock() {
        this.list.forEach((theme) => {
            if (!theme.unlocked && this.game.cookies >= theme.unlockAt) {
                theme.unlocked = true;
                this.render();
                this.game.saveManager.save();
            }
        });
    }

    // Kiest het thema met dit nummer (als je op de knop klikt)
    choose(index) {
        this.current = index;
        this.apply();
        this.game.saveManager.save();
    }

    // Zet het gekozen thema aan: kleuren (CSS-klasse) en plaatje
    apply() {
        const theme = this.list[this.current];
        document.body.className = theme.cssClass;
        this.cookieImage.src = theme.image;
        this.render();
    }

    // Tekent de lijst met thema's in het tabblad "Thema's"
    render() {
        this.listElement.innerHTML = "";

        this.list.forEach((theme, index) => {
            // De knop (grijs en niet klikbaar als het thema nog op slot zit)
            const row = makeElement("button", "shop-item");
            row.type = "button";
            row.disabled = !theme.unlocked;
            row.classList.toggle("is-selected", index === this.current);

            // Klein plaatje
            const preview = makeElement("img", "theme-preview");
            preview.src = theme.image;
            preview.alt = "";

            // Naam (met slotje en prijs als het nog op slot zit)
            const name = theme.unlocked
                ? theme.name
                : "🔒 " + theme.name + " (" + formatNumber(theme.unlockAt) + " koekjes)";
            const copy = makeElement("span", "item-copy");
            copy.append(makeElement("strong", "", name));

            row.append(preview, copy);
            row.addEventListener("click", () => this.choose(index));
            this.listElement.appendChild(row);
        });
    }
}