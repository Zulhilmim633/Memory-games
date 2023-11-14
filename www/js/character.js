const modal = document.querySelector(".modal")
const countdwn = document.querySelector(".countdown")
const view = document.querySelector(".viewport")
const gameplay = document.querySelector(".gameplay")
const input = document.querySelector(".gameplay>div>input")

var mode
var intensity = 0
var score = 0

if (localStorage.getItem("typ_tu") != "never") show_tutorial()
document.querySelector(".info").addEventListener("click",show_tutorial)

function dificulty(e) {
    e.parentNode.parentNode.classList.remove("visible")
    mode = e.innerText
    const text = document.createElement("h1")
    text.innerText = e.innerText
    text.style.color = localStorage.getItem("theme") || getPreferences("theme")
    const container = gameplay.querySelector(".cont")
    container.insertBefore(text, container.firstChild)
    startGame(5, mode)
}

function getRandomLetter() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet[randomIndex];
}

function getRandomNumber() {
    const number = '0123456789';
    const randomIndex = Math.floor(Math.random() * number.length);
    return number[randomIndex];
}

function getRandomPunctuation() {
    const punctuations = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
    const randomIndex = Math.floor(Math.random() * punctuations.length);
    return punctuations[randomIndex];
}

function random(sample) {
    return sample[Math.floor(Math.random() * sample.length)]
}

function update(e) {
    e.value = e.value.toUpperCase()
    for (let i = 0; i < e.value.length; i++) {
        if (e.value[i] != view.innerText[i]) return lose(score)
    }
    if (e.value == view.innerText) {
        if (mode == "Easy") score += 50
        else if (mode == "Medium") score += 200
        else if (mode == "Hard") score += 350
        intensity++
        return startGame(5, mode)
    }
}

function lose(scores) {
    const translate = {
        "Easy": "type_easy",
        "Medium": "type_med",
        "Hard": "type_hard"
    }
    const high = JSON.parse(localStorage.getItem("scores")) || {
        type_easy: 0,
        type_med: 0,
        type_hard: 0,
        trace: 0
    }
    if (high[translate[mode]] < scores) {
        high[translate[mode]] = scores
        localStorage.setItem("scores", JSON.stringify(high))
        save_score()
    }
    console.log(high)
    modal.innerHTML = `<div class="wrap"><h2>Game over</h2><p>You scored ${scores} points!</p><button onClick="location.reload()">Play again</button></div>`
    modal.classList.add("visible")
}

function startGame(countdown = 5, moded) {
    const default_long = 5
    countdwn.innerText = countdown
    countdwn.style.display = "block"
    view.style.display = "block"
    input.style.display = "none"
    view.innerText = ""
    input.value = ""

    const modify = {
        Easy: {
            text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            prefix: /\A|\B|\C|\D|\E|\F|\G|\H|\I|\J|\K|\L|\M|\N|\O|\P|\Q|\R|\S|\T|\U|\V|\W|\X|\Y|\Z/
        },
        Medium: {
            text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            prefix: /\1|\2|\3|\4|\5|\6|\7|\8|\9|\0/
        },
        Hard: {
            text: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&*+-<=>?@_~',
            prefix: /\!|\#|\$|\%|\&|\*|\+|\-|\<|\=|\>|\?|\@|\_|\~/
        }
    }

    for (let i = 0; i < default_long + intensity; i++) {
        const randomIndex = Math.floor(Math.random() * modify[moded]["text"].length)
        view.innerText += modify[moded]["text"][randomIndex]
    }

    let org = view.innerText

    if (moded == "Hard") {
        let have_puctuation = modify.Hard["prefix"].test(org)
        if (!have_puctuation) {
            const random_placer = Math.floor(Math.random() * org.length)
            const t = org.substring(0, random_placer) + getRandomPunctuation() + org.substring(random_placer + 1)
            view.innerText = t
            org = view.innerText
        }
    }
    if (moded != "Easy") {
        let have_num = modify.Medium["prefix"].test(org)
        if (!have_num) {
            const random_placer = Math.floor(Math.random() * org.length)
            const t = org.substring(0, random_placer) + getRandomNumber() + org.substring(random_placer + 1)
            view.innerText = t
            org = view.innerText
        }
    }
    let have_str = modify.Easy.prefix.test(org)
    if (!have_str) {
        const random_placer = Math.floor(Math.random() * org.length)
        const t = org.substring(0, random_placer) + getRandomLetter() + org.substring(random_placer + 1)
        view.innerText = t
        org = view.innerText
    }

    const t = setInterval(() => {
        if (countdwn.innerText == 0) {
            countdwn.style.display = "none"
            view.style.display = "none"
            input.style.display = "block"
            input.focus()
            return clearInterval(t)
        }
        countdwn.innerText -= 1
    }, 1000)
}

function show_tutorial() {
    const tu_mod = document.querySelector(".tutorial")
    tu_mod.classList.add("visible")
    var i = 0
    const steps = {
        first: `<img src="./img/tutorial/option.png">
                    <h2>You can select dificulty on start of game</h2>`,
        second: `<img src="./img/tutorial/start.png">
                    <h2>Remeber the text that show inside box</h2>`,
        third: `<img src="./img/tutorial/type.png">
                    <h2>Type text that shown earlier to continue</h2>`,
        fourth: `<img src="./img/tutorial/game-over.png">
                    <h2>But be careful not to mistype or game over</h2>`,
        five: `<h2>The intensity will increase every time the game is won</h2>`
    }

    const le = Object.keys(steps)
    const mod = document.querySelector(".text")
    const prev = document.querySelector(".prev")
    const nex = document.querySelector(".nex")
    const cl = document.querySelector(".navigate > #close")
    const nv = document.querySelector(".navigate > #never")

    show_tuto(i)
    prev.addEventListener("click", (e) => {
        i--
        show_tuto(i)
    })
    nex.addEventListener("click", (e) => {
        i++
        show_tuto(i)
    })
    cl.addEventListener("click",close)
    nv.addEventListener("click",()=>{
        close()
        localStorage.setItem("typ_tu","never")
    })

    function show_tuto(pos) {
        if (pos < 0) return i = 0
        else if (pos > (le.length - 1)) return i = le.length - 1
        if (pos <= 0) prev.style.opacity = 0
        else if (pos > 0) prev.style.opacity = 1

        if (pos == (le.length - 1)) nex.style.opacity = 0
        else if (pos < (le.length - 1)) nex.style.opacity = 1
        mod.innerHTML = steps[le[i]]
    }

    function close() {
        tu_mod.classList.remove("visible")
    }
}