// Time Format

function format(time) {
  const date = new Date;
  date.setTime(time);

  let minutes = "" + date.getMinutes();
  if (minutes < 10) minutes = "0" + minutes;

  let seconds = "" + date.getSeconds();
  if (seconds < 10) seconds = "0" + seconds;

  return `${date.getHours()}:${minutes}:${seconds}`;
}

document.querySelectorAll('[time]').forEach((timeElement) => {
  timeElement.innerText = format(parseInt(timeElement.getAttribute('time'), 10));
})

// Markdown Format

let converter = new showdown.Converter();

document.querySelectorAll('.markdown').forEach((e) => {
  let md = e.innerHTML;
  md = md.replaceAll('&gt;', '>');
  md = md.replaceAll('&lt;', '<');
  e.innerHTML = converter.makeHtml(md);
})