let dice = [1, 2, 3, 4, 5];  // 初始骰子的數字
let lockedDice = [false, false, false, false, false]; // 判斷骰子是否被鎖定
let rollCount = 0; // 記錄重擲的次數

const diceCategories = [
    ["11111", "22222", "33333", "44444", "55555", "66666"],
    ['11112', '11113', '11114', '11115', '11116', 
    '12222', '22223', '22224', '22225', '22226', 
    '13333', '23333', '33334', '33335', '33336', 
    '14444', '24444', '34444', '44445', '44446', 
    '15555', '25555', '35555', '45555', '55556', 
    '16666', '26666', '36666', '46666', '56666'],
    ['11122', '11133', '11144', '11155', '11166', 
    '11222', '22233', '22244', '22255', '22266', 
    '11333', '22333', '33344', '33355', '33366', 
    '11444', '22444', '33444', '44455', '44466', 
    '11555', '22555', '33555', '44555', '55566', 
    '11666', '22666', '33666', '44666', '55666'],
    ['11123', '11124', '11134', '11125', '11135', 
    '11145', '11126', '11136', '11146', '11156', 
    '12223', '12224', '22234', '12225', '22235', 
    '22245', '12226', '22236', '22246', '22256', 
    '12333', '13334', '23334', '13335', '23335', 
    '33345', '13336', '23336', '33346', '33356', 
    '12444', '13444', '23444', '14445', '24445', 
    '34445', '14446', '24446', '34446', '44456', 
    '12555', '13555', '23555', '14555', '24555', 
    '34555', '15556', '25556', '35556', '45556', 
    '12666', '13666', '23666', '14666', '24666', 
    '34666', '15666', '25666', '35666', '45666'],
    ['11223', '11224', '11225', '11226', '11233', 
    '11334', '11335', '11336', '12233', '22334', 
    '22335', '22336', '11244', '11344', '11445', 
    '11446', '12244', '22344', '22445', '22446', 
    '13344', '23344', '33445', '33446', '11255', 
    '11355', '11455', '11556', '12255', '22355', 
    '22455', '22556', '13355', '23355', '33455', 
    '33556', '14455', '24455', '34455', '44556', 
    '11266', '11366', '11466', '11566', '12266', 
    '22366', '22466', '22566', '13366', '23366', 
    '33466', '33566', '14466', '24466', '34466', 
    '44566', '15566', '25566', '35566', '45566'],
    ['11234', '11235', '11245', '11345', '11236', 
    '11246', '11346', '11256', '11356', '11456', 
    '12234', '12235', '12245', '22345', '12236', 
    '12246', '22346', '12256', '22356', '22456', 
    '12334', '12335', '13345', '23345', '12336', 
    '13346', '23346', '13356', '23356', '33456', 
    '12344', '12445', '13445', '23445', '12446', 
    '13446', '23446', '14456', '24456', '34456', 
    '12355', '12455', '13455', '23455', '12556', 
    '13556', '23556', '14556', '24556', '34556', 
    '12366', '12466', '13466', '23466', '12566', 
    '13566', '23566', '14566', '24566', '34566',],
    ["12345", "12346", "12356", "12456", "13456", "23456"]
];

//-----------------------------------------start
let UID = false
let MAIN = false
let CACHE = false
let WINCHECK = false
let counter = 0
let LOCKIN = false
let finalScore = 0

async function sendToServer(message){
    console.log("\nI sent to server !\n", message)
	chrome.runtime.sendMessage({id: "patch",op: message });
}

async function whoWon(){
    console.log("\nknow who won\n")
    chrome.runtime.sendMessage({id: "whoWon", cache:CACHE, game:"dice"})
}

chrome.runtime.onMessage.addListener(async (message, sender, response) => {
    if(message.id == "win"){
        document.getElementById('message').textContent = `✅ 真幸運！你拿了 ${finalScore} 分\nYOU WIN!!!`;
    }
    if(message.id == "lose"){
        document.getElementById('message').textContent = `you don't have good luck:(, 你將被鎖5分鐘`;
    }
    if(message.id == "updateGame"){
        counter += 1;
        if(WINCHECK && Math.floor(counter) == counter && counter < 30 && counter % 3 == 0){
            whoWon()
        }
        if(counter >= 30 && !WINCHECK){
            sendToServer({ "op":"add", "path":"/"+[CACHE]+"/"+[UID], "value":-100 })
            document.getElementById('message').innerText = `❌ 超時!`
            WINCHECK = true
        }
    }
    if(message.id == "uid"){
        UID = message.uid
        // console.log("\n\nI GOT THE id ; \n\n", UID)
    }
})

