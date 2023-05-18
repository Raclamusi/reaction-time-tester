import { deleteRecords, getDelimiter, getRecordHeader, getRecords, setDelimiter, setRecordHeader } from "./common.js";

window.addEventListener("load", () => {
    /** @type {HTMLInputElement[]} */
    const modeRadios = [...document.getElementsByName("mode")];
    /** @type {HTMLInputElement[]} */
    const delimiterRadios = [...document.getElementsByName("delimiter")];
    /** @type {HTMLInputElement} */
    const dataNumInput = document.getElementById("dataNumInput");
    /** @type {HTMLInputElement} */
    const outputHeaderCheck = document.getElementById("outputHeaderCheck");
    /** @type {HTMLSpanElement} */
    const statsAverageSpan = document.getElementById("statsAverageSpan");
    /** @type {HTMLSpanElement} */
    const statsSDSpan = document.getElementById("statsSDSpan");
    /** @type {HTMLButtonElement} */
    const copyOutputButton = document.getElementById("copyOutputButton");
    /** @type {HTMLTextAreaElement} */
    const outputTextArea = document.getElementById("outputTextArea");
    /** @type {HTMLButtonElement} */
    const deleteButton = document.getElementById("deleteButton");

    const params = new URLSearchParams(location.search);
    if (params.has("mode")) {
        const mode = params.get("mode");
        const button = modeRadios.find(e => e.value === mode);
        if (button) button.checked = true;
    }
    if (params.has("del")) {
        const del = params.get("del");
        const button = delimiterRadios.find(e => e.value === del);
        if (button) button.checked = true;
    }
    else {
        const del = getDelimiter();
        const button = delimiterRadios.find(e => e.value === del);
        if (button) button.checked = true;
    }
    if (params.has("num")) {
        const num = parseInt(params.get("num"));
        if (!isNaN(num) && num > 0) dataNumInput.value = num;
    }
    {
        const hasHeader = getRecordHeader();
        outputHeaderCheck.checked = hasHeader;
    }

    const update = () => {
        const mode = modeRadios.find(e => e.checked).value;
        const delimiter = delimiterRadios.find(e => e.checked).value;
        const del = (delimiter === "tab") ? "\t" : ",";
        const num = parseInt(dataNumInput.value);
        const hasHeader = outputHeaderCheck.checked;
        const records = getRecords(mode).slice(-num);
        outputTextArea.value
            = (hasHeader ? ["printed1", "printed2", "answer", "correct", "time"].join(del) + "\n" : "")
            + records.map(data => data.join(del) + "\n").join("");
        const average = records.reduce((acc, e) => acc + e[4], 0) / records.length;
        const variance = records.reduce((acc, e) => acc + (e[4] - average) ** 2, 0) / records.length;
        statsAverageSpan.textContent = Math.round(average * 100) / 100;
        statsSDSpan.textContent = Math.round(Math.sqrt(variance) * 100) / 100;
    };
    update();

    for (const button of modeRadios) {
        button.addEventListener("change", () => {
            if (button.checked) {
                update();
            }
        });
    }

    for (const button of delimiterRadios) {
        button.addEventListener("change", () => {
            if (button.checked) {
                setDelimiter(button.value);
                update();
            }
        });
    }

    let prevNum = parseInt(dataNumInput.value);
    dataNumInput.addEventListener("change", () => {
        const num = Math.max(1, parseInt(dataNumInput.value));
        if (isNaN(num)) {
            dataNumInput.value = prevNum;
            return;
        }
        if (num === prevNum) return;
        dataNumInput.value = prevNum = num;
        update();
    });

    outputHeaderCheck.addEventListener("change", () => {
        setRecordHeader(outputHeaderCheck.checked);
        update();
    });

    copyOutputButton.addEventListener("click", async () => {
        await navigator.clipboard.writeText(outputTextArea.value);
    });

    deleteButton.addEventListener("click", () => {
        const mode = modeRadios.find(e => e.checked).value;
        if (window.confirm(`Mode ${mode} の記録を削除します。\nよろしいですか？`)) {
            deleteRecords(mode);
            update();
        }
    });
});
