export function seeWhoWon(game, data){
    if(game == "math"){
        console.log("\n\n\nThe data IN minigamE tools ; \n", data, data.uids[0], data.uids[1], data.uid1, data.uid2)
        let uid1 = data.uids[0]
        let uid2 = data.uids[1]
        let t1 = data[uid1]
        let t2 = data[uid2]
        if(t1 && t2){
            if(t1 < t2)
                return {"winner" : uid1, "loser" : uid2}
            else
                return {"winner" : uid2, "loser" : uid1}
        }
        else{
            return {"winner" : false, "loser" : false}
        }
    }
    if(game == "type"){
        console.log("\n\n\nThe data IN minigamE tools ; \n", data, data.uids[0], data.uids[1], data.uid1, data.uid2)
        let uid1 = data.uids[0]
        let uid2 = data.uids[1]
        let t1 = data[uid1]
        let t2 = data[uid2]
        if(t1 && t2){
            if(t1 < t2)
                return {"winner" : uid1, "loser" : uid2}
            else
                return {"winner" : uid2, "loser" : uid1}
        }
        else{
            return {"winner" : false, "loser" : false}
        }
    }
    if(game == "maze"){
        console.log("\n\n\nThe data IN minigamE tools (maze); \n", data, data.uids[0], data.uids[1], data.uid1, data.uid2)
        let uid1 = data.uids[0]
        let uid2 = data.uids[1]
        let t1 = data[uid1]
        let t2 = data[uid2]
        if(t1 && t2){
            if(t1 < t2)
                return {"winner" : uid1, "loser" : uid2}
            else
                return {"winner" : uid2, "loser" : uid1}
        }
        else{
            return {"winner" : false, "loser" : false}
        }
    }
    if(game == "dice"){
        console.log("\n\n\nThe data IN minigamE tools (dice); \n", data, data.uids[0], data.uids[1], data.uid1, data.uid2)
        let uid1 = data.uids[0]
        let uid2 = data.uids[1]
        let score1 = data[uid1]
        let score2 = data[uid2]
        if(score1 && score2){
            if(score1 > score2)
                return {"winner" : uid1, "loser" : uid2}
            else
                return {"winner" : uid2, "loser" : uid1}
        }
        else{
            return {"winner" : false, "loser" : false}
        }
    }
    if(game == "cowboy"){
        console.log("\n\n\nThe data IN minigamE tools (maze); \n", data, data.uids[0], data.uids[1], data.uid1, data.uid2)
        let uid1 = data.uids[0]
        let uid2 = data.uids[1]
        let t1 = data[uid1]
        let t2 = data[uid2]
        if(t1 && t2){
            if(t1 < t2)
                return {"winner" : uid1, "loser" : uid2}
            else
                return {"winner" : uid2, "loser" : uid1}
        }
        else{
            return {"winner" : false, "loser" : false}
        }
    }
}