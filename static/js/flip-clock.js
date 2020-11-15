function CountdownTracker(label, value) {

  var el = document.createElement('span')

  el.className = 'flip-clock__piece'
  el.innerHTML = '<b class="flip-clock__card card"><b class="card__top"></b><b class="card__bottom"></b><b class="card__back"><b class="card__bottom"></b></b></b>' +
    '<span class="flip-clock__slot">' + label + '</span>'

  this.el = el

  var top = el.querySelector('.card__top'),
    bottom = el.querySelector('.card__bottom'),
    back = el.querySelector('.card__back'),
    backBottom = el.querySelector('.card__back .card__bottom')

  this.update = function (val) {
    val = ( '0' + val ).slice(-2)
    if (val !== this.currentValue) {

      if (this.currentValue >= 0) {
        back.setAttribute('data-value', this.currentValue)
        bottom.setAttribute('data-value', this.currentValue)
      }
      this.currentValue = val
      top.innerText = this.currentValue
      backBottom.setAttribute('data-value', this.currentValue)

      this.el.classList.remove('flip')
      void this.el.offsetWidth
      this.el.classList.add('flip')
    }
  }

  this.update(value)
}

// Calculation adapted from https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/

const thirtyOneDays = [0, 2, 4, 6, 7, 9, 11] // January, March, May, July, August, October, December

function getTimeRemaining(endtime) {
  let now = new Date()
  var t = endtime - now
  let months = ((endtime.getMonth() - now.getMonth()) + 12) % 12
  if (months > 0) {
    let deltaDays = 0
    for(let i = 0; i < months; i++) {
      let month = ((new Date()).getMonth() + i) % 12
      if (month == 1) deltaDays += 28 // February
      else if (thirtyOneDays.includes(month)) deltaDays += 31
      else deltaDays += 30
      month = (month + 1) % 12
    }
    t -= deltaDays * (1000 * 60 * 60 * 24)
  }
  return {
    'Total': Date.parse(endtime) - Date.parse(new Date()),
    'Months': months,
    'Days': Math.floor(t / (1000 * 60 * 60 * 24)),
    'Hours': Math.floor((t / (1000 * 60 * 60)) % 24),
    'Minutes': Math.floor((t / 1000 / 60) % 60),
    'Seconds': Math.floor((t / 1000) % 60)
  } 
}

function Clock(countdown) {
  countdown = new Date(Date.parse(countdown))

  this.el = document.createElement('div')
  this.el.className = 'flip-clock'

  var trackers = {},
    t = getTimeRemaining(countdown),
    key, timeinterval

  for (key in t) {
    if (key === 'Total' || !t[key]) {
      continue
    }
    trackers[key] = new CountdownTracker(key, t[key])
    this.el.appendChild(trackers[key].el)
  }

  var i = 0
  function updateClock() {
    timeinterval = requestAnimationFrame(updateClock)

    // throttle so it's not constantly updating the time.
    if (i++ % 10) {
      return
    }

    var t = getTimeRemaining(countdown)
    if (t.Total < 0) {
      cancelAnimationFrame(timeinterval)
      for (key in trackers) {
        trackers[key].update(0)
      }
      return
    }

    for (key in trackers) {
      trackers[key].update(t[key])
    }
  }

  setTimeout(updateClock, 500)
}

document.addEventListener('DOMContentLoaded', () => {
  fetch("/api/contest")
    .then(res => res.json())
    .then(res => {
      document.querySelector("#competition_name").innerText = res.competition_name
      startDate = new Date((parseInt(res.start_date) * 1000) - ((new Date()).getTimezoneOffset() * 60000))

      if (startDate <= Date.now())
        return

      var c = new Clock(startDate)
      var countdown_before = document.querySelector('#countdown_before')
      countdown_before.style.display = 'block'
      countdown_before.appendChild(c.el)
    })
})