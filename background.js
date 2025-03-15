const URLLINK = "https://json.extendsclass.com/bin/1684885865a7" // https://extendsclass.com/jsonstorage/1684885865a7
const IDLELINK = "https://json.extendsclass.com/bin/d9a563320dff" //https://extendsclass.com/jsonstorage/d9a563320dff
const VSLINK = "https://json.extendsclass.com/bin/e16604375e31"//https://extendsclass.com/jsonstorage/e16604375e31



let UID = '';
let LASTLINKS = new Map()
let STARTCHECKINGMATCHES = 10



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
            let ret = new Map()
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
                    ret.set((' ' + url.substring(8, stopIndex)).slice(1), 0)
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
	//startServer();
    console.log("擴展已安裝");
	sendTabstoServerJS()
    chrome.alarms.create("updateClock", {
      periodInMinutes: 1/60 // Runs every 1 minute
    });
    setInterval(() => {
        checkBanned();
    }, 1000);
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
        if(STARTCHECKINGMATCHES <= 5){
            STARTCHECKINGMATCHES+=1
            clientCheckMatch()
        }
	}
});

// if 1 > 2 return true else false;
function checkTime(time1, time2){
    console.log(time1, time2);
    let array1 = time1.split(":");
    let array2 = time2.split(":");
    if(array1[0] > array2[0] || array1[1] > array2[1] || array1[2] >= array2[2]) return true;
    return false;
}

function checkBanned(){
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const tabUrl = tabs[0].url;
            const originUrl = new URL(tabUrl).origin;  // 獲取主網址
            // console.log("完整網址:", tabUrl);
            // console.log("主網址:", originUrl);

            chrome.storage.local.get(["bannedWebsites"], (result) => {
                if (!result["bannedWebsites"]) {
                    // console.log("nope")
                    return;
                } 
                let bannedWebsites = new Set();
                let websites = JSON.parse(result["bannedWebsites"]);
                let currtime = formatTime(0, 0);
                for (const [key, value] of Object.entries(websites)) {
                    if(!checkTime(currtime, value)) bannedWebsites.add(key);
                }
                // console.log(websites);
                // console.log(bannedWebsites);
                if(bannedWebsites.has(originUrl) && tabUrl != "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley"){
                    chrome.tabs.update(tabs[0].id, { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley" });
                }
            } )
            
        }
    });
}

async function clientCheckMatch(){
    let vs = await serverGetJSON(VSLINK)
    for(let [uids, data] of vs){
        if(uids.includes(UID)){
            chrome.tabs.create({url: data.get("game")})
        }
    }
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
	for (let [a, b] of origJSON){
	}
	console.log("in tabs : ", origJSON)

	for (let [url, t] of links) {
        //console.log(url, "tf : ", origJSON.has(url))
		if(!(LASTLINKS.has(url))){
			if(!origJSON.has(url)) {
				console.log("It dont got")
				//patchJSON(urlLink, JSON.stringify( { "op": "add", "path": "/"+url, "value": {UID:0} } ))
				console.log("addin url : ", url)
				serverPatchJSON(URLLINK, JSON.stringify( { "op": "add", "path": "/"+[url], "value": {[UID] : 0}  } ))
				//origJSON.set(url, new Map([[UID, 0]]))
			}
			else{
				//console.log("I DONT HAVE : ", origJSON[0])
				//console.log(origJSON.get(url))
				serverPatchJSON(URLLINK, JSON.stringify( { "op": "add", "path": "/"+[url]+"/"+[UID], "value": 0 } ))
			}
		}
    }

	for (let [url, t] of LASTLINKS) {
        //console.log(url, "tf : ", origJSON.has(url))
		if(!(links.has(url))){
			serverPatchJSON(URLLINK, JSON.stringify( { "op": "remove", "path": "/"+[url] } ))
		}
    }

	LASTLINKS = links
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
    let time = formatTime(0, 1);
    // console.log(time);
    let bannedWebsites = await getStorage("bannedWebsites");
    
    // console.log(bannedWebsites);
    if (bannedWebsites == "Nothing") {
        bannedWebsites = {};
    } else{ 
        bannedWebsites = JSON.parse(bannedWebsites);
    }   
    link = new URL(link).origin;
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
	console.log("\n\n\n\n\nMATCH IS GOING \n\n\n\n\n")
	//games = ["math.html", "typing.html", "cowboy.html", "maze.html"]
	let games = ["math.html"]
	let tabs = await serverGetJSON(URLLINK)
	for (let [url, uids] of tabs) {
		let uid2 = false
		uids = new Map(Object.entries(uids))
		for (let [uid1, empty] of uids){
            if(!uid2){
				uid2 = uid1
			}
			else{
                let dateCache = Date.now().toString()
				let x = uid1+"-"+uid2+dateCache
				let game = games[Math.floor(Math.random()*games.length)];
                let isMain = UID == uid1
				game = game + serverAddLinkData(game) + ",uid=" + [UID] + ",vslink=" + x + ",isMain="
                if(isMain) game = game+"true";
                else game = game+"false";
				console.log("\n\n, there is a match!!! : ", uid1, uid2)
				serverPatchJSON(VSLINK, JSON.stringify({"op": "add", "path": "/"+[x], "value": {"game" : [game], [uid1] : "", [uid2] : "", "uids": [uid1, uid2]} }))
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
        STARTCHECKINGMATCHES = 0
		await serverUpdateIdle()
		if(serverIsAdmin()){
			serverPatchJSON(VSLINK, JSON.stringify( { "op": "add", "path": "", "value": {}  } ))
			await serverClearIdle()
			serverCheckMatches()
		}
	}
}

import { seeWhoWon } from "./minigames/minigameTools.js"

chrome.runtime.onMessage.addListener(async (message, sender, response) => {
    if(message.id == "patch"){
        serverPatchJSON(VSLINK, JSON.stringify(op))
    }
    if(message.id == "whoWon"){
        let vs = await serverGetJSON(VSLINK)
        for (let [vslink, data] of vs){
            if(vslink == message.cache){
                let ret = seeWhoWon(message.game, data)
                if(ret.winner == UID){
                    chrome.runtime.sendMessage({id: "win" });
                }
                if(ret.loser == UID){
                    chrome.runtime.sendMessage({id: "lose"})
                }
                break
            }
        }
    }
})

//"math.html?problem=16*15"