let cookies = 0;
let cookiesPerClick = 1;
 
let productionUnits = [
    { name: "Pointer",      baseCost: 15,   cost: 15,   cps: 0.1, owned: 0 },
    { name: "Grandma",      baseCost: 100,  cost: 100,  cps: 1,   owned: 0 },
    { name: "Farm",         baseCost: 500,  cost: 500,  cps: 4,   owned: 0 },
    { name: "Mine",         baseCost: 1500, cost: 1500, cps: 8,   owned: 0 },
    { name: "Factory",      baseCost: 4000, cost: 4000, cps: 15,  owned: 0 },
    { name: "Bank",         baseCost: 8000, cost: 8000, cps: 30,  owned: 0 },
    { name: "Temple",       baseCost: 15000,cost: 15000,cps: 60,  owned: 0 },
    { name: "Wizard Tower", baseCost: 25000,cost: 25000,cps: 100, owned: 0 }
];
 
let upgrades = [
    { name: "Grandma's koekjesboek",   cost: 500,  bought: false, effect: () => multiplyUnit("Grandma", 2) },
    { name: "Snellere pointers",       cost: 300,  bought: false, effect: () => multiplyUnit("Pointer", 2) },
    { name: "Betere zaden",            cost: 2000, bought: false, effect: () => multiplyUnit("Farm", 3) },
    { name: "Extra sterke klik",       cost: 1000, bought: false, effect: () => { cookiesPerClick *= 2; } },
    { name: "Efficiëntie overal",      cost: 5000, bought: false, effect: () => multiplyAllUnits(1.1) }
];

function multiplyUnit(name, factor) {
    let unit = productionUnits.find(u => u.name === name);
    if (unit) unit.cps *= factor;
}
 
function multiplyAllUnits(factor) {
    productionUnits.forEach(u => u.cps *= factor);
}
 
const cookieBtn = document.getElementById("cookie-btn");
 
cookieBtn.addEventListener("click", (event) => {
    cookies += cookiesPerClick;
    updateCookieDisplay();
    showFloatingEffect(event, "+" + cookiesPerClick);
});
 
function showFloatingEffect(event, text) {
    let effect = document.createElement("div");
    effect.classList.add("float-effect");
    effect.textContent = text;
 
    effect.style.left = event.clientX + "px";
    effect.style.top = event.clientY + "px";
    document.body.appendChild(effect);
 
    setTimeout(() => effect.remove(), 800);
}
 
function updateCookieDisplay() {
    if (cookies < 0) cookies = 0; 
    document.getElementById("cookie-count").textContent = Math.floor(cookies) + " cookies";
}
 
function updateCpsDisplay() {
    let totalCps = getTotalCps();
    document.getElementById("cps-count").textContent = totalCps.toFixed(1) + " cookies per second";
}
 
function getTotalCps() {
    return productionUnits.reduce((total, unit) => total + (unit.cps * unit.owned), 0);
}
 
function buyProductionUnit(unit) {
    if (cookies >= unit.cost) {
        cookies -= unit.cost;
        unit.owned += 1;
        unit.cost = Math.round(unit.baseCost * Math.pow(1.15, unit.owned)); 
 
        updateCookieDisplay();
        updateCpsDisplay();
        renderProductionList();
        renderOverview();
    }
}
 
function buyUpgrade(upgrade) {
    if (!upgrade.bought && cookies >= upgrade.cost) {
        cookies -= upgrade.cost;
        upgrade.bought = true;
        upgrade.effect(); 
 
        updateCookieDisplay();
        updateCpsDisplay();
        renderUpgradesList();
        renderProductionList();
        renderOverview();
    }
}
 
function renderOverview() {
    let overview = document.getElementById("overview-list");
    overview.innerHTML = "";
 
    let boughtUnits = productionUnits.filter(u => u.owned > 0);
    let boughtUpgrades = upgrades.filter(u => u.bought);
 
    if (boughtUnits.length === 0 && boughtUpgrades.length === 0) {
        overview.innerHTML = "Nog niets gekocht";
        return;
    }
 
    boughtUnits.forEach(unit => {
        let div = document.createElement("div");
        div.textContent = unit.name + ": " + unit.owned;
        overview.appendChild(div);
    });
 
    boughtUpgrades.forEach(upgrade => {
        let div = document.createElement("div");
        div.textContent = "Upgrade: " + upgrade.name;
        overview.appendChild(div);
    });
}
 
function renderProductionList() {
    let list = document.getElementById("production-list");
    list.innerHTML = "";
 
    productionUnits.forEach(unit => {
        let item = document.createElement("div");
        item.classList.add("shop-item");
 
        item.innerHTML = `
            <div>
                <strong>${unit.name}</strong> (${unit.owned}x)<br>
                ${unit.cps.toFixed(1)} cps per stuk
            </div>
            <button ${cookies < unit.cost ? "disabled" : ""}>
                Koop (${unit.cost})
            </button>
        `;
 
        item.querySelector("button").addEventListener("click", () => buyProductionUnit(unit));
        list.appendChild(item);
    });
}
 
function renderUpgradesList() {
    let list = document.getElementById("upgrades-list");
    list.innerHTML = "";
 
    upgrades.forEach(upgrade => {
        let item = document.createElement("div");
        item.classList.add("shop-item");
        if (upgrade.bought) item.classList.add("bought");
 
        item.innerHTML = `
            <div>
                <strong>${upgrade.name}</strong>
            </div>
            <button ${upgrade.bought || cookies < upgrade.cost ? "disabled" : ""}>
                ${upgrade.bought ? "Gekocht" : "Koop (" + upgrade.cost + ")"}
            </button>
        `;
 
        item.querySelector("button").addEventListener("click", () => buyUpgrade(upgrade));
        list.appendChild(item);
    });
}
 
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
 
        let tab = btn.dataset.tab;
        document.getElementById("production-panel").style.display = tab === "production" ? "block" : "none";
        document.getElementById("upgrades-panel").style.display = tab === "upgrades" ? "block" : "none";
    });
});
 
setInterval(() => {
    let cpsGain = getTotalCps();
    if (cpsGain > 0) {
        cookies += cpsGain;
        updateCookieDisplay();
    }

    renderProductionList();
    renderUpgradesList();
}, 1000);
 
function init() {
    updateCookieDisplay();
    updateCpsDisplay();
    renderProductionList();
    renderUpgradesList();
    renderOverview();
}
 
init();
