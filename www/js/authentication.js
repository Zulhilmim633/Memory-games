const app = document.querySelector(".app")

const account = localStorage.getItem("account")
if (account != null) {
    window.location.href = "./index.html"
}

var username = null
account_type()



function account_type() {
    document.querySelector("form").remove()
    const form = document.createElement("form")
    form.classList.add("account_type")
    form.innerHTML = `<div>
                <button onclick="guest()">Guest</button>
                <button onclick="login_page()">Sign In</button>
                <button onclick="register_page()">Sign Up</button>
            </div>
        </form>`
    app.appendChild(form)

}

function login_page() {
    document.querySelector("form").remove()
    const form = document.createElement("form")
    form.classList.add("login")
    form.innerHTML = `<label for="Email">Email : </label>
            <input type="email" name="email" id="email" required pattern="[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$">
            <label for="password">Password : </label>
            <input type="password" name="pwd" id="pwd" required>
            <div>
                <input type="submit" value="Login">
            </div>`
    app.appendChild(form)
    // app.querySelector("#email").pattern = '[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        const form = document.forms[0]
        const email = form.email.value
        const pwd = form.pwd.value
        let result = {}
        try {
            let login = await fetch(`${domain}/api/account/login`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: pwd
                })
            })
            result = await login.json()
        } catch (error) {
            alert("Please turn on your network to login")
            return
        }
        if (result.status == "not valid") {
            create_modal("Password not match", result.msg, false, "")
        }
        else if (result.status == "OK") {
            localStorage.setItem("account", "email")
            localStorage.setItem("token", result.token)
            localStorage.setItem("scores", JSON.stringify(result.scores))
            localStorage.setItem("configuration", JSON.stringify(result.config))
            window.location.href = "./index.html"
        } else if (result.status == "exist") {
            create_modal("Email not found", result.msg, true, "register_page()")
        } else {
            alert("Database error")
        }
    })

    document.addEventListener("backbutton", (e) => {
        e.preventDefault()
        account_type()
    })
}

function register_page() {
    document.querySelector("form").remove()
    const form = document.createElement("form")
    form.classList.add("register")
    form.innerHTML = `<label for="Email">Email : </label>
            <input type="email" name="email" id="email" required pattern="[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$">
            <label for="password">Password : </label>
            <input type="password" name="pwd" id="pwd" required>
            <label for="password">Confirm Password : </label>
            <input type="password" name="Cpwd" id="Cpwd" required>
            <div>
                <input type="submit" value="Register">
            </div>`
    app.appendChild(form)

    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        const form = document.forms[0]
        const email = form.email.value
        const pwd = form.pwd.value
        const Cpwd = form.Cpwd.value
        let data = {}
        try {
            
            let email_valid = await fetch(`${domain}/api/account/register?check=email`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email
                })
            })
            
            data = await email_valid.json()
        } catch (error) {
            alert("Please turn on your network for register")
            return
        }
        if (data.status == "Exist") return create_modal("This email already exist", data.msg, true, "login_page()")

        if (pwd.trim() == Cpwd.trim()) {
            if (username == null || username.length > 20 || username.length < 0)
                username = prompt('Please enter your desired Username no more than 20 character')
            let registeration = await fetch(`${domain}/api/account/register`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: pwd.trim(),
                        username: username
                    })
                })

            const result = await registeration.json()
            if (result.status == "OK") {
                localStorage.setItem("account", "email")
                localStorage.setItem("token", result.token)
                localStorage.setItem("scores", JSON.stringify({ type_easy: 0, type_med: 0, type_hard: 0, trace: 0 }))
                localStorage.setItem("configuration", JSON.stringify({}))
                localStorage.setItem("firs_time", "1")
                window.location.href = "./index.html"
            } else if (result.status == "query") {
                alert("Username not approve")
                console.log(username)
                username = null
            }
        }else{
            alert("Password required")
        }
    })

    document.addEventListener("backbutton", (e) => {
        e.preventDefault()
        account_type()
    })
}

function guest() {
    localStorage.setItem("account", "guests")
    localStorage.setItem("scores", JSON.stringify({ type_easy: 0, type_med: 0, type_hard: 0, trace: 0 }))
    localStorage.setItem("firs_time", "1")
    localStorage.setItem("configuration", JSON.stringify({}))
}

function chekck_connection() {

}

function create_modal(reason, msg, close_and_jump_to, next_page) {
    const modal = document.createElement("div")
    modal.classList.add("back")
    let second_btn = close_and_jump_to ? `<button onclick="close_modal();${next_page}">Yes</button>` : ""
    modal.innerHTML = `<div class="modal">
            <h1>${reason}</h1>
            <p>${msg}</p>
            <div>
                <button onclick="close_modal()">${close_and_jump_to ? "No" : "Close"}</button>
                ${second_btn}
            </div>
        </div>
        </div>`
    document.body.appendChild(modal)
    app.style.opacity = "0.4"
}

function close_modal() {
    document.querySelector(".modal").remove()
    app.style.opacity = "1"
}

let clickCount = 0
const closing = document.querySelector(".closing")
document.addEventListener("backbutton", (ex) => {
    ex.preventDefault()
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
}, false)