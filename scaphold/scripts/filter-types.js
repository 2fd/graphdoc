(function () {
    var HIDE_CLASS = 'slds-hide';
    var ITEM_CLASS = 'slds-item';

    /**
     * @class Item
     * @param {HTMLLIElement} li
     */
    function Item(li) {
        this.li = li;
        this.type = li.title;
        this.typeLowerCase = li.title.toLowerCase();
    }

    /**
     * @return boolean
     */
    Item.prototype.contains = function (searchText) {
        return this.typeLowerCase.indexOf(searchText) >= 0;
    }

    /**
     * @return boolean
     */
    Item.prototype.isHide = function () {
        this.li.classList.contains(HIDE_CLASS);
    }

    /**
     * @return void
     */
    Item.prototype.hide = function () {
        if (!this.isHide())
            this.li.classList.add(HIDE_CLASS);
    }

    /**
     * @return void
     */
    Item.prototype.show = function () {
        this.li.classList.remove(HIDE_CLASS);
    }

    /**
     * @class ItemList
     * @param {Item[]} items
     */
    function ItemList(items) {
        this.items = items;
    }

    /**
     * @function ItemsList.fromSelector
     * @param {string} selector
     * @return ItemList
     */
    ItemList.fromSelector = function (selector) {

        var lis = document.querySelectorAll(selector);
        var items = Array.prototype.map.call(lis, function (li) {
            return new Item(li);
        })

        return new ItemList(items);
    }

    /**
     * @return void
     */
    ItemList.prototype.showIfmatch = function (match) {

        match = match.toLowerCase(match);

        this
            .items
            .forEach(function (item) {
                item.contains(match) ?
                    item.show():
                    item.hide();
            })
    }

    /** 
     * @var {ItemList} items
     * @var {HTMLInputElement} input
     */
    var items = ItemList.fromSelector('nav .slds-navigation-list--vertical li');
    var input = document.getElementById('type-search');
    var lastMatch = '';

    function onChange() {
        if (input.value === lastMatch)
            return;

        lastMatch = input.value;
        items.showIfmatch(lastMatch);
    }

    input.addEventListener('change', onChange);
    input.addEventListener('keyup', onChange);
    input.addEventListener('mouseup', onChange);
})()