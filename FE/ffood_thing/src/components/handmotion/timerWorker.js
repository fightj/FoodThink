self.onmessage = function (e) {
  let timer = e.data.timer
  let isTimerRunning = e.data.isTimerRunning

  let interval = setInterval(() => {
    if (isTimerRunning && timer > 0) {
      timer--
      self.postMessage({ type: "updateTimer", timer })
    } else if (timer <= 0) {
      clearInterval(interval)
      self.postMessage({ type: "alarm" })
    }
  }, 1000)

  self.onmessage = (e) => {
    if (e.data.type === "stopTimer") {
      clearInterval(interval)
      self.postMessage({ type: "timerStopped" })
    } else if (e.data.type === "startTimer") {
      isTimerRunning = true
    }
  }
}
