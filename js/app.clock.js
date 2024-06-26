var stopped;
var form = document.forms[0];
var clocks = document.querySelectorAll('.clock');
var clock_one = document.querySelector(".clock_one");
var clock_two = document.querySelector(".clock_two");
var modal = document.querySelector("dialog");
var toggle_play = document.getElementById("toggle");
var time_control_btn = document.getElementById("time");
var reset_btn = document.getElementById("reset");
var timeout_audio_played = !1;
var timeout_audio = new Audio("./audio/no_time.mp3");
var rotate_animation = [{ transform: "rotate(0)" }, { transform: "rotate(-360deg)" }];

var minutes = 10;
var seconds = 0;
var increment = 0;

var timeControl = (minutes * 60) + seconds;
const timer_1 = new Timer();
const timer_2 = new Timer();

window.oncontextmenu = () => {
   return false;
};

function zeroPad(num, places) {
   return String(num).padStart(places, '0');
}

function timeString(s) {
 if (s < 60) {
    return s.toString().padStart(2, '0');
 } else {
    var date = new Date(0);
    date.setSeconds(s);
    return date.toISOString().substring(11).replace(/^0+/, '').replace(/^:/, '').slice(0, -5).replace(/^0+/, '').replace(/^:/, '');
 }
}

function reset(clock, timer) {
   has_reached_zero = false
   clock.classList.add("start")
   clock.classList.remove("zero")
   clock.disabled = false
   clock.innerText = timeString(timeControl)
   timeout_audio_played = !1
   toggle_play.innerText = "K"
   timer.isRunning && timer.stop()
   timer.reset()
   try {
      disabled_clock.disabled = !1
   } catch {
      //the clock was not paused
   }
}

form.addEventListener("submit", function () {
   /** @type {FormData} */
   var form_data = new FormData(form)
   if ((Number(form_data.get("_minutes"))) + Number(form_data.get("_seconds")) > 0) {
      timeControl = (60 * Number(form_data.get("_minutes"))) + Number(form_data.get("_seconds"))
      increment = Number(form_data.get("_increment"))
      reset(clock_one, timer_1)
      reset(clock_two, timer_2)
   }
})

clocks.forEach((clock, index) => {
  var next = clocks[index + 1] || clocks[index - 1]
  clock.addEventListener("click", () => {
    clock.classList.contains("start") && next.classList.remove("start")
    clock.disabled ? (clock.disabled = !1, next.disabled = !0) : (clock.disabled = !0, next.disabled = !1)
    clock.classList.remove("start")

    if (clock == clock_one) {
      !timer_2.isRunning && timer_2.start()
      timer_1.isRunning && timer_1.stop()
      timer_1.subtractTime(increment*1000)
    } else {
      !timer_1.isRunning && timer_1.start()
      timer_2.isRunning && timer_2.stop()
      timer_2.subtractTime(increment*1000)
   }
  })
})

time_control_btn.addEventListener("click", () => {
   modal.showModal()
})

var has_reached_zero = false
var interval = setInterval(() => {
   update(timer_1, clock_one)
   update(timer_2, clock_two)
}, 100)

function update(timer, clock) {
   var time = timeControl - Math.round(timer.getTime() / 1000)
   if (!timeout_audio_played && time <= .4) {
      timeout_audio.play()
      timeout_audio_played = true
   }

   if (time == 0) {
      if (!has_reached_zero){
         has_reached_zero = true
         clock.classList.add("zero")
         clock.innerText = "0:00"
         timer.isRunning && timer.stop()
      } else {
         timer.isRunning && timer.stop()
      }
   } else {
      clock.innerText = timeString(time)
   }
}

function is_pauseable() {
   return !clock_one.classList.contains("zero")
   && !clock_two.classList.contains("zero")
   && (!clock_two.classList.contains('start')
   || !clock_one.classList.contains('start'))
}

var disabled_clock;
function pause(){
   if (is_pauseable()) {
      if (toggle_play.innerText === "K") {
         toggle_play.innerText = "J"
         if (timer_1.isRunning) {
            stopped = timer_1
            timer_1.stop()
            disabled_clock = clock_one
            clock_one.disabled = !0
         } if (timer_2.isRunning) {
            stopped = timer_2
            timer_2.stop()
            disabled_clock = clock_two
            clock_two.disabled = !0
         }
      } else {
         toggle_play.innerText = "K"
         try {
            disabled_clock.disabled = !1, stopped.start()
         } catch (error){
            //Error unpausing clock
            console.error(error)
            reset(clock_one, timer_1)
            reset(clock_two, timer_2)
         }
      }
   }
}

toggle_play.addEventListener("click", function () {
   pause()
})
window.addEventListener("keydown", (e) => {
   if (e.key == " "){
      pause()
   }
})
reset_btn.addEventListener("click", () => {
   if (!clock_one.classList.contains("start")) {
   reset_btn.animate(rotate_animation, 800)
   reset(clock_one, timer_1)
   reset(clock_two, timer_2)
   }
})
