function formatTime(milliseconds) {
    const date = new Date(milliseconds);

    let minutes = "" + date.getMinutes();
    if (minutes < 10) minutes = "0" + minutes;

    let seconds = "" + date.getSeconds();
    if (seconds < 10) seconds = "0" + seconds;

    return  `${date.getHours()}:${minutes}:${seconds}`;
}

// Any elements that have a `time` attribute with milliseconds will be formmated.
function formatTimes() {
  document.querySelectorAll("[time]").forEach((timeElement) => {
    const time = parseInt(timeElement.getAttribute("time"), 10);

    timeElement.innerText = formatTime(time)
  });
}

// Any elements with the class `markdown` will convert to HTML.
function convertMarkdown() {
  let converter = new showdown.Converter();
  document.querySelectorAll('.markdown').forEach((e) => {
    let md = e.innerHTML;
    md = md.replaceAll("&gt;", ">");
    md = md.replaceAll("&lt;", "<");
    e.innerHTML = converter.makeHtml(md);
  });
}

// Any form groups that have a date attribute will fill the the child date and time inputs
// With appropriate default values.
function fillDateInputs() {
  document.querySelectorAll('.date.fields').forEach((dateField) => {
    let value = new Date(dateField.getAttribute('date')).toISOString();

    // YYYY-MM-DDTHH:MM:SS.####Z
    let date = value.substring(0, 10); // The first 10 chars represents the date (YYYY-MM-DD)
    let time = value.substring(11, 16); // The following 5 chars after 'T' represent the time (HH:MM)

    dateField.querySelector('input[type=date]').value = date;
    dateField.querySelector('input[type=time]').value = time;
  })
}

document.addEventListener("DOMContentLoaded", () => {
  formatTimes();
  convertMarkdown();
  fillDateInputs();
});