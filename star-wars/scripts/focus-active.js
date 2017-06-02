(function () {
    var navScroll = document.getElementById('navication-scroll');
    var header = document.querySelector('nav header');
    var active = document.querySelector('.slds-is-active a');

    if(active)
        navScroll.scrollTop = active.offsetTop - header.offsetHeight - Math.ceil(active.offsetHeight / 2)
})()