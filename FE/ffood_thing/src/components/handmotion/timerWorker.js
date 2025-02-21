// timerWorker.js

let timer = 0
let isTimerRunning = false
let interval = null

function startInterval() {
  interval = setInterval(() => {
    if (isTimerRunning && timer > 0) {
      timer--
      self.postMessage({ type: "updateTimer", timer })
      console.log("타이머:", timer)
    } else if (timer <= 0) {
      clearInterval(interval)
      self.postMessage({ type: "alarm" })
    }
  }, 1000)
}

self.onmessage = (e) => {
  if (e.data.type === "stopTimer") {
    clearInterval(interval)
    self.postMessage({ type: "timerStopped" })
  } else if (e.data.type === "startTimer") {
    timer = e.data.timer
    isTimerRunning = true
    startInterval()
  }
}
