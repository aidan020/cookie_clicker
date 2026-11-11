

class ThemeManager {
    constructor(game) {
        this.game = game;
        this.list = createThemes();   
        this.current = 0;            
        this.cookieImage = document.getElementById("cookie-img");
        this.listElement = document.getElementById("themes-list");
    }

    checkUnlock() {
        this.list.forEach((theme) => {
            if (!theme.unlocked && this.game.cookies >= theme.unlockAt) {
                theme.unlocked = true;
                this.render();
                this.game.saveManager.save();
            }
        });
    }

    choose(index) {
        this.current = index;
        this.apply();
        this.game.saveManager.save();
    }

    apply() {
        const theme = this.list[this.current];
        document.body.className = theme.cssClass;
        this.cookieImage.src = theme.image;
        this.render();
    }

    render() {
        this.listElement.innerHTML = "";

        this.list.forEach((theme, index) => {

            const row = makeElement("button", "shop-item");
            row.type = "button";
            row.disabled = !theme.unlocked;
            row.classList.toggle("is-selected", index === this.current);

            const preview = makeElement("img", "theme-preview");
            preview.src = theme.image;
            preview.alt = "";

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
