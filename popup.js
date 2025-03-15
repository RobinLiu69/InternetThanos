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
    if (name) {
      let li = document.createElement("li");
      li.textContent = name;
      nameList.appendChild(li);
      nameInput.value = "";
    }
  });
});
