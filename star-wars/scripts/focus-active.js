(function () {

    var autofocus = document.querySelector('[autofocus]');
    var actives = document.querySelectorAll('.slds-is-active a');
    var len = actives.length;
    var i = 0;

    while (i < len) {
        actives[i].focus();
        i++;
    }

    if (autofocus)
        autofocus.focus();
})()