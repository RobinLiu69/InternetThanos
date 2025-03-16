document.addEventListener("DOMContentLoaded", () => {
    let countdown = 5;
    let totalTime = 30; // 遊戲開始後的倒數計時
    let shotsLeft = 3; // 剩餘可射擊次數
    let finalTime = 0;

    const countdownElement = document.getElementById("countdown");
    const gameContainer = document.getElementById("game-container");
    const viewCircle = document.getElementById("view-circle");
    const cross = document.getElementById("cross");
    const targetButton = document.getElementById("target-button");
    const backgroundImage = document.getElementById("background-image");
    const bulletElement = document.getElementById("bullet");
    const timeElement = document.getElementById("time");

    // 顯示子彈與時間
    bulletElement.textContent = `剩餘子彈: ${shotsLeft}`;
    timeElement.textContent = `時間: 0`;


    //-----------------------------------------start
    let UID = false
    let MAIN = false
    let CACHE = false
    let WINCHECK = false
    let counter = 0
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
            document.getElementById('basetext').textContent = `✅ 槍術很好\nYOU WIN!!!`;
        }
        if(message.id == "lose"){
            document.getElementById('basetext').textContent = `你被射死了, 你的${message.url}將被鎖5分鐘`;
        }
        if(message.id == "updateGame"){
            counter += 1;
            if(WINCHECK && Math.floor(counter) == counter && counter < 30 && counter % 3 == 0){
                whoWon()
            }
            if(counter >= 20 && !WINCHECK){
                sendToServer({ "op":"add", "path":"/"+[CACHE]+"/"+[UID], "value":-100 })
                document.getElementById('basetext').textContent = `❌ 超時!`
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

    // 倒數計時
    const countdownInterval = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        if (countdown === 0) {
            clearInterval(countdownInterval);
            startGame();
        }
    }, 1000);

    function startGame() {
        getUIDAndMain()
        countdownElement.style.display = "none";
        gameContainer.style.display = "block";
        targetButton.style.display = "block";
        backgroundImage.style.backgroundImage = "url('cowboy2.png')";
        document.body.style.cursor = "crosshair";
    
        let startTime = performance.now();
        
        function updateTime(elapsed) {
            let progressCircle = document.getElementById("progress-circle");
            let percent = elapsed / totalTime;
            let offset = 314 * (1 - percent);
            progressCircle.style.strokeDashoffset = offset;
        }

        // 遊戲計時（毫秒級）
        const gameTimer = setInterval(() => {
            let elapsedTime = performance.now() - startTime;
            let seconds = Math.floor(elapsedTime / 1000);
            let milliseconds = Math.floor(elapsedTime % 1000);
            timeElement.textContent = `時間: ${seconds}.${milliseconds.toString().padStart(3, '0')}`;

            if (elapsedTime >= totalTime * 1000 && finalTime == 0) {
                clearInterval(gameTimer);
                endGame();
            }
        

        }, 10); // 每 10 毫秒更新一次
    }
    

    function endGame() {
        alert("時間到！遊戲結束！");
        document.body.style.cursor = "default";
        targetButton.disabled = true;
    }

    let bullets = 3;

    function updateBullets() {
        let bulletContainer = document.getElementById("bullet-container");
        bulletContainer.innerHTML = ""; // 清空重新渲染
        for (let i = 0; i < bullets; i++) {
            let bullet = document.createElement("div");
            bullet.classList.add("bullet");
            bulletContainer.appendChild(bullet);
        }
    }

    function shoot() {
        if (bullets > 0) {
            bullets--;
            updateBullets();
        }
    }
    updateBullets()

    // 隨機準心偏移 (15% 視窗寬高)
    let offsetX = Math.random() * window.innerWidth * 0.4 * (Math.random() < 0.5 ? -1 : 1);
    let offsetY = Math.random() * window.innerHeight * 0.4 * (Math.random() < 0.5 ? -1 : 1);

    document.addEventListener("mousemove", (event) => {
        let targetX = event.clientX + offsetX;
        let targetY = event.clientY + offsetY;
    
        cross.style.left = `${targetX - 50}px`;
        cross.style.top = `${targetY - 50}px`;
    
        viewCircle.style.left = `${targetX - 50}px`;
        viewCircle.style.top = `${targetY - 50}px`;
    });
    

    targetButton.addEventListener("click", () => {
        if (shotsLeft <= 0) {
            alert("你已經射擊3次，無法再開槍！");
            return;
        }

        //---------------start
        if(WINCHECK){
            return;
        }
        //---------------end
    
        shotsLeft--;
        shoot()
        bulletElement.textContent = `剩餘子彈: ${shotsLeft}`;
    
        const buttonRect = targetButton.getBoundingClientRect();
        const centerX = buttonRect.left + buttonRect.width / 2;
        const centerY = buttonRect.top + buttonRect.height / 2;
    
        // 获取 cross 的位置
        const crossRect = cross.getBoundingClientRect();
        const crossCenterX = crossRect.left + crossRect.width / 2;
        const crossCenterY = crossRect.top + crossRect.height / 2;
    
        const hitboxX = window.innerWidth * 0.04; // 命中範圍 4% 視窗寬度
        const hitboxY = window.innerHeight * 0.2; // 命中範圍 20% 視窗高度
    
        // 增加 50% 機率強制 Miss（測試時用，可以改回 1%）
        const isMiss = Math.random() < 0.1 || Math.abs(crossCenterX - centerX) > hitboxX || Math.abs(crossCenterY - centerY) > hitboxY;
    
        if (isMiss) {
            // 让 MISS 文字出现在 cross 位置
            const missText = document.getElementById("miss-text");
            missText.style.left = `${crossCenterX}px`;
            missText.style.top = `${crossCenterY}px`;
            missText.style.opacity = "1";
            missText.style.transform = "translate(-50%, -50%) scale(1.5)";
    
            setTimeout(() => {
                missText.style.opacity = "0";
                missText.style.transform = "translate(-50%, -50%) scale(1)";
            }, 700);
    
        } else {
            backgroundImage.style.backgroundImage = "url('cowboy3.png')";
            finalTime = timeElement.textContent
            //-----------------------------------------start
            sendToServer({ "op":"add", "path":"/"+[CACHE]+"/"+[UID], "value":finalTime})
            WINCHECK = true
            //-----------------------------------------end
            console.log(finalTime)
        }
        if (shotsLeft === 0) {
            targetButton.disabled = true; // 禁用按鈕
        }
    });
    
});
