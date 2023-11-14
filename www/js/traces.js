const modal = document.querySelector(".modal")
const countdwn = document.querySelector(".countdown")
const view = document.querySelector(".viewport")
const gameplay = document.querySelector(".gameplay")

var next = []
var init_click = 0
var interval
var limit
var remove_coor = []
var every_nodes = []
var next_coord = []

if (localStorage.getItem("trac_tu") != "never") show_tutorial()
document.querySelector(".info").addEventListener("click", show_tutorial)

function dificulty(e) {
    e.parentNode.classList.remove("visible")
    mode = e.innerText
    modal.classList.remove("visible")
    startGame(mode)
}

function startGame(modes) {
    const table = document.createElement("table")
    const countdown = {
        Easy: {
            count: 15,
            limit: 20
        },
        Medium: {
            count: 6,
            limit: 10
        },
        Hard: {
            count: 3,
            limit: 5
        }
    }
    const possible = [1, 2, 3, 4, 5]
    countdwn.innerText = countdown[modes].count
    limit = countdown[modes].limit


    function generate(possible) {
        return possible[Math.floor(Math.random() * possible.length)]
    }

    const start = generate([2, 3, 4, 5])

    const threshold = 7

    table.style.color = "#fff"
    for (let i = 1; i <= threshold; i++) {
        const row = document.createElement("tr")
        for (let j = 1; j <= threshold; j++) {
            const data = document.createElement("td")
            data.setAttribute("x", i)
            data.setAttribute("y", j)
            if ((i == start && j == 1) || (j == start && i == 1)) {
                data.classList.add("initiate")
            }

            for (let position of next) {
                if (position[0] == i && position[1] == j) {
                    data.classList.add("next")
                }
            }

            if (i == 1 && j == 1) {
                data.style.backgroundImage = 'URL("./img/target.svg")'
                data.style.backgroundSize = "contain"
                data.style.backgroundPosition = "center"
                data.style.backgroundRepeat = "no-repeat"
                data.style.backgroundColor = "#6acf66"
            }
            else if (i == threshold && j == threshold) {
                data.style.backgroundImage = 'URL("./img/flag.svg")'
                data.style.backgroundSize = "contain"
                data.style.backgroundPosition = "center"
                data.style.backgroundRepeat = "no-repeat"
                data.style.backgroundColor = "#6acf66"
            }
            else {
                const number = generate(possible)
                if (data.classList.contains("initiate") || data.classList.contains("next")) {
                    possible.forEach(closer => {
                        if ((i + closer == threshold && j == threshold && i > 3) || (j + closer == threshold && i == threshold && j > 3)) {
                            data.innerText = closer
                            data.classList.add("lastnode")
                        }
                    });
                    if (i + number < threshold || j + number < threshold) {
                        next.push([i + number, j])
                        next.push([i, j + number])
                    }

                }
                if (data.innerText == "") data.innerText = number
            }
            row.appendChild(data)
        }
        table.appendChild(row)
    }
    gameplay.querySelector(".cont").appendChild(table)

    trace_path()

    interval = setInterval(() => {
        console.log(countdown[modes].count)
        countdown[modes].count -= 1
        countdwn.innerText = countdown[modes].count
        if (countdown[modes].count <= 0 || countdwn.innerText == 0) {
            init_click++
            clearInterval(interval)
            return start_count(init_click)
        }
    }, 1000)

    if (document.querySelector("tr:nth-child(7) > td:nth-child(7)").classList.contains("nextstep") == false) {
        clearInterval(interval)
        console.log("game reset")
        reset(modes)
    }

    if (document.querySelectorAll(".lastnode").length < 1) {
        clearInterval(interval)
        console.log("game reset")
        reset(modes)
    }
    table.addEventListener("click", play)
}

function start_count(click) {
    if (click == 1) {
        clearInterval(interval)
        document.querySelector("table").style.color = "#fff0"
        countdwn.innerHTML = `TIME: <span class="sec">00</span>.<span class="mil">000</span>`
        timer = true
        stopper()
    }
}

