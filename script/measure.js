import { addRecords, getMute, getTrials, getYesNoKey } from "./common.js";

window.addEventListener("load", () => {
    /** @type {HTMLSpanElement} */
    const modeSpan = document.getElementById("modeSpan");
    /** @type {HTMLDivElement} */
    const standbyDiv = document.getElementById("standbyDiv");
    /** @type {HTMLHeadingElement} */
    const titleH2 = document.getElementById("titleH2");
    /** @type {HTMLParagraphElement} */
    const descriptionP = document.getElementById("descriptionP");
    /** @type {HTMLButtonElement} */
    const startButton = document.getElementById("startButton");
    /** @type {HTMLDivElement} */
    const messageDiv = document.getElementById("messageDiv");
    /** @type {HTMLSpanElement} */
    const turnSpan = document.getElementById("turnSpan");
    /** @type {HTMLDivElement} */
    const printDiv = document.getElementById("printDiv");
    /** @type {HTMLDivElement} */
    const printInnerDiv1 = document.getElementById("printInnerDiv1");
    /** @type {HTMLDivElement} */
    const printInnerDiv2 = document.getElementById("printInnerDiv2");
    /** @type {HTMLDivElement} */
    const resultDiv = document.getElementById("resultDiv");
    /** @type {HTMLSpanElement} */
    const resultSpan = document.getElementById("resultSpan");
    /** @type {HTMLDivElement} */
    const answersDiv = document.getElementById("answersDiv");
    /** @type {HTMLSpanElement} */
    const userAnswerSpan = document.getElementById("userAnswerSpan");
    /** @type {HTMLSpanElement} */
    const correctAnswerSpan = document.getElementById("correctAnswerSpan");
    /** @type {HTMLSpanElement} */
    const reactionTimeSpan = document.getElementById("reactionTimeSpan");
    /** @type {HTMLDivElement} */
    const finishDiv = document.getElementById("finishDiv");
    /** @type {HTMLSpanElement} */
    const resultAverageSpan = document.getElementById("resultAverageSpan");
    /** @type {HTMLSpanElement} */
    const resultVarianceSpan = document.getElementById("resultVarianceSpan");
    /** @type {HTMLAnchorElement} */
    const nextModeA = document.getElementById("nextModeA");
    /** @type {HTMLSpanElement} */
    const nextModeSpan = document.getElementById("nextModeSpan");
    /** @type {HTMLAnchorElement} */
    const recordsA = document.getElementById("recordsA");

    /** @type {HTMLButtonElement} */
    const yesButton = document.getElementById("yesButton");
    /** @type {HTMLButtonElement} */
    const noButton = document.getElementById("noButton");
    /** @type {HTMLButtonElement} */
    const escapeButton = document.getElementById("escapeButton");

    const params = new URLSearchParams(location.search);
    const mode = (["1", "2", "3", "4"].indexOf(params.get("mode")) + 1) || 1;
    const nextMode = mode % 4 + 1;
    const titles = [ "単純反応", "物理的反応", "名称照合", "カテゴリー照合" ];
    const descriptions = [
        "何かが現れたときに Yes 、No のいずれかを押します。",
        "同じ形の文字、つまり大文字、小文字を区別して同じ文字が現れたときに Yes 、そうでないときに No を押します。",
        "同じ名前の文字、つまり大文字、小文字を区別せずに同じ文字が現れたときに Yes 、そうでないときに No を押します。",
        "アルファベット同士、記号同士が現れたときに Yes 、そうでないときに No を押します。",
    ];
    const upperAlphabets = "ABDEFGHIJKLMNPQRTUY";  // 大文字と小文字の形が似ているものを除外した
    const lowerAlphabets = upperAlphabets.toLowerCase();
    const alphabets = upperAlphabets + lowerAlphabets;
    const symbols = "!#$%&";
    const trials = getTrials();
    const mute = getMute();
    const yesKey = getYesNoKey("yes");
    const noKey = getYesNoKey("no");
    const dedenSound = mute ? null : new Audio("sound/出題1.mp3");
    const correctSound = mute ? null : new Audio("sound/クイズ正解1.mp3");
    const wrongSound = mute ? null : new Audio("sound/クイズ不正解1.mp3");
    const finishSound = mute ? null : new Audio("sound/和太鼓でドドン.mp3");
    
    modeSpan.textContent = mode;
    titleH2.textContent = titles[mode - 1];
    descriptionP.textContent = descriptions[mode - 1];
    nextModeA.href += `?mode=${nextMode}`;
    nextModeSpan.textContent = nextMode;
    recordsA.href += `?mode=${mode}`;
    if (mode === 1) {
        answersDiv.style.display = "none";
        printInnerDiv2.style.display = "none";
    }

    let turn = 1;
    /** @type {"yes" | "no"} */
    let correctAnswer;
    let isWaiting = false;
    let printTime = 0;
    let timeoutId = null;
    const results = [];

    const start = () => {
        turnSpan.textContent = `[${turn} / ${trials}]`;
        printInnerDiv1.textContent = "";
        printInnerDiv2.textContent = "";
        printInnerDiv1.style.fontSize = `${Math.random() * 0.5 + 0.75}em`;
        printInnerDiv2.style.fontSize = `${Math.random() * 0.5 + 0.75}em`;
        dedenSound?.play();
        timeoutId = setTimeout(() => {
            timeoutId = null;
            const choice = s => s[Math.floor(Math.random() * s.length)];
            if (mode === 1) {
                printInnerDiv1.textContent = choice(alphabets + symbols);
                correctAnswer = "yes";
            }
            else if (mode === 2) {
                printInnerDiv1.textContent = choice(alphabets);
                if (Math.random() < 0.5) {
                    printInnerDiv2.textContent = printInnerDiv1.textContent;
                    correctAnswer = "yes";
                }
                else {
                    do {
                        printInnerDiv2.textContent = choice(alphabets);
                    }
                    while (printInnerDiv2.textContent === printInnerDiv1.textContent);
                    correctAnswer = "no";
                }
            }
            else if (mode === 3) {
                const isUpper = (Math.random() < 0.5);
                printInnerDiv1.textContent = isUpper ? choice(upperAlphabets) : choice(lowerAlphabets);
                if (Math.random() < 0.5) {
                    printInnerDiv2.textContent = printInnerDiv1.textContent[isUpper ? "toLowerCase" : "toUpperCase"]();
                    correctAnswer = "yes";
                }
                else {
                    do {
                        printInnerDiv2.textContent = (!isUpper) ? choice(upperAlphabets) : choice(lowerAlphabets);
                    }
                    while (printInnerDiv2.textContent.toUpperCase() === printInnerDiv1.textContent.toUpperCase());
                    correctAnswer = "no";
                }
            }
            else if (mode === 4) {
                const isAlpha = (Math.random() < 0.5);
                printInnerDiv1.textContent = isAlpha ? choice(alphabets) : choice(symbols);
                if (Math.random() < 0.5) {
                    printInnerDiv2.textContent = isAlpha ? choice(alphabets) : choice(symbols);
                    correctAnswer = "yes";
                }
                else {
                    printInnerDiv2.textContent = (!isAlpha) ? choice(alphabets) : choice(symbols);
                    correctAnswer = "no";
                }
            }
            isWaiting = true;
            printTime = performance.now();
        }, 1000 + Math.random() * 5000);
    };

    const finish = () => {
        if (messageDiv.style.display === "none") return;
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        isWaiting = false;
        messageDiv.style.display = "none";
        printDiv.style.display = "none";
        resultDiv.style.display = "none";
        finishDiv.style.display = null;
        const average = results.reduce((acc, e) => acc + e) / results.length;
        const variance = results.reduce((acc, e) => acc + (e - average) ** 2, 0) / results.length;
        resultAverageSpan.textContent = Math.round(average * 100) / 100;
        resultVarianceSpan.textContent = Math.round(variance * 100) / 100;
        recordsA.href += `&num=${Math.max(1, results.length)}`;
        finishSound?.play();
    };

    /** @param {"yes" | "no"} ans */
    const onAnswer = ans => {
        const answerTime = performance.now();
        if (isWaiting) {
            isWaiting = false;
            const correct = (mode === 1 || ans === correctAnswer);
            const reactionTime = Math.round(answerTime - printTime);
            results.push(reactionTime);
            resultDiv.style.display = null;
            resultSpan.textContent = (correct ? "正解！" : "不正解");
            const cap = s => s[0].toUpperCase() + s.slice(1);
            userAnswerSpan.textContent = cap(ans);
            userAnswerSpan.className = ans;
            correctAnswerSpan.textContent = cap(correctAnswer);
            correctAnswerSpan.className = correctAnswer;
            reactionTimeSpan.textContent = reactionTime;
            addRecords(mode, [printInnerDiv1.textContent, printInnerDiv2.textContent, ans, correctAnswer, reactionTime]);
            (correct ? correctSound : wrongSound)?.play();
            timeoutId = setTimeout(() => {
                timeoutId = null;
                resultDiv.style.display = "none";
                if (++turn > trials) {
                    finish();
                }
                else {
                    start();
                }
            }, 3000);
        }
    };

    startButton.addEventListener("click", () => {
        standbyDiv.style.display = "none";
        messageDiv.style.display = null;
        printDiv.style.display = null;
        start();
    });

    window.addEventListener("keydown", e => {
        if (e.code === "Escape") {
            finish();
        }
        else if (e.code === yesKey) {
            onAnswer("yes");
        }
        else if (e.code === noKey) {
            onAnswer("no");
        }
    });
    yesButton.addEventListener("mousedown", () => onAnswer("yes"));
    yesButton.addEventListener("touchstart", () => onAnswer("yes"));
    noButton.addEventListener("mousedown", () => onAnswer("no"));
    noButton.addEventListener("touchstart", () => onAnswer("no"));
    escapeButton.addEventListener("click", () => finish());
});
