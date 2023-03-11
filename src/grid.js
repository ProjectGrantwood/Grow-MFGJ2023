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

    getElement() {
        return document.getElementById(this.id);
    }

    setTooltip() {
        let cellElement = this.getElement();
        if (!cellElement.className.match(/\h(?:tooltip)/)) {
            cellElement.className += ' tooltip';
            let tooltip = TYPES[this.type]['tooltip'];
            if (this instanceof Planted_Cell) {
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
        let el = document.getElementById(this.id);
        el.className += ` ${this.cropType}`;
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

    testNeighbors(cropType, x, y) {
        let forbidden = Object.keys(CROPS[cropType].forbidden_neighbors);
        let required = Object.keys(CROPS[cropType].required_neighbors);
        let neighborhood = getNeighborhood('von neumann');
        
        /* 
            Since forbidden/required neighbors have respectively a max/min threshold
            amount, create two temporary arrays to track the amount of neighbors
            that are forbidden or required, per rule.
        */
        
        let forbiddenAmounts = new Array(forbidden.length).fill().map((_, i) => CROPS[cropType].forbidden_neighbors[forbidden[i]]['max']);
        let requiredAmounts = new Array(required.length).fill().map((_, i) => CROPS[cropType].required_neighbors[required[i]]['min']);
        
        // First, loop over each neighbor cell...
        for (let n = 0; n < neighborhood.length; n++) {
            let x2 = x + neighborhood[n][0];
            let y2 = y + neighborhood[n][1];
            
            /* 
                If the "neighbor" coordinates are beyond the boundaries of the grid, 
                just go to the next cell.
            */
           
            if (x2 < 0 || x2 >= this['width'] || y2 < 0 || y2 > this['height']) {
                continue;
            }
            
            if (Object.hasOwnProperty('type')){
                console.log(x2, y2)
            }
            
            let type = this['data'][x2][y2].type;
            
            /* 
                For each "forbidden" type, test if that neighbor is that type,
                or one of that forbidden type's "or" types. 
                If so, increment the value at that index in the "forbiddenAmounts" array.
            */
                
            for (let i = 0; i < forbidden.length; i++) {
                //first, check if the neighbor's type matches the forbidden type.
                //if it is, increment the value at the same index in the forbiddenAmounts array
                //and then check if we're at the maximum allowable amount of that type,
                //returning "false" if so.
                if (type === forbidden[i]) {
                    forbiddenAmounts[i] -= 1;
                    if (forbiddenAmounts[i] === 0) {
                        return false;
                    }
                } else {
                    //if the neighbor's type doesn't match the forbidden type we're testing,
                    //double-check if it's one of that forbidden neighbor's 'or' types.
                    //if it is, treat it like it's that forbidden type and increment the corresponding
                    //amount in the forbiddenAmounts array accodingly.
                    let orTypes = CROPS[cropType].forbidden_neighbors[forbidden[i]]['or'];
                    for (let j = 0; j < orTypes.length; j++){
                        if (type === orTypes[j]){
                            forbiddenAmounts[i] -= 1;
                            forbiddenAmounts[forbidden.indexOf(orTypes[j])] -= 1;
                            if (forbiddenAmounts[i] === 0 || forbiddenAmounts[forbidden.indexOf(orTypes[j])] === 0) {
                                return false;
                            }
                        }
                    }
                }
            }
            
            // if the type isn't forbidden, then test if it's actually one of the
            // required types.
            
            for (let i = 0; i < required.length; i++){
                if (type === required[i]){
                    //if we've already hit the minimum required neighbors of this type, don't keep testing.
                    if (requiredAmounts[i] >= CROPS[cropType].required_neighbors[required[i]]['min']){
                        return true;
                    }
                    requiredAmounts[i] += 1;
                } else {
                    let orTypes = CROPS[cropType].required_neighbors[required[i]]['or'];
                    for (let j = 0; j < orTypes.length; j++){
                        if (type === orTypes[j]) {
                            //increment both the amount for this type and the orType.
                            requiredAmounts[i] -= 1;
                            requiredAmounts[required.indexOf(orTypes[j])] -= 1;
                            if (requiredAmounts[i] === 0 || requiredAmounts[required.indexOf(orTypes[j])] === 0){
                                return true;
                            }
                        }
                    }
                }
                
                //if we don't return "true" based on any of the checks of required neighbors above,
                //assume that we're missing some required neighbors.
                
                return false;
                
            }
            
            
        }
    },

updateAll() {
        for (let x = 0; x < this['width']; x++) {
            for (let y = 0; y < this['height']; y++) {
                if (['planted-growing', 'planted-ready', 'planted-inactive'].includes(this['data'][x][y].type)) {
                    if (!this.testNeighbors(this['data'][x][y].cropType, x, y)){
                        this.setCellType(x, y, 'tillable')
                    }
                    this['data'][x][y].update();
                }
            }
        }
    }

}



GRID.init();