let clickable = []
function play(e) {
    const table = document.querySelector("table")
    let current = {
        x: 0,
        y: 0
    }
    init_click++
    gameplay.querySelectorAll("tr").forEach(row_node => {
        current.y = 0
        current.x += 1
        row_node.querySelectorAll("td").forEach(cell_node => {
            current.y += 1
            if (e.target == cell_node) {
                if ((current.x == 1 && current.y == 1)) return
                else if (e.target.classList.contains("initiate")) {
                    gameplay.querySelectorAll(".initiate").forEach(nodes => nodes.classList.remove("initiate"))
                    e.target.classList.add("active_click")
                    let number = parseInt(e.target.innerText)
                    clickable.push([current.x + number, current.y])
                    clickable.push([current.x, current.y + number])
                    table.style.color = "#fff0"
                    start_count(init_click)
                    return
                }
                const arrayToCheck = [current.x, current.y]

                var isPresent = clickable.some(innerArray => {
                    return innerArray.every((value, index) => value === arrayToCheck[index]);
                });

                if (isPresent) {
                    e.target.classList.add("active_click")
                    clickable = []
                    if (current.x == 7 && current.y == 7) {
                        table.style.color = "#fff"
                        timer = false
                        return finish("Victory")
                    }
                    let number = parseInt(e.target.innerText)
                    clickable.push([current.x + number, current.y])
                    clickable.push([current.x, current.y + number])
                }
                else {
                    e.target.classList.add("wrong_click")
                    start_count(init_click)
                }
            }
        })
    })
    if (gameplay.querySelectorAll(".wrong_click").length == 3) {
        table.style.color = "#fff"
        timer = false
        return finish("Game over")
    }
}

function finish(msg) {
    if (msg == "Victory") {
        const time = document.querySelector("div.gameplay > div > div")
        const finish_time = parseFloat(time.innerText.replace("TIME: ", ""))
        const high = JSON.parse(localStorage.getItem("scores")) || {
            type_easy: 0,
            type_med: 0,
            type_hard: 0,
            trace: 0
        }
        if (high.trace == 0 || high.trace > finish_time) {
            high.trace = finish_time
            localStorage.setItem("scores", JSON.stringify(high))
            save_score()
        }
    }
    document.querySelector("table").removeEventListener("click", play)
    document.querySelector("table").style.color = "#fff"
    document.querySelectorAll(".nextstep").forEach((pos) => {
        pos.classList.add("possible")
    })
    const text = document.querySelector(".cont")
    let sp = document.createElement("span")
    sp.innerText = "Restart"
    sp.onclick = ()=>{window.location.reload()}
    sp.classList.add("rest")
    sp.style = `padding: 3px;cursor: pointer;margin-top:6px;color: #fbfcfc;font-weight: bold;background-color: #ffa500;`
    text.appendChild(sp)
    const modal = document.querySelector(".modal > .wrap")
    const temp_modal = modal.innerHTML
    modal.innerHTML = `<h3 style="margin-top:0;">${msg}</h3><span style="background-color: #ffa500;" onclick="modal.remove()">Close</span>`
    modal.style.padding = "3rem"
    modal.parentNode.removeEventListener("click",return_home)
    modal.parentNode.classList.add("visible")
    return
}

function reset(modes) {
    clearInterval()
    document.querySelector("table").remove()
    startGame(modes)
}

var count = 0
function stopper() {
    if (timer) {
        count++
        const sec = countdwn.querySelector(".sec")
        const mil = countdwn.querySelector(".mil")
        let second = parseInt(sec.innerText)

        if (count == 100) {
            second++;
            count = 0;
        }

        if (second == 60) {
            second = 0;
        }

        sec.innerText = second
        mil.innerText = count < 10 ? "0" + count : count
        if (second >= limit) return finish("Run out of time")

        setTimeout(stopper, 10);
    }
}

