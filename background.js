const urlLink = "https://json.extendsclass.com/bin/1684885865a7" // https://extendsclass.com/jsonstorage/1684885865a7
const syncLink = "https://json.extendsclass.com/bin/d9a563320dff" //https://extendsclass.com/jsonstorage/d9a563320dff
const vsLink = "https://json.extendsclass.com/bin/e16604375e31"//https://extendsclass.com/jsonstorage/e16604375e31
let UID = false

async function sendTabstoServerJS() {
    message = [];
    if (chrome.tabs) {
        chrome.tabs.query({}, function (tabs) {
          tabs.forEach(tab => {
            message.push(tab.title);
          });
        });
      }
    chrome.runtime.sendMessage({links: message});
}


chrome.runtime.onInstalled.addListener(function() {
    console.log("擴展已安裝");
});
