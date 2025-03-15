document.addEventListener("DOMContentLoaded", () => {
    let countdown = 5;
    const countdownElement = document.getElementById("countdown");
    const gameContainer = document.getElementById("game-container");
    const viewCircle = document.getElementById("view-circle");
    const cross = document.getElementById("cross");
    const targetButton = document.getElementById("target-button");
    const backgroundImage = document.getElementById("background-image");

    let circleX = Math.random() * (window.innerWidth - 100);
    let circleY = Math.random() * (window.innerHeight - 100);
    viewCircle.style.left = `${circleX}px`;
    viewCircle.style.top = `${circleY}px`;

    
    const countdownInterval = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        if (countdown === 0) {
            clearInterval(countdownInterval);
            countdownElement.style.display = "none";
            gameContainer.style.display = "block";
            targetButton.style.display = "block";
            backgroundImage.style.backgroundImage = "url('cowboy2.png')";
            
            document.body.style.cursor = "none";

        }
    }, 1000);

    
    const randomOffsetX = Math.random() * (Math.random()<0.5 ? -1 : 1) * 250;
    const randomOffsetY = Math.random() *  (Math.random()<0.5 ? -1 : 1) * 250;

    
    document.addEventListener("mousemove", (event) => {
        const dx = event.clientX + randomOffsetX - (circleX + 50);
        const dy = event.clientY + randomOffsetY - (circleY + 50);
        const distance = Math.sqrt(dx * dx + dy * dy);

        
        if (distance > 1) {
            circleX += dx;
            circleY += dy;
            cross.style.left = `${circleX}px`;
            cross.style.top = `${circleY}px`;
            viewCircle.style.left = `${circleX}px`;
            viewCircle.style.top = `${circleY}px`;
        }
    });

    
    targetButton.addEventListener("click", (event) => {
        const buttonRect = targetButton.getBoundingClientRect();
        const centerX = buttonRect.left + buttonRect.width / 2;
        const centerY = buttonRect.top + buttonRect.height / 2;
        console.log(centerX, centerY)

        
        const crossCenterX = circleX + 50;
        const crossCenterY = circleY + 50;
        console.log(crossCenterX, crossCenterY)
        
        
        const hitboxX = 40;
        const hitboxY = 100
        if (Math.abs(crossCenterX - centerX) < hitboxX && Math.abs(crossCenterY - centerY) < hitboxY) {
            console.log("成功!")
        } else {
            console.log("請將圓形視野移動到中央再點擊!")
        }
    });
});
