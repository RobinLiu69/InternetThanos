document.addEventListener("DOMContentLoaded", () => {
    const mazeContainer = document.getElementById("maze-container");
    const player = document.getElementById("player");
  
    // 設定玩家初始位置
    let playerX = 0;
    let playerY = 0;
  
    // 迷宮邊界的尺寸
    const mazeWidth = mazeContainer.offsetWidth;
    const mazeHeight = mazeContainer.offsetHeight;
  
    // 設定玩家的移動範圍
    const playerSize = player.offsetWidth;
  
    // 設置滑鼠移動事件
    mazeContainer.addEventListener("mousemove", (event) => {
      // 取得滑鼠的座標
      let mouseX = event.clientX - mazeContainer.offsetLeft;
      let mouseY = event.clientY - mazeContainer.offsetTop;
  
      // 控制玩家只能在迷宮內移動
      if (mouseX > mazeWidth - playerSize) mouseX = mazeWidth - playerSize;
      if (mouseY > mazeHeight - playerSize) mouseY = mazeHeight - playerSize;
      if (mouseX < 0) mouseX = 0;
      if (mouseY < 0) mouseY = 0;
  
      // 更新玩家位置
      player.style.left = mouseX + "px";
      player.style.top = mouseY + "px";
    });
  });
  