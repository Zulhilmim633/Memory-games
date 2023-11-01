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

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

let clickCount = 0
function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

const navigate = document.querySelector(".cover_nav")
const closing = document.querySelector(".closing")

document.querySelector(".nav").addEventListener("click", (e) => {
    const btns = navigate.querySelectorAll(".button")
    for (let btn of btns){
        if(btn.innerText == document.title){
            let save_theme = localStorage.getItem("theme")
            btn.style.color = save_theme == null ? "#fbfcfc" : save_theme
            btn.style.backgroundColor = "#474747"
        }
    }
    if (navigate.classList.contains("active")) return
    navigate.classList.add("active")
})


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

                let inter = setInterval(()=>{
                    closing.style.opacity -= 0.1
                    if(closing.style.opacity <= 0){
                        closing.style.display = "none"
                        clearInterval(inter)
                    }
                },35)

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
need_change.forEach((item)=>{
    follow_theme(item)
})

function follow_theme(e){
    const theme = localStorage.getItem("theme")
    e.style.color = theme != null ? theme : "#FBFCFC"
}