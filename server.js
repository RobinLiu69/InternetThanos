const urlLink = "https://json.extendsclass.com/bin/1684885865a7" // https://extendsclass.com/jsonstorage/1684885865a7
const syncLink = "https://json.extendsclass.com/bin/d9a563320dff" //https://extendsclass.com/jsonstorage/d9a563320dff
const vsLink = "https://json.extendsclass.com/bin/e16604375e31"//https://extendsclass.com/jsonstorage/e16604375e31
let UID = false

chrome.runtime.onInstalled.addListener(function() {
    console.log("擴展已安裝");
  });

export function startServer() {
    console.log("Server started from server.js");
}

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
    if(message.id == "tabs"){
        let data = message.data
        let op = []
        for (let [url, uid] of data){
            op.push({ "op":"add", "path":"/"+[url]+"/"+[uid], "value":0 })
        }
        patchJSON(urlLink, JSON.stringify(op))
    }
    else if(message.id == "update"){
        console.log("I GOT iT")
        callback({data : "i call back"})
    }
})
