document.addEventListener("DOMContentLoaded", function () {
    const tabList = document.getElementById("tabList");
    const nameList = document.getElementById("nameList");
    const nameInput = document.getElementById("nameInput");
    const addNameBtn = document.getElementById("addName");
    const uidKey = "userUID";
    
    // 從 localStorage 取得 UID 並顯示
    chrome.storage.local.get([uidKey], (result) => {
        if (result[uidKey]) {
            let li = document.createElement("li");
            li.textContent = "UID: " + result[uidKey];
            nameList.appendChild(li);
            console.log("您的 UID：" + result[uidKey]);
        } else {
            console.log("UID 尚未生成，請重新載入擴充功能。");
        }
    });
    index = 0;
    if (chrome.tabs) {
        chrome.tabs.query({}, function (tabs) {
        tabs.forEach(tab => {
            index += 1;
            let li = document.createElement("li");
            // li.textContent = tab.title;
            const divLink = document.createElement('div');
            divLink.classList.add('link');
            divLink.textContent = tab.title;
            const divNumber = document.createElement('div');
            divNumber.classList.add('number');
            divNumber.textContent = index + "👥";

            // 把 div 加到 li 內
            li.appendChild(divLink);
            li.appendChild(divNumber);
            tabList.appendChild(li);
        });
        });
    } else {
        let li = document.createElement("li");
        li.textContent = "無法獲取分頁（請在 Chrome 擴展中運行）";
        tabList.appendChild(li);
    }

  // 添加名稱到列表
    addNameBtn.addEventListener("click", function () {
    let name = nameInput.value.trim();
    console.log(nameList.childElementCount)
    if (name) {
        if(nameList.childElementCount >= 2){
            let usernameli = document.getElementById("username");
            usernameli.textContent = "Username: " + name;
        }
        else{
            let li = document.createElement("li");
            li.textContent = "Username: " + name;
            li.id = "username";
            nameList.appendChild(li);
            nameInput.value = "";
        }
    }
  });
});
