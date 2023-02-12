class Cell {
    constructor(id, x, y, type) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.type = type;
        this.cropType = 'none';
    }


    setType(type) {
        if (!TYPES[this.type]['to_types'].includes(type)) {
            return false;
        }
        this.type = type;
        let element = document.getElementById(this.id);
        element.className = `cell ${type} fa-solid fa-${TYPES[type].icon}`;
        return true;
    }

    generatePoints() {
        if (this.type == 'planted-ready') {
            let baseValue = CROPS[this.cropType].value;
            //baseValue = CROPS[this.cropType].processEffects(base_value);
            return baseValue;
        }
    }
    
    getElement(){
        return document.getElementById(this.id);
    }
    
    setTooltip(){
        let cellElement = this.getElement();
        if (!cellElement.className.match(/\h(?:tooltip)/)){
            cellElement.className += ' tooltip';
            let tooltip = TYPES[this.type]['tooltip'];
            if (this instanceof Planted_Cell){
                tooltip += ` Crop Information: ${CROPS[this.cropType].description}`;
            }
            cellElement.setAttribute('data-tooltip', tooltip);
        }
    }

}

class Planted_Cell extends Cell {
    constructor(id, x, y, cropType) {
        super(id, x, y, 'planted-growing');
        this.cropType = cropType;
        this.growingDays = CROPS[cropType].base_grow_days;
    }

    growToday() {
        this.growingDays -= 1;
        if (this.growingDays === 0) {
            this.setType('planted-ready');
            this.harvestDays = CROPS[this.cropType].base_harvest_days;
        }
    }

    harvestToday() {
        PLAYER.harvestCrop(this.cropType);
        PLAYER.renderMoney();
        this.harvestDays -= 1;
        if (this.harvestDays === 0) {
            this.setType('planted-inactive');
            this.fallowDays = CROPS[this.cropType].base_fallow_days;
        }
    }

    fallowToday() {
        this.fallowDays -= 1;
        if (this.fallowDays === 0) {
            this.setType('planted-growing');
            this.growingDays = CROPS[this.cropType].base_grow_days;
        }
    }

    update() {
        switch (this.type) {
            case 'planted-growing':
                this.growToday();
                break;
            case 'planted-ready':
                this.harvestToday();
                break;
            case 'planted-inactive':
                this.fallowToday();
                break;
        }
    }

}


/* The following object contains properties & methods related to the farm grid. */


const GRID = {

    'cell-size': '20px',
    'width': 6,
    'height': 6,
    'data': new Array(6).fill().map((_, x) =>
        new Array(6).fill().map((_, y) =>
            new Cell(`cell${x}-${y}`, x, y, 'empty'))
    ),


    setCellType(x, y, type) {
        this['data'][x][y].setType(type)
    },

    init(initialMapData) {
        if (initialMapData === undefined) {
            initialMapData = [];
            addedWaterSource = false;
            totalRocks = 12;
            for (let i = 0; i < 6; i++) {
                initialMapData[i] = [];
                for (let j = 0; j < 6; j++) {
                    let availableTileTypes;
                    if (addedWaterSource) {
                        if (totalRocks > 0) {
                            availableTileTypes = ['tillable', 'rock'];
                        } else {
                            availableTileTypes = ['tillable']
                        }
                    } else {
                        if (totalRocks > 0) {
                            availableTileTypes = ['water-source', 'tillable', 'rock']
                        } else {
                            availableTileTypes = ['tillable', 'water-source'];
                        }
                    }
                    let tileType = availableTileTypes[Math.floor(Math.random() * availableTileTypes.length)];
                    if (tileType === 'rock') {
                        totalRocks -= 1;
                    } else if (tileType === 'water-source') {
                        addedWaterSource = true;
                    }
                    initialMapData[i][j] = tileType;
                }
            }
        }
        for (let i = 0; i < initialMapData.length; i++) {
            for (let j = 0; j < initialMapData[i].length; j++) {
                this.setCellType(i, j, initialMapData[i][j]);
            }
        }
    },

    updateAll() {
        for (let x = 0; x < this['width']; x++) {
            for (let y = 0; y < this['height']; y++) {
                if (['planted-growing', 'planted-ready', 'planted-inactive'].includes(this['data'][x][y].type)){
                    this['data'][x][y].update();
                }
            }
        }
    }

}

GRID.init(initialMap);

