let sentenceElement = document.getElementById('sentence');
let userInputElement = document.getElementById('userInput');
let timerElement = document.getElementById('timer');
let resultElement = document.getElementById('result');
let startButton = document.querySelector('button');

let startTime, timerInterval;
let sentence = '';
let starting = true;
let wpm = 0;
//----------------------------
let counter = 0
let UID = false
let MAIN = false
let CACHE = false
let WINCHECK = false

async function sendToServer(message){
    console.log("\nI sent to server !\n", message)
	chrome.runtime.sendMessage({id: "patch",op: message });
}

async function whoWon(){
    console.log("\nknow who won\n")
    chrome.runtime.sendMessage({id: "whoWon", cache:CACHE, game:"type"})
}

chrome.runtime.onMessage.addListener(async (message, sender, response) => {
    if(message.id == "win"){
        resultElement.innerText = `✅ 正確！你完成了這段文字。\n打字速度: ${wpm} 字/分鐘\nYOU WIN!!!`;
    }
    if(message.id == "lose"){
        resultElement.innerText = `❌ \n打字速度: ${wpm} 字/分鐘\nyou lose, 你將被鎖5分鐘`;
    }
    if(message.id == "updateGame"){
        setInterval(function () {checkTyping();if(starting) return}, 100);
        if(starting) startTest()
        console.log("updatedEEEEEEEEEEEEEEEEEEEEEEEEEE")
        updateTimer()
        counter += 1;
        if(WINCHECK && Math.floor(counter) == counter && counter < 30 && counter % 3 == 0){
            whoWon()
        }
        //button.innerText = counter.toFixed(2);
        if(counter >= 20 && !WINCHECK){
            sendToServer({ "op":"add", "path":"/"+[CACHE]+"/"+[UID], "value":1000000 })
            document.getElementById('message').innerText = `❌ 超時!`
            WINCHECK = true
        }
    }
    if(message.id == "uid"){
        UID = message.uid
        console.log("\n\nI GOT THE id ; \n\n", UID)
    }
})

function getUIDAndMain() {
    const params = new URLSearchParams(window.location.search);
    MAIN = params.get("isMain");
    CACHE = params.get("vslink");
}
//----------------------------

// ✅ 從 URL 讀取問題文字
function getProblemFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("problem"); // 取得 "problem" 參數
}

// 開始測試
function startTest() {
    // 取得 URL 中的問題文字
    getUIDAndMain()
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
    starting = false;
    userInputElement.disabled = false;
    userInputElement.focus();

    // 計時開始
    startTime = Date.now();
}

// 更新計時器
function updateTimer() {
    let elapsedTime = ((Date.now() - startTime)/1000).toFixed(2);
    timerElement.innerText = `計時: ${elapsedTime} 秒`;
}

// 檢查打字是否正確
function checkTyping() {

    //---------------start
    if(WINCHECK){
        return
    }
    //---------------end
    if (starting) return;
    
    let userInput = userInputElement.value;
    console.log("\n\nINPUTS", userInput,"\n" ,sentence)
    // 如果用戶輸入正確，停止測試
    if (userInput == sentence) {
        clearInterval(timerInterval);
        let elapsedTime = ((Date.now() - startTime)/1000).toFixed(4);
        let wpm = calculateWPM(elapsedTime, sentence);
        resultElement.innerText = `✅ 正確！你完成了這段文字。\n打字速度: ${wpm} 字/分鐘`;

        //-----------------------------------------start
        sendToServer({ "op":"add", "path":"/"+[CACHE]+"/"+[UID], "value":((Date.now() - startTime)/1000).toFixed(2) })
        WINCHECK = true
        //-----------------------------------------end
    }
}

// 計算打字速度 WPM
function calculateWPM(timeInSeconds, text) {
    let words = text.split(' ').length;
    let minutes = timeInSeconds / 60;
    return Math.round(words / minutes);
}

document.getElementById("userInput").addEventListener("input", checkAnswer);