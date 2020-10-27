document.addEventListener('DOMContentLoaded', () => {
  const sub_files_input = document.querySelector('#sub_files_input');
  const message = document.querySelector('#file_dialog .message');
  const languages = document.querySelector('#languages select');

  const mainClass = document.querySelector('#mainClass');
  const mainClassInput = document.querySelector('#mainClass input');

  sub_files_input.onchange = function () {
    const list = document.createElement('ul');
    let language = "Java"
    Array.from(this.files).forEach((file) => {
      if (file.name.match(/\.java/)) language = "Java";
      if (file.name.match(/\.py/)) language = "Python 3";
      if (file.name.match(/\.c/)) language = "C";
      const listItem = document.createElement('li');
      listItem.innerText = file.name;
      list.appendChild(listItem);
    })
    message.innerHTML = "<h3>Your submission will include the following files:</h3>"
    message.appendChild(list);

    languages.value = language;
    if (language != "Java") {
      mainClass.style.display = "none";
    } else {
      mainClass.style.display = "block";
      mainClassInput.value = this.files[0].name.replace(".java", "");
    }
  }
});