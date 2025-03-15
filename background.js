const URLLINK = "https://json.extendsclass.com/bin/1684885865a7" // https://extendsclass.com/jsonstorage/1684885865a7
const IDLELINK = "https://json.extendsclass.com/bin/d9a563320dff" //https://extendsclass.com/jsonstorage/d9a563320dff
const VSLINK = "https://json.extendsclass.com/bin/e16604375e31"//https://extendsclass.com/jsonstorage/e16604375e31



let UID = '';



chrome.runtime.onInstalled.addListener(() => {
    const uidKey = "userUID";
    
    // 檢查 localStorage 是否已有 UID
    chrome.storage.local.get([uidKey], (result) => {
        if (!result[uidKey]) {
            const newUID = crypto.randomUUID();  // 產生新的 UID
            chrome.storage.local.set({ [uidKey]: newUID }, () => {
            console.log("新 UID 已生成：", newUID);
            });
        } else {
            console.log("已存在 UID：", result[uidKey]);
        }
    });
});
async function sendTabstoServerJS() {
    let links = new Promise((resolve, reject) => {
        chrome.tabs.query({}, (tabs) => {
            let ret = []
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
    	//chrome.runtime.sendMessage({links: message});
	})
}

// Generate UID

// Error in event handler: TypeError: Cannot read properties of undefined (reading 'local') at chrome-extension://pdgaddablmahdeilbjeccbcjchnlmcoa/background.js:45:20
chrome.runtime.onInstalled.addListener(async () => {
    const uidKey = "userUID";
    
    // 檢查 localStorage 是否已有 UID
    chrome.storage.local.get([uidKey], (result) => {
        if (!result[uidKey]) {
            const newUID = crypto.randomUUID();  // 產生新的 UID
			UID = newUID;
            chrome.storage.local.set({ [uidKey]: newUID }, () => {
                console.log("新 UID 已生成：", newUID);
            });
        } else {
			UID = result[uidKey]
            console.log("已存在 UID：", result[uidKey]);
        }
    });
});

// {id : "tabs", data: }
chrome.runtime.onInstalled.addListener(function() {
	//serverPatchJSON(URLLINK, JSON.stringify( { "op": "add", "path": "", "value": {}  } ))
	//startServer();
    console.log("擴展已安裝");
	sendTabstoServerJS()
    chrome.alarms.create("updateClock", {
      periodInMinutes: 1/60 // Runs every 1 minute
    });
    setInterval(checkBanned, 1000);
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
function checkBanned(){
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const tabUrl = tabs[0].url;
            const originUrl = new URL(tabUrl).origin;  // 獲取主網址
            console.log("完整網址:", tabUrl);
            console.log("主網址:", originUrl);
            
            chrome.storage.local.get(["bannedWebsites"], (result) => {
                if (!result["checkBannedWebsite"]) {
                    console.log("nope")
                    // return;
                } 
                let bannedWebsites = new Set("https://www.youtube.com");
                // let websites = JSON.parse(result["checkBannedWebsite"]);
                let time = formatTime(0, 0);
                console.log(time);
                // websites.forEach((value, key) => {
                //     console.log(key, value);
                // });        
                console.log(bannedWebsites.has(originUrl));
                if(bannedWebsites.has(originUrl) && tabUrl != "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley"){
                    console.log(123)
                    chrome.tabs.update(tabs[0].id, { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley" });
                }
            } )
            
        }
    });
}

//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------

async function serverPatchJSON(link, payload) {
    await fetch(link, {
        method: "PATCH",
        mode: "cors",
        headers: {
            "Content-type": "application/json-patch+json",
        },
        body: payload
    }).then(response => {
        console.log("response : ", response)
		console.log("patching payload : ", link + " : " + payload)
    }).catch(err => {console.log("error : ", err)})
}

async function serverGetJSON(link) {
    let responseJSON = await fetch(link, {
        method: "GET",
        mode: "cors",
        headers: {
            cache: "no-store"
        },
    })
    console.log("Got this from a cool place : ", link)
    let iddwadwak = await responseJSON.json()
    iddwadwak = new Map(Object.entries(iddwadwak))
	for (let [a, b] of iddwadwak){
		
	}
    return iddwadwak
}

async function serverUploadTabs(links){
	let origJSON = await serverGetJSON(URLLINK)

	console.log("the link", links)
	console.log("UID : ", UID)
	//for (let url of links){
	//	console.log("adding : ", url)
	//	serverPatchJSON(URLLINK, JSON.stringify({ "op":"add", "path":"/"+[url], "value":0 }))
	//}
	

	for (let url of links) {
        //console.log(url, "tf : ", origJSON.has(url))
        if(!origJSON.has(url)) {
			console.log("It dont got")
            //patchJSON(urlLink, JSON.stringify( { "op": "add", "path": "/"+url, "value": {UID:0} } ))
            console.log("addin url : ", url)
            //serverPatchJSON(URLLINK, JSON.stringify( { "op": "add", "path": "/"+[url], "value": {[UID] : 0}  } ))
            //origJSON.set(url, new Map([[UID, 0]]))
        }
        else if(!(origJSON.get("url"))){
			console.log("I DONT HAVE : ", origJSON.get("url"))
            //console.log(origJSON.get(url))
            //serverPatchJSON(URLLINK, JSON.stringify( { "op": "add", "path": "/"+[url]+"/"+[UID], "value": 0 } ))
        }
    }
}

function formatTime(min, hour) {
    let now = new Date();
    let date = now.getDate();
    now.setMinutes(now.getMinutes() + min);
    now.setHours(now.getHours() + hour);
    let hours = now.getHours().toString().padStart(2, '0');  // 取得小時並補齊兩位
    let minutes = now.getMinutes().toString().padStart(2, '0');  // 取得分鐘並補齊兩位
    
    return `${date}:${hours}:${minutes}`;  // 返回格式為 'HH:mm' 的字串
}

function getStorage(key){
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], (result) => {
            if (result[key]) {
                resolve(result[key]);  // 如果找到資料，解析資料
            } else {
                resolve("Nothing");  // 如果沒找到資料，解析 "Nothing"
            }
        } )
    })

}

