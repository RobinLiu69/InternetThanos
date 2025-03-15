function generateNumbers() {
    num1 = Math.floor(Math.random() * 100) + 1;
    num2 = Math.floor(Math.random() * 100) + 1;

    const operators = ['+', '-', '*', '/'];
    let operator = operators[Math.floor(Math.random() * operators.length)];

    // 確保不會產生負數或小數
    if (operator === '-') {
        if (num1 < num2) [num1, num2] = [num2, num1];
    }
    if (operator === '/') {
        while (num1 % num2 !== 0) {
            num1 = Math.floor(Math.random() * 100) + 1;
            num2 = Math.floor(Math.random() * 100) + 1;
        }
    }
    return "?problem="+num1+operator+num2
}

const typeText = [
    "ChatGPT+is+not+stupid",
    "Hackers+love+new+technology",
    "Can+you+hack+this",
    "ChatGPT+learns+from+data",
    "This+technology+is+amazing",
    "Stupid+people+fear+hackers",
    "I+want+to+hack+it",
    "ChatGPT+helps+with+coding",
    "Technology+changes+our+lives",
    "Hackers+can+be+dangerous",
    "AI+is+not+stupid",
    "ChatGPT+answers+questions+fast",
    "Stupid+mistakes+cause+problems",
    "Hackers+break+into+systems",
    "ChatGPT+is+helpful+technology",
    "Can+AI+be+hacked",
    "Stupid+bugs+crash+technology",
    "Hackers+use+smart+methods",
    "ChatGPT+makes+life+easier",
    "Technology+evolves+every+day",
    "I+drink+coffee+daily",
    "Breakfast+is+very+important",
    "Sleep+early+stay+healthy",
    "Walking+is+good+exercise",
    "I+love+home+cooked+food",
    "Clean+your+room+often",
    "Cooking+is+really+fun",
    "Water+keeps+you+hydrated",
    "Family+time+is+precious",
    "Always+lock+your+door"
  ];

export function serverAddLinkData(game){
    if(game == "math.html"){
        return generateNumbers()
    }
    if(game == "type.html"){
        return "?problem=" + typeText[Math.floor(Math.random()*typeText.length)]
    }
    else{
        return "?problem=NONE"
    }
}