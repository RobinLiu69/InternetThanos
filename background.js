const urlLink = "https://json.extendsclass.com/bin/1684885865a7" // https://extendsclass.com/jsonstorage/1684885865a7
const idleLink = "https://json.extendsclass.com/bin/d9a563320dff" //https://extendsclass.com/jsonstorage/d9a563320dff
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

// Generate UID
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

// {id : "tabs", data: }
chrome.runtime.onInstalled.addListener(function() {
	//startServer();
    console.log("擴展已安裝");
    chrome.alarms.create("updateClock", {
      periodInMinutes: 1/60 // Runs every 1 minute
    });
});

chrome.runtime.onUpdate.addListener(() => {
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
	let op = []
	for (let [url, uid] of links){
		op.push({ "op":"add", "path":"/"+[url]+"/"+[uid], "value":0 })
	}
	patchJSON(urlLink, JSON.stringify(op))
}

function updateIdle

function serverCheckMatches(){

}

let timeClock = -1

function serverUpdate() {
	timeClock += 1
	if(timeClock % 60 == 0){
		serverCheckMatches()
	}
}