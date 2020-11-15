let startDate, endDate;

document.addEventListener("DOMContentLoaded", () => {

  fetch("/api/contest")
    .then(res => res.json())
    .then(res => {
      document.querySelector("#competition_name").innerText = res.competition_name
      startDate = new Date((parseInt(res.start_date) * 1000) - ((new Date()).getTimezoneOffset() * 60000))
      endDate = new Date((parseInt(res.end_date) * 1000) - ((new Date()).getTimezoneOffset() * 60000))
  
      document.querySelector("#start_time").innerText = startDate.toLocaleString()
      document.querySelector("#end_time").innerText = endDate.toLocaleString()

      if (Date.now() >= startDate)
        setInterval(updateClock, 0, 500)
    })
})

function updateClock() {
  document.querySelector("#countdown_during").style.display = 'block'

  const timeElapsed = document.querySelector("#timeElapsed")
  const timeRemaining = document.querySelector("#timeRemaining")

  const total = endDate - startDate
  const now = Date.now()

  if (endDate - now > 0) {
    timeElapsed.innerText = formatTime(now - startDate)
    timeRemaining.innerText = formatTime(endDate - now)
  } else {
    timeElapsed.innerText = formatTime(endDate - startDate)
    timeRemaining.innerText = "Finished"
  }

  const percent = Math.min((now - startDate) / total, 1)
  document.querySelector("#progress-bar").style.width = `${percent * 100}%`
}