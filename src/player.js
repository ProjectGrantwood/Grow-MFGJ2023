const PLAYER = {

    money: 10,

    ownedSeeds: {
    },

    activeSeed: 'none',

    tools: {
        'bulldozer': {
            owned: true,
            permittedCellTypes: ['rock', 'tillable', 'irrigation-channel', 'planted-growing', 'planted-ready'],
            costOfUse: {
                'rock': 120,
                'tillable': 60,
                'irrigation-channel': 80,
                'planted-growing': 20,
                'planted-ready': 20
            }
        },
        'hoe': {
            owned: true,
            permittedCellTypes: ['tillable', 'tilled', 'planted-inactive'],
            costOfUse: {
                'tillable': 0,
                'tilled': 0,
                'planted-inactive': 10,
            }
        },
        'trowel': {
            owned: true,
            permittedCellTypes: ['tilled', 'planted-ready'],
            costOfUse: {
                'tillable': 0,
                'planted-ready': 0
            }
        },
        'none': {
            owned: true,
            permittedCellTypes: [],
            costOfUse: {},
        }
    },

    activeTool: 'none',
    
    purchaseSeed(cropType){
        if (CROPS[cropType].purchase_value > this.money){
            return;
        }
        this.money -= CROPS[cropType].purchase_value;
        if (!document.getElementById('no-seeds').hasAttribute('hidden')){
            document.getElementById('no-seeds').setAttribute('hidden', 'true');
            document.getElementById('seed-table').removeAttribute('hidden');
        }
        this.renderMoney();
        this.addSeeds(cropType, 1);
    },

    addSeeds(cropType, amount) {
        if (!Object.keys(this.ownedSeeds).includes(cropType)) {
            this.ownedSeeds[cropType] = 0;
            let table = document.getElementById('seed-table-body');
            table.innerHTML += `<tr id="${cropType}-table-row" class="seed-table-inactive"><td>${CROPS[cropType].displayName}</td><td id="${cropType}-amount"></td><td><button class="btn btn-primary" onclick="PLAYER.setActiveSeed('${cropType}')">Select</button></tr>`
        }
        this.ownedSeeds[cropType] += amount;
        document.getElementById(`${cropType}-amount`).innerHTML = this.ownedSeeds[cropType];
    },

    setActiveSeed(seedType) {
        if (this.activeSeed === seedType) {
            let tableRow = document.getElementById(`${seedType}-table-row`);
            tableRow.className = "seed-table-inactive";
            this.activeSeed = 'none';
            return;
        }
        if (this.activeSeed !== 'none') {
            let tableRow = document.getElementById(`${this.activeSeed}-table-row`);
            tableRow.className = "seed-table-inactive";
        }
        this.activeSeed = seedType;
        let tableRow = document.getElementById(`${seedType}-table-row`);
        tableRow.className = "seed-table-active";
    },

    setActiveTool(toolID) {
        // if the tool the player selects is the same as the tool currently active, 
        // remove the classname indicating that tool as active to the player and set the active tool to "none" internally.
        // ...essentially, toggle the active tool off.
        if (this.activeTool === toolID) {
            let element = document.getElementById(this.activeTool);
            element.className = 'tool-button tool-button-inactive tooltip';
            this.activeTool = 'none';
            return;
        }
        // if the selected tool is not none, and the above if-statement is not true,
        // also remove the classname indicating to the player that the current active tool is active.
        if (this.activeTool !== 'none') {
            let element = document.getElementById(this.activeTool);
            element.className = 'tool-button tool-button-inactive tooltip';
        }
        this.activeTool = toolID;
        element = document.getElementById(toolID);
        element.className = 'tool-button tool-button-active tooltip';
    },

    // The following method is specifically for use of tools to change the "type" property of a cell.
    // For planting seeds, see the "plantSeed" method.

    actOnTile(x, y) {
        if (this.activeTool == 'none' || !this.tools[this.activeTool].permittedCellTypes.includes(GRID['data'][x][y].type)) {
            return;
        } else {
            if (this.activeTool === 'hoe') {
                switch (GRID['data'][x][y].type) {
                    case 'tillable':
                        GRID['data'][x][y].setType('tilled');
                        break;
                    case 'planted-inactive':
                        GRID['data'][x][y].setType('tilled');
                        break;
                    case 'tilled':
                        GRID['data'][x][y].setType('tillable');
                        break;
                }
            } else if (this.activeTool === 'bulldozer') {
                switch (GRID['data'][x][y].type) {
                    case 'tillable':
                        this.bulldoze(x, y, 'tillable', 'irrigation-channel')
                        break;
                    case 'rock':
                        this.bulldoze(x, y, 'rock', 'tillable');
                        break;
                    case 'irrigation-channel':
                        this.bulldoze(x, y, 'irrigation-channel', 'tillable');
                        break;
                    case 'planted-growing':
                        this.bulldoze(x, y, 'planted-growing', 'tillable');
                        break;
                    case 'planted-ready':
                        this.bulldoze(x, y, 'planted-ready', 'tillable');
                        break;
                }
            } else if (this.activeTool === 'trowel') {
                if (GRID.testNeighbors(this.activeSeed, x, y)){
                    this.plantSeed(this.activeSeed, x, y);
                }
            }
        }
    },

    bulldoze(x, y, fromType, toType) {
        if (this.tools['bulldozer'].costOfUse[fromType] > this.money) {
            return;
        } else {
            this.money -= this.tools['bulldozer'].costOfUse[fromType];
            this.renderMoney();
            GRID['data'][x][y].setType(toType);
        }
    },

    plantSeed(seedType, x, y) {
        if (GRID['data'][x][y].type !== 'tilled' || !Object.keys(PLAYER.ownedSeeds).includes(seedType) || PLAYER.ownedSeeds[seedType] === 0) {
            return;
        }
        GRID['data'][x][y] = new Planted_Cell(GRID['data'][x][y].id, x, y, seedType);
        GRID['data'][x][y].setTooltip();
        this.ownedSeeds[seedType] -= 1;
        let seedDisplay = document.getElementById(`${seedType}-amount`);
        seedDisplay.innerHTML = this.ownedSeeds[seedType];
    },

    harvestCrop(cropType){
        this.money += CROPS[cropType].harvest_value;
        this.renderMoney();
    },
    
    renderMoney(){
        let moneyDisplay = document.getElementById('money-display');
        moneyDisplay.innerHTML = `$ ${this.money}`;
    }

}