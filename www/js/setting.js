const colors = document.querySelectorAll(".color");
let save_theme = localStorage.getItem("theme") || getPreferences("theme")
const picker = document.querySelector(".color_theme > div > input[type=color]")
const acc_type = localStorage.getItem("account")
const app = document.querySelector(".app")
var email

document.addEventListener("offline", () => {
    document.addEventListener("online", () => {
        window.location.reload()
    }, false)
}, false)

save_theme != null ? picker.value = save_theme : picker.value = "#FFFFFF"
for (let color of colors) {
    const col = color.getAttribute("attr-color")
    color.style.border = `3px solid ${col}`
    color.style.background = col
    if ((save_theme != null && save_theme == col) || getPreferences("theme") == col) {
        color.style.border = "4px solid grey"
    } else { color.style.border = "none" }
    color.addEventListener("click", (e) => {
        colors.forEach(othe => {
            othe.style.border = "none"
        })
        color.style.border = "4px solid grey"
        picker.value = col
        if (acc_type == "email") {
            document.querySelector("div.account > form > div > input[type=submit]").style.backgroundColor = col
            updatePreferences()
        }
        document.querySelectorAll(".follow_theme").forEach(nodes => {
            nodes.style.color = col
        })
        setPreferences("theme", col)
        // localStorage.setItem('theme', e.target.getAttribute("attr-color"))
    })
}

picker.value = getPreferences("theme")
picker.addEventListener("change", (e) => {
    e.preventDefault()
    setPreferences("theme", e.target.value)
    // localStorage.setItem('theme', e.target.value)
    colors.forEach(othe => {
        othe.style.border = "none"
    })
    if (acc_type == "email") {
        document.querySelector("div.account > form > div > input[type=submit]").style.backgroundColor = e.target.value
        updatePreferences()
    }
    document.querySelectorAll(".follow_theme").forEach(nodes => {
        nodes.style.color = e.target.value
    })
    console.log(e.target.value);
})

getAccount()

async function getAccount() {
    const token = localStorage.getItem("token")
    let data = {}
    if (token != null) {
        try {

            const user = await fetch(`${domain}/api/account/detail`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            data = await user.json()
        } catch (error) {
            alert("You offline")
        }
        if (data.status == "OK") {
            localStorage.setItem("username", data.data.username)
            email = data.data.email
        }
        else {
            email = ""
        }
    }

    const acc = document.createElement("div")
    acc.classList.add("account")
    acc.style = acc_type != "email" ? "padding-bottom:2rem;" : ""
    acc.innerHTML = `<h2 style="width: fit-content;margin-left: 19px;color: #fbfcfc;">Account</h2>
            <form class="information">
                <div>
                    <div class="section type">
                        <label class="follow_theme" style="color:${save_theme};" for="account_type">Account Type</label>
                        <span>:</span>
                        <span>${acc_type == "email" ? "Email" : "Guest"}</span>
                    </div>
                    ${acc_type != "email" || data.status == undefined ? "" :
            `<div class="section email">
                        <label class="follow_theme" style="color:${save_theme};" for="mail">Email</label>
                        <span>:</span>
                        <input type="email" name="mail" id="mail" readonly value="${email}">
                    </div>
                    <div class="section username">
                        <label class="follow_theme" style="color:${save_theme};" for="username">Username</label>
                        <span>:</span>
                        <input type="text" name="username" id="username" autocomplete="off" maxlength="20" value="${localStorage.getItem("username")}">
                    </div>
                    <div class="section password">
                        <h1>Change Password</h1>
                        <div class="current pass_section">
                            <label for="cpwd">Current Password</label>
                            <div style="display: flex;align-items:flex-end;padding-bottom:1rem;">
                                <input type="password" id="cpwd" name="cpwd">
                                <img class="eye"
                                    style="margin-right:1rem;height:fit-content;cursor:pointer;border-bottom: 1px solid #fff;padding-bottom:6px;"
                                    src="img/eye.svg">
                            </div>
                        </div>
                        <div class="new pass_section">
                            <label for="pwd">New Password</label>
                            <div style="display: flex;align-items:flex-end;padding-bottom:1rem;">
                                <input type="password" id="pwd" name="pwd">
                                <img class="eye"
                                    style="margin-right:1rem;height:fit-content;cursor:pointer;border-bottom: 1px solid #fff;padding-bottom:6px;"
                                    src="img/eye.svg">
                            </div>
                        </div>
                    </div>
                    <input ${save_theme != null ? "style='background-color:" + save_theme + ";'" : ""};" type="submit" value="Save">`}
                </div>
            </form>`
    app.appendChild(acc)

    if (localStorage.getItem("account") == "email") {
        let log = document.createElement("div")
        log.classList.add("logout")
        log.innerHTML = `<div class="log_out"><span>Logout</span></div>`
        log.querySelector(".log_out").addEventListener("click", () => {
            if (confirm("Are you sure to want logout?")) {
                localStorage.clear()
                window.location.href = "./login.html"
            }
        })
        app.appendChild(log)
    } else {
        let log = document.createElement("div")
        log.classList.add("logout")
        log.innerHTML = `<div class="log_out"><span>Login</span></div>`
        log.querySelector(".log_out").addEventListener("click", () => {
            localStorage.removeItem("account")
            window.location.href = "./login.html"
        })
        app.appendChild(log)
    }

    const passw = document.querySelectorAll(".pass_section")
    passw.forEach(passws => {
        passws.querySelector("img").addEventListener("click", (e) => {
            const input = passws.querySelector("input")
            if (e.target.src.endsWith("img/eye.svg")) {
                console.log(e.target.src)
                e.target.src = "img/eye-off.svg"
                input.type = "text"
            } else {
                e.target.src = "img/eye.svg"
                input.type = "password"
            }
        })
    })

    const form = document.forms[0]
    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        const username = localStorage.getItem("username")

        if (form.username.value != username) {
            if (confirm(`Are you sure to update username to ${form.username.value}?`)) {
                const update_user = await fetch(`${domain}/api/account/update/username`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        username: form.username.value
                    })
                })

                const res = await update_user.json()
                if (res == "OK") {
                    alert(res.msg)
                    localStorage.setItem("username", form.username.value)
                    console.log(form.username.value)
                    window.location.reload()
                } else {
                    alert(res.msg)
                    window.location.reload()
                }
            }
        } else if (form.cpwd.value.trim() != form.pwd.value.trim()) {
            if (form.pwd.value.trim() == "") return alert("New password cannot be empty")
            let login = await fetch(`${domain}/api/account/login`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: form.mail.value,
                        password: form.cpwd.value.trim()
                    })
                })
            const result = await login.json()
            if (result.status == "not valid") alert("The current password is not the same")
            else if (result.status == "OK") {
                let change_pass = await fetch(`${domain}/api/account/password/update`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Beaarer ${token}`
                    },
                    body: JSON.stringify({
                        new_password: form.pwd.value.trim()
                    })
                })

                const res = await change_pass.json()
                if (res.status == "OK") {
                    alert(res.msg)
                    localStorage.setItem("token", res.newtoken)
                    window.location.reload()
                } else {
                    alert("Server has problem to process")
                }
            }
        }
    })
}

