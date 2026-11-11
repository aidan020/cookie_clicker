// ============================================================
// helpers.js
// Kleine hulpfuncties die in meerdere bestanden gebruikt worden.
// ============================================================

// Maakt een HTML-element met (optioneel) een CSS-klasse en tekst.
// Voorbeeld: makeElement("span", "item-icon", "P")
//   → <span class="item-icon">P</span>
function makeElement(tag, className = "", text = "") {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    element.textContent = text;
    return element;
}

// Maakt grote getallen kort, zodat ze op het scherm passen.
// Voorbeeld: 150000 → "150K", 2500000 → "2.5M"
function formatNumber(value, decimalPlaces = 0) {
    // K = duizend, M = miljoen, B = miljard, T = biljoen, ...
    const suffixes = ["K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];
    const absoluteValue = Math.abs(value);

    // Kleiner dan 100.000: gewoon het hele getal laten zien
    if (absoluteValue < 100000) return value.toFixed(decimalPlaces);

    // Kies de juiste afkorting (K, M, B, ...)
    let suffixIndex = Math.floor(Math.log10(absoluteValue) / 3) - 1;
    if (suffixIndex >= suffixes.length) return value.toExponential(1);

    // Deel het getal zodat het past bij de afkorting
    let scaledValue = value / 10 ** (3 + suffixIndex * 3);

    // Als het afgerond 1000 wordt (bijv. 999.99K), ga naar de volgende afkorting
    if (Number(scaledValue.toFixed(1)) >= 1000) {
        suffixIndex++;
        if (suffixIndex >= suffixes.length) return value.toExponential(1);
        scaledValue = value / 10 ** (3 + suffixIndex * 3);
    }

    // ".0" weghalen: "150.0K" wordt "150K"
    return scaledValue.toFixed(1).replace(/\.0$/, "") + suffixes[suffixIndex];
}