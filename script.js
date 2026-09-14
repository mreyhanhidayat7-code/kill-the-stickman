const $ = id =>
    document.getElementById(id);


const loginScreen =
    $("loginScreen");

const menuScreen =
    $("menuScreen");

const gameScreen =
    $("gameScreen");

const pauseScreen =
    $("pauseScreen");

const leaderboardScreen =
    $("leaderboardScreen");

const cheatModal =
    $("cheatModal");


const canvas =
    $("gameCanvas");

const ctx =
    canvas.getContext("2d");


let user = null;

let score = 0;

let spears = 20;

let gameRunning = false;

let paused = false;

let target = null;

let spear = null;

let animationId = null;

let lastTime = 0;

let canThrow = true;


/* =========================
   SCREEN
========================= */

function showOnly(screen) {

    loginScreen.classList
        .toggle("hidden",
            screen !== "login");

    menuScreen.classList
        .toggle("hidden",
            screen !== "menu");

    gameScreen.classList
        .toggle("hidden",
            screen !== "game");
}


/* =========================
   TOAST
========================= */

function showToast(text) {

    const toast =
        $("toast");

    toast.textContent =
        text;

    toast.classList.add("show");

    clearTimeout(
        showToast.timer
    );

    showToast.timer =
        setTimeout(() => {

            toast.classList
                .remove("show");

        }, 1800);
}


/* =========================
   LOGIN
========================= */

$("loginForm")
.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const username =
            $("username")
            .value
            .trim();

        const password =
            $("password")
            .value;

        if (
            username.length < 2 ||
            password.length < 3
        ) {

            $("loginMessage")
                .textContent =
                "Username minimal 2 karakter dan password minimal 3 karakter.";

            return;
        }

        user = {
            username: username
        };

        sessionStorage.setItem(
            "ktm_user",
            username
        );

        $("welcomeText")
            .textContent =
            "👤 " + username;

        $("hudUser")
            .textContent =
            username;

        showOnly("menu");
    }
);


/* =========================
   LOGOUT
========================= */

$("logoutBtn").onclick =
function() {

    user = null;

    sessionStorage.removeItem(
        "ktm_user"
    );

    stopGame();

    showOnly("login");
};


/* =========================
   START GAME
========================= */

$("startBtn").onclick =
startGame;


function startGame() {

    score = 0;

    spears = 20;

    target = null;

    spear = null;

    paused = false;

    gameRunning = true;

    $("score")
        .textContent = score;

    $("spears")
        .textContent = spears;

    showOnly("game");

    resizeCanvas();

    spawnTarget();

    $("tapHint")
        .style.opacity = "1";

    setTimeout(() => {

        $("tapHint")
            .style.opacity = "0";

    }, 2500);

    lastTime =
        performance.now();

    cancelAnimationFrame(
        animationId
    );

    animationId =
        requestAnimationFrame(loop);
}


/* =========================
   STOP GAME
========================= */

function stopGame() {

    gameRunning = false;

    paused = false;

    cancelAnimationFrame(
        animationId
    );
}


/* =========================
   PAUSE
========================= */

$("pauseBtn").onclick =
pauseGame;


function pauseGame() {

    if (!gameRunning)
        return;

    paused = true;

    cancelAnimationFrame(
        animationId
    );

    $("pauseScore")
        .textContent = score;

    $("pauseSpears")
        .textContent = spears;

    pauseScreen
        .classList
        .remove("hidden");
}


/* =========================
   RESUME
========================= */

$("resumeBtn").onclick =
function() {

    paused = false;

    pauseScreen
        .classList
        .add("hidden");

    lastTime =
        performance.now();

    animationId =
        requestAnimationFrame(loop);
};


/* =========================
   RESTART
========================= */

$("restartBtn").onclick =
function() {

    pauseScreen
        .classList
        .add("hidden");

    startGame();
};


/* =========================
   MENU
========================= */

$("pauseMenuBtn").onclick =
function() {

    pauseScreen
        .classList
        .add("hidden");

    stopGame();

    showOnly("menu");
};


/* =========================
   CANVAS
========================= */

