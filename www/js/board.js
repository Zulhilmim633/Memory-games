const display = document.querySelector(".selector")
const lefty = display.querySelector(".left")
const righty = display.querySelector(".right")
const text = display.querySelector("span")
const board = document.querySelector(".scores")

var click = 0
text.style.textAlign = "center"
text.innerText = calcIndexGames(click)
getScore(click)

document.addEventListener("offline",()=>{
    document.addEventListener("online",()=>{
        window.location.reload()
    },false)
},false)

lefty.addEventListener("click", async (e) => {
    click--
    text.innerText = calcIndexGames(click)
    const scores = await getScore(click)
})

righty.addEventListener("click", async (e) => {
    click++
    text.innerText = calcIndexGames(click)
    const scores = await getScore(click)
})

async function getScore(game) {
    var game_type = [
        "type_e",
        "type_m",
        "type_h",
        "trace"
    ]
    const length = game_type.length
    const games = game_type[(game % length + length) % length]
    let scores = {}
    try {
        const scores_fetch = await fetch(`${domain}/api/leaderboard?game=${games}`, {
            method: "GET",
            headers: {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        })
        scores = await scores_fetch.json()
    } catch (error) {
        alert("Turn on your network")
        scores.status = "OK"
        scores.board = []
    }
    var data = []
    if (scores.status == "OK") {
        const game = {
            type_e: "type_easy",
            type_m: "type_med",
            type_h: "type_hard",
            trace: "trace"
        }

        data = scores.board
        board.innerHTML = ""
        let not_play = []
        for (const score of scores.board) {
            const player = document.createElement("div")
            player.classList.add("player")
            let val
            if (games != "trace") val = score.scores[game[games]].toLocaleString()
            else {
                if (score.scores[game[games]]==0) {
                    not_play.push(score)
                    continue
                }
                val = `${score.scores[game[games]]}s`
            }
            player.innerHTML = `<span class="user">${score.username}</span><span class="score">${val}</span>`
            board.appendChild(player)
        }
        for(const late of not_play){
            const player = document.createElement("div")
            player.classList.add("player")
            val = `Not play yet`
            player.innerHTML = `<span class="user">${late.username}</span><span class="score">${val}</span>`
            board.appendChild(player)
        }
    }
    return data
}

function calcIndexGames(cli) {
    const test = [
        "Typing - Easy",
        "Typing - Medium",
        "Typing - Hard",
        "Traces"
    ]
    const length = test.length
    return test[(cli % length + length) % length]
}