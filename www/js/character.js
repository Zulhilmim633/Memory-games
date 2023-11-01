const modal = document.querySelector(".modal")
const countdwn = document.querySelector(".countdown")
const view = document.querySelector(".viewport")
const gameplay = document.querySelector(".gameplay")
const input = document.querySelector(".gameplay>input")

var mode
var intensity = 0
var score = 0

function dificulty(e) {
    e.parentNode.classList.remove("visible")
    mode = e.innerText
    const text = document.createElement("h1")
    text.innerText = e.innerText
    text.style.color = localStorage.getItem("theme") || "#FFF"
    gameplay.insertBefore(text, gameplay.firstChild)
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
    const high = JSON.parse(localStorage.getItem("character")) || {
        Easy:0,
        Medium:0,
        Hard:0
    }
    if(high[mode]<scores){
        high[mode]=scores
        localStorage.setItem("character",JSON.stringify(high))
    }
    modal.innerHTML = `<h2>Game over</h2><p>You scored ${scores} points!</p><button onClick="location.reload()">Play again</button>`
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

    const org = view.innerText

    if (moded == "Hard") {
        let have_puctuation = modify.Hard["prefix"].test(org)
        if (!have_puctuation) {
            const random_placer = Math.floor(Math.random() * org.length)
            const t = org.substring(0, random_placer) + getRandomPunctuation() + org.substring(random_placer + 1)
            view.innerText = t
        }
    }
    if (moded != "Easy") {
        let have_num = modify.Medium["prefix"].test(org)
        if (!have_num) {
            const random_placer = Math.floor(Math.random() * org.length)
            const t = org.substring(0, random_placer) + getRandomNumber() + org.substring(random_placer + 1)
            view.innerText = t
        }
    }
    let have_str = modify.Easy.prefix.test(org)
    if (!have_str) {
        const random_placer = Math.floor(Math.random() * org.length)
        const t = org.substring(0, random_placer) + getRandomLetter() + org.substring(random_placer + 1)
        view.innerText = t
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