function makeElement(tag, className = "", text = "") {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    element.textContent = text;
    return element;
}

function formatNumber(value, decimalPlaces = 0) {
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
