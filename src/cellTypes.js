/* Use the createType() function with these parameters entered as strings:

    -icon:                      a Font Awesome icon name (without the 'fa' prefix)
    -dislpay name:              what the player will see
    -tooltip text:              what the player will see, used by Cell.setTooltip().
    -to_types:                  when a cell changes its type (thru the method Cell.setType()), which types are allowed?
    
*/

const TYPES = {
    
    'empty': createType(
        'code',
        'Empty',
        'A tile devoid of any features, only used in game development',
        ['empty', 'rock', 'tilled', 'tillable', 'planted-ready', 'planted-growing', 'planted-inactive', 'water-source', 'irrigation-channel'],
    ),
    
    'rock': createType(
        'mound',
        'Rock',
        'This rock cannot be removed without the right tool',
        ['tillable'],
    ),
    
    'tilled': createType(
        'circle-exclamation',
        'Tilled Soil',
        'Soil readied for planting.',
        ['planted-growing', 'tillable']
    ),
    
    'tillable': createType(
        'lines-leaning',
        'Tillable Land',
        'This land seems suitable for planting',
        ['tilled', 'irrigation-channel']
    ),
    
    'planted-ready': createType(
        'wheat-awn',
        'Harvestable Crop',
        'This crop is ready to be harvested and sold',
        ['planted-inactive', 'tillable']
    ),
    
    'planted-growing': createType(
        'seedling',
        'Growing Crop',
        'This crop is growing just fine, but isn\'t yet ready for harvest',
        ['planted-ready', 'tillable']
    ),
    
    'planted-inactive': createType(
        'trowel',
        'Inactive Crop',
        'This crop is currently out of season',
        ['tilled', 'planted-growing', 'tillable']
    ),
    
    'water-source': createType(
        'arrow-up-from-ground-water',
        'Water Source',
        'A source of water. You can connect an irrigation channel to this.',
        ['empty']
    ),
    
    'irrigation-channel': createType(
        'water',
        'Irrigation Channel',
        'This channel allows you to water crops in dry areas.',
        ['tillable']
    ),
    
}

function createType(icon, displayName, tooltipText, to_types){
    return ({
        'icon': icon,
        'displayName': displayName,
        'tooltip': tooltipText,
        'to_types': to_types,
    });
    
}