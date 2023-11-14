if (window.location.origin == "https://localhost") var domain = "https://games.zulhilmi.xyz"
else var domain = "http://192.168.1.13:3000"

let t = localStorage.getItem("token")
if (t != null) {
    fetch(`${domain}/api/ping`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${t}`
        }
    }).then(res => res.json())
        .then(res => {
            if (res.status != "OK") {
                alert("Your account might be deleted please register again")
                localStorage.clear()
                window.location.href = "./login.html"
            } else if (res.status == "OK") {
                let pre_store = JSON.parse(localStorage.getItem("configuration"))
                let sco_store = JSON.parse(localStorage.getItem("scores"))
                console.log(res.scores != sco_store)
                if (res.config != pre_store) {
                    updatePreferences()
                }
                if (res.scores != sco_store) {
                    let need_update = false
                    Object.keys(sco_store).forEach((game) => {
                        if (game == "trace") {
                            if ((res.scores[game] > sco_store[game] && sco_store[game] != 0) || res.scores[game] == 0) need_update = true
                        }
                        else if (res.scores[game] < sco_store[game]) {
                            need_update = true
                        }
                    })
                    if (need_update) save_score()
                }
            }
        })
}