function trace_path() {
    const table = document.querySelector("table")
    let coordinate = {
        x: 0,
        y: 0
    }
    table.querySelectorAll("tr").forEach(row => {
        coordinate.x++
        coordinate.y = 0
        row.querySelectorAll("td").forEach(collum => {
            coordinate.y++
            every_nodes.push(collum)
            const number = parseInt(collum.innerText)

            const temp = { next: [] }
            temp.node = collum
            temp.path = 0
            if (collum.classList.contains("initiate")) {
                if (coordinate.x + number <= 7) {
                    temp.next.push([coordinate.x + number, coordinate.y])
                    temp.path += 1
                    next_coord.push(temp)
                    collum.classList.add("nextstep")
                }
                if (coordinate.y + number <= 7) {
                    temp.next.push([coordinate.x, coordinate.y + number])
                    temp.path += 1
                    next_coord.push(temp)
                    collum.classList.add("nextstep")
                }
            }

            const now = [coordinate.x, coordinate.y]
            var in_position = false
            for (const test of next_coord) {
                in_position = test.next.some(innerArray => {
                    return innerArray.every((value, index) => value === now[index]);
                });
                if (in_position) break
            }
            if (in_position) {
                if (coordinate.x == 7 && coordinate.y == 7) return collum.classList.add("nextstep")
                let add = true
                collum.classList.add("nextstep")
                if (coordinate.x + number <= 7) {
                    temp.next.push([coordinate.x + number, coordinate.y])
                    next_coord.push(temp)
                    temp.path += 1
                    add = false
                }
                if (coordinate.y + number <= 7) {
                    temp.next.push([coordinate.x, coordinate.y + number])
                    next_coord.push(temp)
                    temp.path += 1
                    add = false
                }
                if (add) {
                    collum.classList.remove("nextstep")
                    trace_back(now)
                }
            }
        })
    })
}

function trace_back(currently_cordinate) {
    for (const nodes of next_coord) {
        for (const cor of nodes.next) {
            if (cor[0] == currently_cordinate[0] && cor[1] == currently_cordinate[1]) {
                if (nodes.next.length == 1) {
                    nodes.node.classList.remove("nextstep")
                    const node_coor = [parseInt(nodes.node.getAttribute("x")), parseInt(nodes.node.getAttribute("y"))]
                    remove_coor.push(nodes)
                    trace_back(node_coor)
                } else if (nodes.next.length == 2) {
                    let s = every_nodes[7 * (nodes.next[0][0] - 1) + (nodes.next[0][1] - 1)]
                    let t = every_nodes[7 * (nodes.next[1][0] - 1) + (nodes.next[1][1] - 1)]
                    if ((s && s.classList.contains("nextstep")) && (t && t.classList.contains("nextstep") == false)) {
                        s.classList.remove("nexstep")
                    }
                    if ((t && t.classList.contains("nextstep")) && (s && s.classList.contains("nextstep") == false)) {
                        t.classList.remove("nexstep")
                    }
                    if ((t && t.classList.contains("nextstep")) == false && (s && s.classList.contains("nextstep") == false)) {
                        t.classList.remove("nextstep")
                        s.classList.remove("nextstep")
                    }
                }
            }
        }
    }
}

function show_tutorial() {
    const tu_mod = document.querySelector(".tutorial")
    tu_mod.classList.add("visible")
    var i = 0
    const steps = {
        first: `<img src="./img/tutorial/option.png">
                    <h2>You can select dificulty on start of game</h2>`,
        second: `<img src="./img/tutorial/initiate.png">
                        <h2>Your starting point is circle on top left where you can start from 1 to 5 box from it</h2>`,
        third: `<img src="./img/tutorial/how-to.png">
                        <h2>You can move either rigth or down only</h2>`,
        fourth: `<img src="./img/tutorial/destination.png">
                        <h2>Your target is red flag on bottom right</h2>`,
        five: `<img src="./img/tutorial/lost.png">
                        <h2>You have 3 try</h2>
                        <img src="./img/tutorial/time.png">
                        <h2>Or reach time limit. Time limit is difference between dificulty</h2>`,
        six: `<img src="./img/tutorial/possible.png"">
                        <h2>All possible click locations will be shown at the end</h2>`,
        seven: `<h2>Let's start</h2>`
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
    cl.addEventListener("click", close)
    nv.addEventListener("click", () => {
        close()
        localStorage.setItem("trac_tu", "never")
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