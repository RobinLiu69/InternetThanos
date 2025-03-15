const button = document.querySelector('#counter > button');
let counter = 0;
let interval;
let correctAnswer = null;
let wrongAttempts = 0;

// ✅ 從 URL 讀取數學題目
function getProblemFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("problem"); // 取得 "problem" 參數
}

// ✅ 解析運算式並計算答案
function calculateAnswer(expression) {
    // 去掉多餘的空格
    expression = expression.replace(/\s+/g, '');

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
    const problem = getProblemFromURL();
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
    clearInterval(interval);
    interval = setInterval(() => {
        counter += 0.05;
        button.innerText = counter.toFixed(2);
    }, 50);
}

// ✅ 檢查使用者答案
function checkAnswer() {
    const userAnswer = parseFloat(document.getElementById('userAnswer').value);

    if (isNaN(userAnswer)) {
        document.getElementById('message').innerText = '❌ 請輸入數字';
        return;
    }

    if (userAnswer === correctAnswer) {
        clearInterval(interval);
        document.getElementById('message').innerText = `✅ 正確答案！你花了 ${counter.toFixed(2)} 秒`;
    } else {
        wrongAttempts++;
        document.getElementById('message').innerText = `❌ 錯誤！再試一次（錯誤次數: ${wrongAttempts}）`;
    }
}

// 初始化題目
loadQuestion();
