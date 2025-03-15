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

async function serverPatchJSON(link, payload) {
    fetch(link, {
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
    // Fetch the response
    let response = await fetch(link + "?cache=" + Date.now().toString(), {
        method: "GET",
        headers: {}
    });
    
    // Parse the response as JSON
    let jsonData = await response.json();
    
    // Convert the JSON object to a Map
    return new Map(Object.entries(jsonData));
}


async function serverUploadTabs(links){
	let origJSON = await serverGetJSON(URLLINK)
	console.log(links)
	console.log("UID : ", UID)
	//for (let url of links){
	//	console.log("adding : ", url)
	//	serverPatchJSON(URLLINK, JSON.stringify({ "op":"add", "path":"/"+[url], "value":0 }))
	//}
	console.log("in upload tabs : ", JSON.stringify(origJSON))
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

async function serverUpdateIdle(){
	await serverPatchJSON(IDLELINK, JSON.stringify( { "op":"add", "path":"/"+[UID], "value":Date.now() } ))
}

async function serverClearIdle(){
	let data = await serverGetJSON(IDLELINK)
	let urlData = await serverGetJSON(URLLINK)
	for (let [uid, tm] of data){
<<<<<<< HEAD
		if(Date.now() - tm > 30*1000){}
=======
		if(Date.now() - tm > 30*1000){
			serverPatchJSON(IDLELINK, JSON.stringify( { "op":"remove", "path":"/"+[uid] } ))
			for(let [url, uids] of urlData){
				if(uids.has(uid)){
					serverPatchJSON(IDLELINK, JSON.stringify( { "op":"remove", "path":"/"+[url]+"/"+[uid] } ))
				}
			}
		}
>>>>>>> c2ba824456f999eca8551ea4ca2878cb7f87f395
	}
}

// import { serverAddLinkData } from "./tools.js"

function serverIsAdmin(){
	return UID == "b0e03bdb-40b3-4950-8b12-170d80e90412"
}

async function serverCheckMatches(){
	//games = ["math.html", "typing.html", "cowboy.html", "maze.html"]
	let games = ["math.html", "typing.html"]
	let tabs = await serverGetJSON(URLLINK)
	for (let [url, uids] of tabs) {
		let uid2 = false
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

let timeClock = -1

async function serverUpdate() {
	timeClock += 1
	chrome.runtime.sendMessage({id: "clock", message: timeClock });
    console.log(timeClock);
<<<<<<< HEAD
	if(timeClock % 60 == 0){
=======
	if(timeClock % 5 == 0){
>>>>>>> c2ba824456f999eca8551ea4ca2878cb7f87f395
		//await serverUpdateIdle()
		if(serverIsAdmin()){
			await serverClearIdle()
			serverCheckMatches()
		}
	}
}

//"math.html?problem=16*15"