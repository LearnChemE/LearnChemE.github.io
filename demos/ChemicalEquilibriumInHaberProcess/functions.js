function drawSub(mainText, subscript, x, y, mainTextSize, xsub) {
    let subscriptSize = mainTextSize * 0.6;
    let subscriptOffset = mainTextSize * 0.2;

    let bigText = (useAltText && altText != '') ? altText : mainText;
    let smText = (useAltText && altSub != '') ? altSub : subscript;

    textSize(mainTextSize);
    text(bigText, x, y);

    textSize(subscriptSize);
    text(smText, x + textWidth(mainText) + xsub, y + subscriptOffset);
}

export { drawSub };