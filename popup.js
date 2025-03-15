document.addEventListener("DOMContentLoaded", function () {
  const tabList = document.getElementById("tabList");
  const nameList = document.getElementById("nameList");
  const nameInput = document.getElementById("nameInput");
  const addNameBtn = document.getElementById("addName");

  // 獲取當前開啟的分頁（需要 Chrome 擴展權限）
  if (chrome.tabs) {
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach(tab => {
        let li = document.createElement("li");
        li.textContent = tab.title;
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
        if(nameList.childElementCount > 0){
            let usernameli = document.getElementById("username");
            usernameli.textContent = name
        }
        else{
            let li = document.createElement("li");
            li.textContent = name;
            li.id = "username";
            nameList.appendChild(li);
            nameInput.value = "";
        }
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, callback) => {
  print("yo", message, sender, callback)
  if(message.id == "tabs"){
      let data = message.data
      let op = []
      for (let [url, uid] of data){
          op.push({ "op":"add", "path":"/"+[url]+"/"+[uid], "value":0 })
      }
      patchJSON(urlLink, JSON.stringify(op))
  }
  if(message.did == "update"){
      console.log("I GOT iT")
      callback({data : "i call back"})
  }
})
