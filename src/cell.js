class Cell {
    constructor(id, type) {
        this.id = id;
        this.type = type;
        this.state = 'default';


        this.setType = function (type) {
            if (!TYPES[this.type]['to_types'].includes(type)) {
                return false;
            }
            this.type = type;
            element = this.getHTMLElement();
            element.className = `cell ${type} fa-solid fa-${TYPES[type].icon}`;
            return true;
        };

        this.getHTMLElement = function () {
            return document.getElementById(this.id);
        };



    }
}