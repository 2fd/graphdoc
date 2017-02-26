(function () {

    var ACTIVE_CLASS = 'is-active';
    var navigation = document.querySelector('nav');
    var toggles = document.querySelectorAll('.js-toggle-navigation');

    function toggleNavigation() {
        navigation.classList.contains(ACTIVE_CLASS) ?
            navigation.classList.remove(ACTIVE_CLASS) :
            navigation.classList.add(ACTIVE_CLASS);
    }

    Array.prototype.forEach.call(
        toggles,
        /**
         * @param {HTMLElement} toggle
         */
        function (toggle) {
            toggle.addEventListener('click', toggleNavigation);
        }
    )

})()