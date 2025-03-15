const urlLink = "https://json.extendsclass.com/bin/1684885865a7" // https://extendsclass.com/jsonstorage/1684885865a7
const syncLink = "https://json.extendsclass.com/bin/d9a563320dff" //https://extendsclass.com/jsonstorage/d9a563320dff
const vsLink = "https://json.extendsclass.com/bin/e16604375e31"//https://extendsclass.com/jsonstorage/e16604375e31
let UID = false

chrome.runtime.onInstalled.addListener(function() {
    console.log("擴展已安裝");
  });

async function patchJSON(link, op){
    fetch(link, {
        method : "PATCH",
        headers : {
            "Content-type": "application/json-patch+json",
        },
        body : op
    })
}

chrome.runtime.onMessage.addListener((message) => {
    if(message.id == "tabs"){
        data = message.data
        uid = message.uid
        for (let [url, uid] of data){
            patchJSON(urlLink, JSON.stringify( [{ "op":"add", "path":"/"+[url]+"/"+[uid], "value":0 },
                                                ] ))
        }
    }
})