function getUIDAndMain() {
    const params = new URLSearchParams(window.location.search);
    MAIN = params.get("isMain");
    CACHE = params.get("vslink");
    console.log("\n\n\n\n\nTHE MAIN CACHE : ", CACHE)
}
//-----------------------------------------end



const scores = [];
for (let i = 0; i < diceCategories.length; i++) {
    for (let j = 0; j < diceCategories[i].length; j++) {
        let score = ((7 - i) * 1000) + (j + 1);
        scores.push({ combination: diceCategories[i][j], score });
    }
}

// 生成隨機數
function rollDie() {
    return Math.floor(Math.random() * 6) + 1;
}

// 更新骰子顯示
function updateDice(x) {
    for (let i = 0; i < dice.length; i++) {
        const diceElement = document.getElementById(`dice${i + 1}`);
        if (!lockedDice[i] && x === 1) {
            const randomValue = rollDie();
            dice[i] = randomValue;
            diceElement.textContent = randomValue;
        }
        diceElement.classList.toggle('locked', lockedDice[i]);
    }
}

// 處理骰子點擊，鎖定骰子
function lockDice(index) {
    if (!lockedDice[index]) {
        lockedDice[index] = true;
        updateDice(0);
        checkGameStatus();
    }
}

// 將骰子組合轉成字串形式
function getDiceString() {
    return dice.slice().sort((a, b) => a - b).join("");
}

// 計算相同的骰子數量
function countSameDice() {
    let counts = {};
    dice.forEach(value => {
        counts[value] = (counts[value] || 0) + 1;
    });
    return Math.max(...Object.values(counts));
}

// 檢查遊戲是否結束
function checkGameStatus() {
    //---------------start
    if(WINCHECK){
        return;
    }
    const lockedCount = lockedDice.filter(locked => locked).length;
    //---------------end
    // 修改檢查條件：如果所有骰子已鎖定，直接計算並顯示分數
    if (lockedCount === 5) {
        document.getElementById('roll-button').disabled = true;
        document.getElementById('status-message').textContent = '所有骰子已鎖定！';

        const diceString = getDiceString();  // 取得鎖定的骰子組合
        console.log(diceString);
        finalScore = calculateScore(diceString); // 計算分數
        const diceSame = countSameDice(diceString);
        document.getElementById('score-message').textContent = `最多幾個相同: ${diceSame}`;
        document.getElementById('final-score-message').textContent = `最終分數: ${finalScore}`;
    } else if (lockedCount < 5 && rollCount >= 3) {
        document.getElementById('roll-button').disabled = true;
        document.getElementById('status-message').textContent = '重骰次數已達上限！';

        const diceString = getDiceString();  // 取得最後的骰子組合
        console.log(diceString);
        finalScore = calculateScore(diceString); // 計算分數
        const diceSame = countSameDice(diceString);
        document.getElementById('score-message').textContent = `最多幾個相同: ${diceSame}`;
        document.getElementById('final-score-message').textContent = `最終分數: ${finalScore}`;
    }
    if(rollCount == 3 || LOCKIN || lockedCount == 5){
        for (let i = 0; i < dice.length; i++) {
            lockDice(i);
        }
        //-----------------------------------------start
        sendToServer({ "op":"add", "path":"/"+[CACHE]+"/"+[UID], "value":finalScore})
        WINCHECK = true
        //-----------------------------------------end
    }
   
}



// 計算最終分數
function calculateScore(diceString) {
    const match = scores.find(item => item.combination === diceString);
    return match ? match.score : 0;
}

// 重擲未鎖定的骰子
document.getElementById('roll-button').addEventListener('click', () => {
    if (rollCount < 3) {
        rollCount++;
        if(!LOCKIN) updateDice(1);  
        checkGameStatus();
    }
});


// 處理骰子點擊，鎖定骰子
for (let i = 0; i < dice.length; i++) {
    document.getElementById(`dice${i + 1}`).addEventListener('click', () => lockDice(i));
}

document.getElementById("confirm").addEventListener('click', () => {
    LOCKIN = true;
    for (let i = 0; i < dice.length; i++) {
        lockDice(i);
    }
});

updateDice(1);  // 初始化骰子顯示
getUIDAndMain();
// 確保所有 HTML 元素載入後執行
window.addEventListener('DOMContentLoaded', () => {
    updateDice(1);
    getUIDAndMain();
})