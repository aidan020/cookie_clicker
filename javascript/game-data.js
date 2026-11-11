function createUnits() {
    return [
        new ProductionUnit("Pointer", 15, 1),
        new ProductionUnit("Grandma", 100, 2.5),
        new ProductionUnit("Farm", 500, 4),
        new ProductionUnit("Mine", 1500, 8),
        new ProductionUnit("Factory", 4000, 15),
        new ProductionUnit("Bank", 8000, 30),
        new ProductionUnit("Temple", 15000, 60),
        new ProductionUnit("Wizard Tower", 25000, 100)
    ];
}

function createUpgrades(game) {
    return [
        new Upgrade("Grandma's koekjesboek", 500, "Grandmas x2", () => game.multiplyUnit("Grandma", 2)),
        new Upgrade("Snellere pointers", 300, "Pointers x2", () => game.multiplyUnit("Pointer", 2)),
        new Upgrade("Betere zaden", 2000, "Farms x3", () => game.multiplyUnit("Farm", 3)),
        new Upgrade("Extra sterke klik", 1000, "Klikken geeft x2", () => { game.cookiesPerClick *= 2; }),
        new Upgrade("Efficiëntie overal", 5000, "Alle productie +10%", () => game.multiplyAllUnits(1.1))
    ];
}

function createThemes() {
    return [
        { name: "Groen", cssClass: "", image: "Gingerbread_man.jpg", unlockAt: 0, unlocked: true },
        { name: "Rode Elf", cssClass: "theme-red", image: "elf.png", unlockAt: 25000, unlocked: false }
    ];
}
