(function() {
    const regex = /https:\/\/scratch\.mit\.edu\/projects\/(.*)/;
    const project_id = window.location.href.match(regex)[1];
    window.open(`https://codeabac.us/gold/submit/${project_id}`)
}())