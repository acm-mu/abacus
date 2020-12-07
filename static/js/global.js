function onEvent(eventName, elementSelector, handler) {
    document.addEventListener(eventName, function (e) {
        for (var target = e.target; target && target != this; target = target.parentNode)
            if (target.matches(elementSelector)) {
                handler.call(target, e)
                break
            }
    }, false)
}

function createElement(html) {
    let temp = document.createElement('template')
    html = html.trim()
    temp.innerHTML = html
    return temp.content.firstChild
}

function notify(title, msg) {
    styleTop = 3
    document.querySelectorAll('.ui.message.notification').forEach((notification) => {
        notification.style.top = `${styleTop += 6}em`
    })

    const message = createElement(`<div class="ui notification floating success message"><i class="close icon" onclick="dismiss(this)"></i><div class="header">${title}</div><p>${msg}</p></div>`)
    document.body.prepend(message)
}

function dismiss(elem) {
    elem.parentNode.classList.add('fade')
    setTimeout(function () {
        elem.parentNode.remove()
    }, 250)
}

function showMessage(status, msg) {
    const message = createElement(`<div id="success-message" style="display: flex" class="ui tiny icon message ${status}"/>`)

    switch (status) {
        case 'success':
            message.appendChild(createElement('<i class="check tiny icon"/>'))
            message.appendChild(createElement(`<div class="content"><div class="header">Success!</div> <p>${msg}</p></div>`))
            break
        case 'error':
            message.appendChild(createElement('<i class="exclamation circle tiny icon"/>'))
            message.appendChild(createElement(`<div class="content"><div class="header">Error!</div> <p>${msg}</p></div>`))
            break
        case 'warning':
            message.appendChild(createElement('<i class="exclamation triangle tiny icon"/>'))
            message.appendChild(createElement(`<div class="content"><div class="header">Warning!</div> <p>${msg}</p></div>`))
            break
    }

    document.querySelector('body div.main.container').prepend(message)
}