function resizeCanvas() {

    const rect =
        canvas.getBoundingClientRect();

    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    canvas.width =
        rect.width * dpr;

    canvas.height =
        rect.height * dpr;

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );
}


window.addEventListener(
    "resize",
    resizeCanvas
);


/* =========================
   TARGET
========================= */

function spawnTarget() {

    const width =
        canvas.clientWidth;

    const height =
        canvas.clientHeight;

    const radius = 30;

    target = {

        x:
    radius +
    Math.random() *
    (width - radius * 2),

y:
    radius +
    Math.random() *
    (height - radius * 2),

        r: radius,

        vx:
            (Math.random() > .5
                ? 1
                : -1) *
            (100 +
            Math.random() * 150)
    };
}


/* =========================
   THROW
========================= */

function throwSpear() {

    if (
        !gameRunning ||
        paused ||
        !canThrow
    )
        return;

    if (spears <= 0) {

        endGame();

        return;
    }


    spears--;

    $("spears")
        .textContent = spears;


    const width =
        canvas.clientWidth;

    const height =
        canvas.clientHeight;


    const startX =
        width * .12;

    const startY =
        height * .80;


    vx:
    dx / distance * 900,

vy:
    dy / distance * 900,


    const distance =
        Math.hypot(dx, dy);


    spear = {

        x: startX,

        y: startY,

        vx:
            dx / distance *
            900,

        vy:
            dy / distance *
            900,

        angle:
            Math.atan2(
                dy,
                dx
            ),

        age: 0
    };


    canThrow = false;
}


/* =========================
   INPUT
========================= */

canvas.addEventListener(
    "pointerdown",
    function(event) {

        event.preventDefault();

        throwSpear();

    }
);


$("throwBtn").onclick =
throwSpear;


/* =========================
   UPDATE
========================= */

function update(dt) {

    if (!target)
        spawnTarget();


    target.x +=
        target.vx * dt;


    const width =
        canvas.clientWidth;


    if (
        target.x < target.r ||
        target.x >
        width - target.r
    ) {

        target.vx *= -1;

    }


    if (spear) {

        spear.age += dt;

        spear.x +=
            spear.vx * dt;

        spear.y +=
            spear.vy * dt;


        const distance =
            Math.hypot(
                spear.x -
                target.x,

                spear.y -
                target.y
            );


        if (
            distance <
            target.r + 15
        ) {

            score += 20;

            $("score")
                .textContent =
                score;

            showToast(
                "+20 SCORE!"
            );

            spear = null;

            canThrow = true;

            spawnTarget();

            return;
        }


        if (
            spear.x < -100 ||
            spear.x >
            width + 100 ||
            spear.y < -100 ||
            spear.y >
            canvas.clientHeight + 100 ||
            spear.age > 2
        ) {

            spear = null;

            canThrow = true;


            if (spears <= 0) {

                endGame();

            }
        }
    }
}


/* =========================
   DRAW
========================= */

function draw() {

    const width =
        canvas.clientWidth;

    const height =
        canvas.clientHeight;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /* LANGIT */

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            height
        );

    gradient.addColorStop(
        0,
        "#bde4ff"
    );

    gradient.addColorStop(
        1,
        "#eaf8ff"
    );

    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /* TANAH */

    ctx.fillStyle =
        "#88c574";

    ctx.fillRect(
        0,
        height * .82,
        width,
        height * .18
    );


    /* STICKMAN */

    if (target) {

        drawStickman(
            target.x,
            target.y,
            target.r
        );

    }

    

    /* PLAYER */

    drawPlayer(
        width * .12,
        height * .82
    );


    /* TOMBAK */

    if (spear) {

        drawSpear(spear);

    }
}


/* =========================
   DRAW STICKMAN
========================= */

