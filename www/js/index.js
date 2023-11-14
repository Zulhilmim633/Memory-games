/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
const games_page = ["Typing", "Traces"]
const token = localStorage.getItem("token")

const account = localStorage.getItem("account")
if (account == null) {
    if (document.title != "Login") {
        window.location.href = "./login.html"
    }
}


// if (window.location.host == "127.0.0.1:5500") {
//     if (games_page.includes(document.title)) {
//         const modal = document.querySelector(".modal")
//         modal.addEventListener("click", (e) => {
//             if (e.target != modal.querySelector(".wrap") && e.target.parentNode != modal.querySelector(".wrap")) {
//                 modal.remove()
//             }
//         })
//     }
// } else {
    if (games_page.includes(document.title)) {
        const modal = document.querySelector(".modal")
        modal.addEventListener("click", return_home)
    }
// }

function return_home(e){
    if (e.target != modal.querySelector(".wrap") && e.target.parentNode != modal.querySelector(".wrap")) {
        window.location.href = "./index.html"
    }
}

const navigate = document.querySelector(".cover_nav")
const closing = document.querySelector(".closing")

document.querySelector(".nav").addEventListener("click", (e) => {
    const btns = navigate.querySelectorAll(".button")
    for (let btn of btns) {
        if (btn.innerText == document.title) {
            let save_theme = localStorage.getItem("theme") || getPreferences("theme")
            btn.style.color = save_theme == null ? "#fbfcfc" : save_theme
            btn.style.backgroundColor = "#474747"
        }
    }
    if (navigate.classList.contains("active")) return
    navigate.classList.add("active")
})


let clickCount = 0
document.addEventListener("backbutton", (ex) => {
    ex.preventDefault()
    if (!navigate.classList.contains("active")) {
        clickCount++;

        // If this is the first click, set a timer for 5 seconds
        if (clickCount === 1) {

            closing.style.display = "block"
            closing.style.opacity = 1

            timeout = setTimeout(() => {
                clickCount = 0; // Reset the click count if the timer expires

                let inter = setInterval(() => {
                    closing.style.opacity -= 0.1
                    if (closing.style.opacity <= 0) {
                        closing.style.display = "none"
                        clearInterval(inter)
                    }
                }, 35)

            }, 3000); // 5000 milliseconds = 5 seconds
        }

        // If the button was clicked twice within 5 seconds, do something
        if (clickCount === 2) {
            clearTimeout(timeout); // Clear the timer
            navigator.app.exitApp();
            clickCount = 0; // Reset the click count
        }
    }
    else navigate.classList.remove("active")

}, false)

document.querySelector(".app > .cover_nav > .close").addEventListener("click", (e) => {
    if (!navigate.classList.contains("active")) return
    navigate.classList.remove("active")
})

const need_change = document.querySelectorAll(".follow_theme")
need_change.forEach((item) => {
    follow_theme(item)
})

function get_score(key) {
    const pre = JSON.parse(localStorage.getItem("scores"))
    return pre[key]
}

function follow_theme(e) {
    const theme = localStorage.getItem("theme") || getPreferences("theme")
    e.style.color = theme != null ? theme : "#FBFCFC"
}

function setPreferences(key, value) {
    const pre = JSON.parse(localStorage.getItem("configuration"))
    pre[key] = value
    localStorage.setItem("configuration", JSON.stringify(pre))
}

function getPreferences(key) {
    const pre = JSON.parse(localStorage.getItem("configuration"))
    return pre[key]
}

function preferences() {
    return JSON.parse(localStorage.getItem("configuration"))
}

function save_score() {
    let score = JSON.parse(localStorage.getItem("scores"))
    console.log(score)
    fetch(`${domain}/api/leaderboard/update`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            data: score
        })
    })
}

async function updatePreferences() {
    fetch(`${domain}/api/account/config`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            config: preferences()
        })
    })
}