document.addEventListener('DOMContentLoaded', () => {
  const start = document.querySelector('#start');
  const end = document.querySelector('#end');

  const startDate = new Date(start.getAttribute('value'));
  const endDate = new Date(end.getAttribute('value'));

  const timeElapsed = document.querySelector('#timeElapsed');
  const timeRemaining = document.querySelector('#timeRemaining');

  const progressBar = document.querySelector('#progress-bar');

  setInterval(() => {
    start.innerText = startDate.toLocaleString();
    end.innerText = endDate.toLocaleString();

    const total = endDate - startDate;
    const now = Date.now();
    const percent = Math.min((now - startDate) / total, 1);

    if (endDate - now > 0) {
      timeElapsed.innerText = formatTime(now - startDate);
      timeRemaining.innerText = formatTime(endDate - now);
    } else {
      timeElapsed.innerText = formatTime(endDate - startDate);
      timeRemaining.innerText = "Finished";
    }

    progressBar.style.width = `${percent * 100}%`;
  }, 20);
})