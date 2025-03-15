export function seeWhoWon(game, data){
    if(game == "math"){
        let uid1 = data.uids[0]
        let uid2 = data.uids[1]
        let t1 = data.uid1
        let t2 = data.uid2
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