async function serverGetBannedWebsite(link) {
    let time = formatTime(50, 0);
    console.log(time);
    let bannedWebsites = await getStorage("bannedWebsites");
    
    console.log(bannedWebsites);
    if (bannedWebsites == "Nothing") {
        bannedWebsites = {};
    } else{ 
        bannedWebsites = JSON.parse(bannedWebsites);
    }   
    bannedWebsites[link] = time;
    console.log(bannedWebsites);
    chrome.storage.local.set({ "bannedWebsites": JSON.stringify(bannedWebsites) }, () => {
        console.log("網站守門員設定完成");
    });
    
}


async function serverUpdateIdle(){
	await serverPatchJSON(IDLELINK, JSON.stringify( { "op":"add", "path":"/"+[UID], "value":Date.now() } ))
}

async function serverClearIdle(){
	let data = await serverGetJSON(IDLELINK)
	let urlData = await serverGetJSON(URLLINK)
	for (let [uid, tm] of data){
		if(Date.now() - tm > 30*1000){
			serverPatchJSON(IDLELINK, JSON.stringify( { "op":"remove", "path":"/"+[uid] } ))
			for(let [url, uids] of urlData){
				if(uid in uids){
					serverPatchJSON(IDLELINK, JSON.stringify( { "op":"remove", "path":"/"+[url]+"/"+[uid] } ))
				}
			}
		}
	}
}

import { serverAddLinkData } from "./tools.js"

function serverIsAdmin(){
	return UID == "b0e03bdb-40b3-4950-8b12-170d80e90412"
}

async function serverCheckMatches(){
	//games = ["math.html", "typing.html", "cowboy.html", "maze.html"]
	let games = ["math.html", "typing.html"]
	let tabs = await serverGetJSON(URLLINK)
	for (let [url, uids] of tabs) {
		let uid2 = false
		uids = new Map(Object.entries(uids))
		for (let [uid1, empty] of uids){
            if(!uid2){
				uid2 = uid1
			}
			else{
				let x = uid1+"-"+uid2
				let game = games[Math.floor(Math.random()*games.length)];
				game = game + serverAddLinkData(game)
				serverPatchJSON(VSLINK, {x: {"game" : game, uid1 : "", uid2 : "", "win" : ""} })
				uid2 = false
			}
		}
	}
}



async function serverUpdate() {
    let now = new Date();
    let seconds = now.getSeconds();
    // console.log(seconds);
	chrome.runtime.sendMessage({id: "clock", message: null });
	if(seconds == 0){
		//await serverUpdateIdle()
		if(serverIsAdmin()){
			await serverClearIdle()
			serverCheckMatches()
		}
	}
}

//"math.html?problem=16*15"