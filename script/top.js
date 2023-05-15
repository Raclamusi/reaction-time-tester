import { getMute, getTrials, getYesNoKey, setMute, setTrials, setYesNoKey } from "./common.js";

window.addEventListener("load", () => {
    /** @type {HTMLInputElement} */
    const trialsInput = document.getElementById("trialsInput");
    /** @type {HTMLInputElement} */
    const muteInput = document.getElementById("muteInput");
    /** @type {HTMLSpanElement} */
    const muteSpan = document.getElementById("muteSpan");
    /** @type {HTMLInputElement} */
    const yesKeyInput = document.getElementById("yesKeyInput");
    /** @type {HTMLInputElement} */
    const noKeyInput = document.getElementById("noKeyInput");

    const muteTexts = {
        [false]: "音が出ます",
        [true]: "音が出ません",
    };
    const keySetText = "Press any key...";

    trialsInput.value = getTrials();
    muteInput.value = getMute();
    muteSpan.textContent = muteTexts[getMute()];
    yesKeyInput.value = getYesNoKey("yes");
    noKeyInput.value = getYesNoKey("no");

    trialsInput.addEventListener("change", () => {
        setTrials(parseInt(trialsInput.value));
        trialsInput.value = getTrials();
    });

    muteInput.addEventListener("change", () => {
        setMute(muteInput.checked);
        muteSpan.textContent = muteTexts[muteInput.checked];
    });

    const isWaiting = { yes: false, no: false };
    /** @param {MouseEvent} e */
    const setKey = e => {
        const target = e.target;
        const yesNo = target.id.match(/^(yes|no)/)[0];
        const noYes = (yesNo === "yes" ? "no" : "yes");
        if (isWaiting[yesNo]) {
            target.value = getYesNoKey(yesNo);
            isWaiting[yesNo] = false;
            return;
        }
        if (isWaiting[noYes]) {
            return;
        }
        isWaiting[yesNo] = true;
        target.value = keySetText;
        window.addEventListener("keydown", e => {
            if (e.code !== "Escape" && e.code !== getYesNoKey(noYes)) {
                setYesNoKey(yesNo, e.code);
            }
            target.value = getYesNoKey(yesNo);
            isWaiting[yesNo] = false;
            e.preventDefault();
        }, { once: true });
    };
    yesKeyInput.addEventListener("click", setKey);
    noKeyInput.addEventListener("click", setKey);
});