function drawStickman(
    x,
    y,
    r
) {

    ctx.save();

    ctx.translate(
        x,
        y
    );


    ctx.strokeStyle =
        "#1b1f29";

    ctx.fillStyle =
        "#f2c6a0";

    ctx.lineWidth =
        5;

    ctx.lineCap =
        "round";


    /* KEPALA */

    ctx.beginPath();

    ctx.arc(
        0,
        -r,
        r * .35,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.stroke();


    /* BADAN */

    ctx.beginPath();

    ctx.moveTo(
        0,
        -r * .65
    );

    ctx.lineTo(
        0,
        r * .45
    );


    /* TANGAN */

    ctx.moveTo(
        0,
        -r * .25
    );

    ctx.lineTo(
        -r * .6,
        r * .1
    );


    ctx.moveTo(
        0,
        -r * .25
    );

    ctx.lineTo(
        r * .6,
        r * .1
    );


    /* KAKI */

    ctx.moveTo(
        0,
        r * .45
    );

    ctx.lineTo(
        -r * .45,
        r
    );


    ctx.moveTo(
        0,
        r * .45
    );

    ctx.lineTo(
        r * .45,
        r
    );

    ctx.stroke();


    ctx.restore();
}


/* =========================
   PLAYER
========================= */

function drawPlayer(
    x,
    y
) {

    ctx.save();

    ctx.translate(
        x,
        y
    );

    ctx.strokeStyle =
        "#354052";

    ctx.lineWidth =
        7;

    ctx.lineCap =
        "round";


    ctx.beginPath();

    ctx.moveTo(
        0,
        -40
    );

    ctx.lineTo(
        0,
        20
    );


    ctx.moveTo(
        0,
        -10
    );

    ctx.lineTo(
        -25,
        5
    );


    ctx.moveTo(
        0,
        -10
    );

    ctx.lineTo(
        25,
        5
    );


    ctx.moveTo(
        0,
        20
    );

    ctx.lineTo(
        -20,
        55
    );


    ctx.moveTo(
        0,
        20
    );

    ctx.lineTo(
        20,
        55
    );

    ctx.stroke();


    ctx.fillStyle =
        "#6f8cff";

    ctx.beginPath();

    ctx.arc(
        0,
        -55,
        15,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.restore();
}


/* =========================
   TOMBAK
========================= */

function drawSpear(s) {

    ctx.save();

    ctx.translate(
        s.x,
        s.y
    );

    ctx.rotate(
        s.angle
    );


    ctx.strokeStyle =
        "#303844";

    ctx.lineWidth =
        5;


    ctx.beginPath();

    ctx.moveTo(
        -50,
        0
    );

    ctx.lineTo(
        20,
        0
    );

    ctx.stroke();


    /* UJUNG TOMBAK */

    ctx.fillStyle =
        "#626d7c";

    ctx.beginPath();

    ctx.moveTo(
        40,
        0
    );

    ctx.lineTo(
        12,
        -10
    );

    ctx.lineTo(
        12,
        10
    );

    ctx.closePath();

    ctx.fill();


    ctx.restore();
}


/* =========================
   GAME LOOP
========================= */

function loop(time) {

    if (
        !gameRunning ||
        paused
    )
        return;


    const dt =
        Math.min(
            (time - lastTime) /
            1000,
            .035
        );


    lastTime =
        time;


    update(dt);

    draw();


    animationId =
        requestAnimationFrame(
            loop
        );
}


/* =========================
   GAME OVER
========================= */

function endGame() {

    stopGame();


    $("pauseScore")
        .textContent =
        score;

    $("pauseSpears")
        .textContent =
        0;


    saveScore();


    pauseScreen
        .classList
        .remove("hidden");


    showToast(
        "Game selesai! Score: " +
        score
    );
}


/* =========================
   SAVE SCORE
========================= */

async function saveScore() {

    try {

        const response =
            await fetch(
                "/api/score",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            username:
                                user.username,

                            score:
                                score
                        })
                }
            );


        if (!response.ok)
            throw new Error();


    } catch (error) {

        /*
         * Fallback jika
         * Google Sheets belum
         * dikonfigurasi.
         */

        const scores =
            JSON.parse(
                localStorage.getItem(
                    "ktm_scores"
                ) || "[]"
            );


        scores.push({

            username:
                user.username,

            score:
                score,

            date:
                new Date()
                .toISOString()

        });


        scores.sort(
            (a,b) =>
                b.score -
                a.score
        );


        localStorage.setItem(
            "ktm_scores",
            JSON.stringify(
                scores.slice(
                    0,
                    50
                )
            )
        );
    }
}


