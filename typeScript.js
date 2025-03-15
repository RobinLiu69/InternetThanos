let sentenceElement = document.getElementById('sentence');
let userInputElement = document.getElementById('userInput');
let timerElement = document.getElementById('timer');
let resultElement = document.getElementById('result');
let startButton = document.querySelector('button');

let startTime, timerInterval;
let sentence = '';
let isTesting = false;

// ✅ 從 URL 讀取問題文字
function getProblemFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("problem"); // 取得 "problem" 參數
}

// 開始測試
function startTest() {
    // 取得 URL 中的問題文字
    sentence = getProblemFromURL();
    
    // 如果 URL 中沒有問題文字，顯示錯誤
    if (!sentence) {
        sentenceElement.innerText = "❌ 無法獲取題目，請檢查 URL 中的問題參數";
        return;
    }

    sentenceElement.innerText = sentence;
    
    // 清空用戶輸入區域
    userInputElement.value = '';
    resultElement.innerText = '';
    
    // 設定測試開始
    isTesting = true;
    startButton.disabled = true;
    userInputElement.disabled = false;
    userInputElement.focus();

    // 計時開始
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

// 更新計時器
function updateTimer() {
    let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    timerElement.innerText = `計時: ${elapsedTime} 秒`;
}

// 檢查打字是否正確
function checkTyping() {
    if (!isTesting) return;
    
    let userInput = userInputElement.value;
    
    // 如果用戶輸入正確，停止測試
    if (userInput === sentence) {
        clearInterval(timerInterval);
        let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        let wpm = calculateWPM(elapsedTime, sentence);
        resultElement.innerText = `✅ 正確！你完成了這段文字。\n打字速度: ${wpm} 字/分鐘`;
        isTesting = false;
        startButton.disabled = false;
    }
}

// 計算打字速度 WPM
function calculateWPM(timeInSeconds, text) {
    let words = text.split(' ').length;
    let minutes = timeInSeconds / 60;
    return Math.round(words / minutes);
}
