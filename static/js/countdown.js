let startDate, endDate;

document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/contest")
    .then(res => res.json())
    .then(res => {
      document.querySelector("#competition_name").innerText = res.competition_name
      startDate = new Date(parseInt(res.start_date) * 1000)
      endDate = new Date(parseInt(res.end_date) * 1000)
    })

  const start = document.querySelector("#start_time")
  const end = document.querySelector("#end_time")

  const timeElapsed = document.querySelector("#timeElapsed")
  const timeRemaining = document.querySelector("#timeRemaining")

  const progressBar = document.querySelector("#progress-bar")

  setInterval(() => {
    if (!startDate || !endDate) return
    
    start.innerText = startDate.toLocaleString()
    end.innerText = endDate.toLocaleString()

    const total = endDate - startDate
    const now = Date.now()
    const percent = Math.min((now - startDate) / total, 1)

    if (endDate - now > 0) {
      timeElapsed.innerText = formatTime(now - startDate)
      timeRemaining.innerText = formatTime(endDate - now)
    } else {
      timeElapsed.innerText = formatTime(endDate - startDate)
      timeRemaining.innerText = "Finished"
    }

    progressBar.style.width = `${percent * 100}%`
  }, 20);
})