const button = document.querySelector('#counter > button');
let counter = 0;
let interval;
let correctAnswer = null;
let wrongAttempts = 0;
let startTime = Date.now();

//-----------------------------------------start
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
    chrome.runtime.sendMessage({id: "whoWon", cache:CACHE, game:"math"})
}

chrome.runtime.onMessage.addListener(async (message, sender, response) => {
    if(message.id == "win"){
        document.getElementById('message').innerText = `✅ 正確答案！你花了 ${((Date.now() - startTime)/1000).toFixed(2)} 秒\nYOU WIN!!!`;
    }
    if(message.id == "lose"){
        document.getElementById('message').innerText = `you lose :(, 你的${message.url}將被鎖5分鐘`;
    }
    if(message.id == "updateGame"){
        counter += 1;
        if(WINCHECK && Math.floor(counter) == counter && counter < 30 && counter % 3 == 0){
            whoWon()
        }
        button.innerText = ((Date.now() - startTime)/1000).toFixed(2);
        if(counter >= 30 && !WINCHECK){
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
//-----------------------------------------end

// ✅ 從 URL 讀取數學題目
function getProblemFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("problem"); // 取得 "problem" 參數
}

// ✅ 解析運算式並計算答案
function calculateAnswer(expression) {
    // 去掉多餘的空格

    // 使用正則表達式提取運算符與數字
    const match = expression.match(/(\d+)([(\+)\-\*\/])(\d+)/);
    console.log(match);
    if (!match) return null; // 如果無法匹配，返回 null

    const num1 = parseFloat(match[1]);
    const operator = match[2];
    const num2 = parseFloat(match[3]);

    // 根據運算符計算答案
    switch (operator) {
        case '+': return num1 + num2;
        case '-': return num1 - num2;
        case '*': return num1 * num2;
        case '/': 
            if (num2 === 0) return null; // 防止除以零
            return num1 / num2;
        default: return null;
    }
}

// ✅ 初始化題目
function loadQuestion() {
    getUIDAndMain()
    const problem = getProblemFromURL().replace(" ", "+");
    if (!problem) {
        document.getElementById('question').innerText = "❌ 無法獲取題目";
        return;
    }

    correctAnswer = calculateAnswer(problem);

    if (correctAnswer === null) {
        document.getElementById('question').innerText = "❌ 題目格式錯誤";
        return;
    }

    document.getElementById('question').innerText = `${problem} = ?`;
    document.getElementById('message').innerText = '';
    document.getElementById('userAnswer').value = '';

    // 開始計時
    counter = 0;
    wrongAttempts = 0;
}

// ✅ 檢查使用者答案
function checkAnswer() {
    //---------------start
    if(WINCHECK){
        return
    }
    //---------------end

    const userAnswer = parseFloat(document.getElementById('userAnswer').value);

    if (isNaN(userAnswer)) {
        document.getElementById('message').innerText = '❌ 請輸入數字';
        return;
    }

    if (userAnswer === correctAnswer) {
        clearInterval(interval);
        document.getElementById('message').innerText = `✅ 正確答案！你花了 ${((Date.now() - startTime)/1000).toFixed(2)} 秒\n等待對手中...`;
        //-----------------------------------------start
        sendToServer({ "op":"add", "path":"/"+[CACHE]+"/"+[UID], "value":((Date.now() - startTime)/1000).toFixed(2) })
        WINCHECK = true
        //-----------------------------------------end

    } else {
        wrongAttempts++;
        document.getElementById('message').innerText = `❌ 錯誤！再試一次（錯誤次數: ${wrongAttempts}）`;
    }
}

// 初始化題目
document.addEventListener("DOMContentLoaded", () => {
    loadQuestion();

})

document.getElementById("mathButton").addEventListener("click", checkAnswer);d
