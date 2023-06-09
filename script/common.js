const storageKeyPrefix = "reaction_time_tester__";
function getItem(key) {
    try {
        return JSON.parse(localStorage.getItem(storageKeyPrefix + key));
    }
    catch {
        return null;
    }
}
function setItem(key, value) {
    return localStorage.setItem(storageKeyPrefix + key, JSON.stringify(value));
}

/**
 * 現在設定されている試行回数を取得します。
 * @returns {number} 試行回数
 */
export function getTrials() {
    return getItem("trials") ?? 10;
}

/**
 * 新たな試行回数を設定します。
 * @param {number} trials 試行回数
 */
export function setTrials(trials) {
    if (!isNaN(trials)) {
        setItem("trials", Math.max(1, trials));
    }
}

/**
 * 現在設定されているミュート状態を取得します。
 * @returns {boolean} ミュート状態
 */
export function getMute() {
    return getItem("mute") ?? false;
}

/**
 * 新たなミュート状態を設定します。
 * @param {boolean} mute ミュート状態
 */
export function setMute(mute) {
    setItem("mute", mute);
}

/**
 * 指定した入力タイプに現在設定されているキーコードを取得します。
 * @param {"yes" | "no"} yesNo 入力タイプ
 * @returns {string} キーコード
 */
export function getYesNoKey(yesNo) {
    return getItem(yesNo + "Key") ?? ["KeyY", "KeyU"][["yes", "no"].indexOf(yesNo)];
}

/**
 * 指定した入力タイプに新たなキーコードを設定します。
 * @param {"yes" | "no"} yesNo 入力タイプ
 * @param {string} code キーコード
 */
export function setYesNoKey(yesNo, code) {
    setItem(yesNo + "Key", code);
}

/** 計測モードモードの最大値 */
export const modeMax = 5;

/**
 * 指定した計測モードの記録を取得します。
 * @param {number} mode 計測モード
 * @returns {any[]} 計測結果の記録
 */
export function getRecords(mode) {
    if (mode < 1 || mode > modeMax) return [];
    return getItem("records" + mode) ?? [];
}

/**
 * 指定した計測モードの記録にデータを追加します。
 * @param {number} mode 計測モード
 * @param {any} data 追加する計測データ
 */
export function addRecords(mode, data) {
    if (mode < 1 || mode > modeMax) return;
    const records = getRecords(mode);
    records.push(data);
    setItem("records" + mode, records);
}

/**
 * 指定した計測モードの記録を削除します。
 * @param {number} mode 計測モード
 */
export function deleteRecords(mode) {
    if (mode < 1 || mode > modeMax) return;
    setItem("records" + mode, []);
}

/**
 * 記録の出力に使用する区切り文字を取得します。
 * @returns {"comma" | "tab"} 区切り文字
 */
export function getDelimiter() {
    return getItem("delimiter") ?? "comma";
}

/**
 * 記録の出力に使用する区切り文字を設定します。
 * @param {"comma" | "tab"} del 区切り文字
 */
export function setDelimiter(del) {
    if (del !== "comma" && del !== "tab") return;
    setItem("delimiter", del);
}

/**
 * 出力する記録のデータ数を取得します。
 * @returns {number} データ数
 */
export function getDataNum() {
    return getItem("dataNum") ?? 100;
}

/**
 * 出力する記録のデータ数を設定します。
 * @param {number} num データ数
 */
export function setDataNum(num) {
    if (!isNaN(num)) {
        setItem("dataNum", Math.max(1, num));
    }
}

/**
 * 記録の出力にヘッダをつけるかどうかを取得します。
 * @returns {boolean} ヘッダを出力するかどうか
 */
export function getRecordHeader() {
    return getItem("recordHeader") ?? true;
}

/**
 * 記録の出力にヘッダをつけるかどうかを設定します。
 * @param {boolean} hasHeader ヘッダを出力するかどうか
 */
export function setRecordHeader(hasHeader) {
    setItem("recordHeader", hasHeader);
}
