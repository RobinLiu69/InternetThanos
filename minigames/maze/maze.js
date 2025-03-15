const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const size = 15;
const cols = 25;
const rows = 25;
canvas.width = cols * size;
canvas.height = rows * size;

let maze = Array(rows).fill().map(() => Array(cols).fill(1));
let stack = [];
let current = { x: 0, y: 0 };
let end = { x: cols - 1, y: rows - 1 };
let path = new Set();

let startTime = null;
let timerInterval = null;

// 生成迷宮
function generateMaze() {
    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }
    function carve(x, y) {
        maze[y][x] = 0;
        path.add(`${x},${y}`);
        let directions = shuffle([[1, 0], [-1, 0], [0, 1], [0, -1]]);
        for (let [dx, dy] of directions) {
            let nx = x + dx * 2, ny = y + dy * 2;
            if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && maze[ny][nx] === 1) {
                maze[y + dy][x + dx] = 0;
                carve(nx, ny);
            }
        }
    }
    carve(0, 0);
}

// 畫迷宮
function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            ctx.fillStyle = maze[y][x] ? "black" : "white";
            ctx.fillRect(x * size, y * size, size, size);
        }
    }
    // 起點
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, size, size);
    // 終點
    ctx.fillStyle = "red";
    ctx.fillRect(end.x * size, end.y * size, size, size);
}

// 更新計時器
function updateTimer() {
    if (startTime) {
        const elapsed = (Date.now() - startTime) / 1000;
        document.getElementById("timer").innerText = `時間：${elapsed} 秒`;
    }
}

// 開始計時
function startTimer() {
    if (!startTime) {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1);
    }
}

// 滑鼠移動事件
canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / size);
    const y = Math.floor((e.clientY - rect.top) / size);

    // 如果碰到黑色方塊，重置回起點
    if (maze[y] && maze[y][x] === 1) {
        e.preventDefault();
        canvas.style.cursor = "pointer"; // 可以更改滑鼠樣式
        // 讓滑鼠位置回到起點 (0, 0)
        e.clientX = rect.left + 0;
        e.clientY = rect.top + 0;
        return; // 停止執行進一步的邏輯
    }

    // 如果滑到白色區域（可以走的路）
    if (path.has(`${x},${y}`)) {
        startTimer(); // 開始計時

        // 如果到達終點
        if (x === end.x && y === end.y) {
            document.getElementById("status").innerText = "恭喜！你完成了迷宮！";
            clearInterval(timerInterval); // 停止計時器
        } else {
            document.getElementById("status").innerText = "請沿著白色道路行走！";
        }
    } else {
        document.getElementById("status").innerText = "請沿著白色道路行走！";
    }
});

generateMaze();
drawMaze();