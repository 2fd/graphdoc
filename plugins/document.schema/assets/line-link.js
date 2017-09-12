(function () {
  ready(function () {
    var tables = window.document.getElementsByClassName('code');

    for (var i = 0; i < tables.length; i++) {
      var table = tables[i];

      table.addEventListener('click', onClick);
    }

    window.addEventListener("hashchange", onHashChange, false);

    onHashChange();
  });

  function onHashChange() {
    var id = window.location.href.split('#')[1];

    if (!id) {
      return;
    }

    var lcid = id.indexOf('C') === -1 ? id.replace('L', 'LC') : id;
    var lineCode = window.document.getElementById(lcid);

    if (!lineCode) {
      return;
    }

    var highlighted = lineCode.closest('.code').getElementsByClassName('highlighted');

    for (var i = 0; i < highlighted.length; i++) {
      highlighted[i].classList.remove('highlighted');
    }

    lineCode.classList.add('highlighted');
  }

  function onClick(e) {
    var target = e.target;

    if (!target.classList.contains('td-index')) {
      return;
    }

    var href = window.location.href.split('#')[0];

    window.location.href = href + '#' + target.id;
  }

  function ready(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }
})();

// https://developer.mozilla.org/ru/docs/Web/API/Element/closest
(function(e){
  e.closest = e.closest || function(css){
    var node = this;

    while (node) {
      if (node.matches(css)) return node;
      else node = node.parentElement;
    }
    return null;
  }
})(Element.prototype);