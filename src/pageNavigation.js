const TABS = {
    'active': 'cell-container',
    'cell-container': {
        'display': 'grid'
    },
    'seed-shop': {
        'display': 'flex'
    }
}

function changeTab(tab){
    let previousTab = document.getElementById(TABS['active']);
    previousTab.style.display= 'none'
    TABS['active'] = tab;
    let nextTab = document.getElementById(tab);
    nextTab.style.display = TABS[tab]['display'];
}