/* =========================
   GET LEADERBOARD
========================= */

async function getLeaderboard() {

    try {

        const response =
            await fetch(
                "/api/leaderboard"
            );


        if (!response.ok)
            throw new Error();


        return await response.json();


    } catch (error) {

        return JSON.parse(
            localStorage.getItem(
                "ktm_scores"
            ) || "[]"
        )
        .sort(
            (a,b) =>
                b.score -
                a.score
        )
        .slice(
            0,
            10
        );
    }
}


/* =========================
   LEADERBOARD
========================= */

async function openLeaderboard() {

    leaderboardScreen
        .classList
        .remove("hidden");


    const list =
        $("leaderboardList");


    list.innerHTML =
        `<div class="loading">
            Memuat...
        </div>`;


    const rows =
        await getLeaderboard();


    if (!rows.length) {

        list.innerHTML =
            `<div class="loading">
                Belum ada skor.
            </div>`;

        return;
    }


    list.innerHTML =
        rows
        .slice(0,10)
        .map(
            (row,index) => {

                return `
                <div class="rank">

                    <strong>
                        #${index + 1}
                    </strong>

                    <div>

                        <b>
                            ${escapeHtml(
                                row.username
                            )}
                        </b>

                        <small>
                            ${
                                row.date
                                ?
                                new Date(
                                    row.date
                                ).toLocaleString(
                                    "id-ID"
                                )
                                :
                                ""
                            }
                        </small>

                    </div>

                    <span class="points">
                        ${Number(
                            row.score
                        ) || 0}
                    </span>

                </div>
                `;
            }
        )
        .join("");
}


function escapeHtml(text) {

    return String(text)
        .replace(
            /[&<>"']/g,
            function(char) {

                return {

                    "&":
                        "&amp;",

                    "<":
                        "&lt;",

                    ">":
                        "&gt;",

                    '"':
                        "&quot;",

                    "'":
                        "&#039;"

                }[char];

            }
        );
}


/* LEADERBOARD BUTTON */

$("loginLeaderboardBtn")
    .onclick =
    openLeaderboard;

$("menuLeaderboardBtn")
    .onclick =
    openLeaderboard;

$("pauseLeaderboardBtn")
    .onclick =
    openLeaderboard;

$("refreshLeaderboardBtn")
    .onclick =
    openLeaderboard;


$("closeLeaderboardBtn")
.onclick =
function() {

    leaderboardScreen
        .classList
        .add("hidden");
};


/* =========================
   CHEAT
========================= */

/*
   Saat pause,
   tekan tombol C.
*/

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key
            .toLowerCase()
            === "c" &&
            paused
        ) {

            cheatModal
                .classList
                .remove("hidden");

        }


        if (
            event.key === " " &&
            gameRunning &&
            !paused
        ) {

            event.preventDefault();

            throwSpear();

        }


        if (
            event.key === "Escape"
        ) {

            leaderboardScreen
                .classList
                .add("hidden");

        }

    }
);


$("cheatSubmit")
.onclick =
function() {

    const code =
        $("cheatInput")
        .value
        .trim();


    if (
        code === "Sukiliar"
    ) {

        spears = 50;

        $("spears")
            .textContent =
            spears;

        $("cheatMessage")
            .textContent =
            "Cheat aktif! Kamu mendapatkan 50 tombak.";

        showToast(
            "🗡️ 50 tombak!"
        );

    } else {

        $("cheatMessage")
            .textContent =
            "Kode cheat salah.";

    }
};


$("cheatClose")
.onclick =
function() {

    cheatModal
        .classList
        .add("hidden");

};


/* =========================
   SESSION
========================= */

const savedUser =
    sessionStorage.getItem(
        "ktm_user"
    );


if (savedUser) {

    user = {
        username:
            savedUser
    };

    $("welcomeText")
        .textContent =
        "👤 " +
        savedUser;

    $("hudUser")
        .textContent =
        savedUser;

 showOnly("menu");
}


