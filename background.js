const URLLINK = "https://json.extendsclass.com/bin/1684885865a7" // https://extendsclass.com/jsonstorage/1684885865a7
const IDLELINK = "https://json.extendsclass.com/bin/d9a563320dff" //https://extendsclass.com/jsonstorage/d9a563320dff
const VSLINK = "https://json.extendsclass.com/bin/e16604375e31"//https://extendsclass.com/jsonstorage/e16604375e31

let UID = '';
let ISADMIN = false

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
		console.log("sent at : ", Date.now())
		serverUploadTabs(message)
    	chrome.runtime.sendMessage({links: message});
	})
}

// Generate UID

// Error in event handler: TypeError: Cannot read properties of undefined (reading 'local') at chrome-extension://pdgaddablmahdeilbjeccbcjchnlmcoa/background.js:45:20
chrome.runtime.onInstalled.addListener(async () => {
    const uidKey = "userUID";
    
    // 檢查 localStorage 是否已有 UID
    if(UID){
		console.log("HAS")
		return;
	}
    chrome.storage.local.get([uidKey], (result) => {
        if (!result[uidKey]) {
            const newUID = crypto.randomUUID();  // 產生新的 UID
			UID = newUID;
            chrome.storage.local.set({ [uidKey]: newUID }, () => {
                console.log("新 UID 已生成：", newUID);
            });
        } else {
            console.log("已存在 UID：", result[uidKey]);
        }
    });
});

// {id : "tabs", data: }
chrome.runtime.onInstalled.addListener(function() {
	//startServer();
    console.log("擴展已安裝");
	sendTabstoServerJS()
    chrome.alarms.create("updateClock", {
      periodInMinutes: 1/60 // Runs every 1 minute
    });
});

chrome.tabs.onCreated.addListener(() => {
	sendTabstoServerJS()
})

chrome.tabs.onReplaced.addListener(() => {
	sendTabstoServerJS()
})

chrome.tabs.onRemoved.addListener(() => {
	sendTabstoServerJS()
})

chrome.alarms.onAlarm.addListener((alarm) => {
	if (alarm.name === "updateClock") {
		serverUpdate()
	}
});

//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------

async function serverPatchJSON(link, op){
	console.log(link, op)
    fetch(link, {
        method : "PATCH",
        headers : {
            "Content-type": "application/json-patch+json",
            cache: "no-store"
        },
        body : op
    }).then(response => {
        console.log("response : ", response)
	})
}

async function serverGetJSON(link){
    let temp = await fetch(link + "?cache=" + Date.now().toString(), {
        method : "GET",
        headers : {
            cache: "no-store"
        },
    })
    return new Map(Object.entries(temp))
}

function serverUploadTabs(links){
	console.log(links)
	for (let url of links){
		serverPatchJSON(URLLINK, JSON.stringify({ "op":"add", "path":"/"+[url]+"/"+[UID], "value":0 }))
	}
	serverPatchJSON(URLLINK, JSON.stringify(op))
}

async function serverUpdateIdle(){
	await serverPatchJSON(IDLELINK, JSON.stringify( { "op":"add", "path":"/"+[UID], "value":Date.now() } ))
}

async function serverClearIdle(){
	data = await serverGetJSON(URLLINK)
	for (let [uid, tm] of data){
		if(Date.now() - tm > 30*1000)
	}
}

import { serverAddLinkData } from "./tools.js"

async function serverCheckMatches(){
	//games = ["math.html", "typing.html", "cowboy.html", "maze.html"]
	games = ["math.html", "typing.html"]
	tabs = await serverGetJSON(URLLINK)
	for (let [url, uids] of tabs) {
		let uid2 = false
		for (let [uid1, empty] of uids){
            if(!uid2){
				uid2 = uid1
			}
			else{
				let x = uid1+"-"+uid2
				game = games[Math.floor(Math.random()*games.length)];
				game = game + serverAddLinkData(game)
				serverPatchJSON(VSLINK, {x: {"game" : game, uid1 : "", uid2 : "", "win" : ""} })
				uid2 = false
			}
		}
	}
}

let timeClock = -1

async function serverUpdate() {
	timeClock += 1
	
	if(timeClock % 60 == 0){
		//await serverUpdateIdle()
		if(ISADMIN){
			await serverClearIdle()
			serverCheckMatches()
		}
	}
}

//"math.html?problem=16*15"