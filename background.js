const urlLink = "https://json.extendsclass.com/bin/1684885865a7" // https://extendsclass.com/jsonstorage/1684885865a7
const syncLink = "https://json.extendsclass.com/bin/d9a563320dff" //https://extendsclass.com/jsonstorage/d9a563320dff
const vsLink = "https://json.extendsclass.com/bin/e16604375e31"//https://extendsclass.com/jsonstorage/e16604375e31
let UID = false

async function sendTabstoServerJS() {
    links = new Promise((resolve, reject) => {
        chrome.tabs.query({}, (tabs) => {
            ret = []
            for (let i=0; i<tabs.length; i++) {
                let url = tabs[i].url
                if(url.substring(0, 8) == "https://"){
                    let stopIndex = -1
                    for (let j=8; j<url.length; j++){
                        if (url[j] == '/') {
                            stopIndex = j
                            break
                        }
                    }
                    ret.push((' ' + url.substring(8, stopIndex)).slice(1))
                }
            }
            if(ret) {
                resolve(ret)
            }
            else {
                reject("Nah id win")
            }
        })
    })
	
	links.then((message) => {
		serverUploadTabs(message)
    	chrome.runtime.sendMessage({links: message});
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
		chrome.runtime.sendMessage( {did: "update", data: null} )
	}
});


//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
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

function serverUploadTabs(links){

}

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
