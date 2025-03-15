//import { startServer } from "./server.js";
importScripts("server.js")
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


async function getTabs() {
  return new Promise((resolve, reject) => {

  })
}
// {id : "tabs", data: }
chrome.runtime.onInstalled.addListener(function() {
	//startServer();
    console.log("擴展已安裝");
    chrome.alarms.create("updateClock", {
      periodInMinutes: 1/60 // Runs every 1 minute
    });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "updateClock") {
	console.log("sending")
    chrome.runtime.sendMessage( {id: "update", data: null}, (response) => {
      console.log(response)
    } )
  }
});


//-------------------------------------------------------------------------------------------- 
async function patchJSON(link, op){
    fetch(link, {
        method : "PATCH",
        headers : {
            "Content-type": "application/json-patch+json",
            cache: "no-store"
        },
        body : op
    })
}

async function getJSON(link){
    let temp = await fetch(link + "?cache=" + Date.now().toString(), {
        method : "GET",
        headers : {
            cache: "no-store"
        },
    })
    return new Map(Object.entries(temp))
}

chrome.runtime.onMessage.addListener((message, sender, callback) => {
    print(message.id)
    if(message.id == "tabs"){
        let data = message.data
        let op = []
        for (let [url, uid] of data){
            op.push({ "op":"add", "path":"/"+[url]+"/"+[uid], "value":0 })
        }
        patchJSON(urlLink, JSON.stringify(op))
    }
    if(message.id == "update"){
        console.log("I GOT iT")
        callback({data : "i call back"})
    }
})
