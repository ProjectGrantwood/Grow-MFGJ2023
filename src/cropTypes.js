CROPS = {
    'none': createCrop(
        '',
        '',
        '',
        0,
        0,
        0,
        0,
        0,
        {},
        {}
    ),
    'tinflower': createCrop(
        'Tinflower',
        'Tinflowers',
        'A thin flower that grows moderately quickly, but is considered a weed by most farmers. Can be cultivated for sale as a raw material in sugar-free sweeteners, but has limited value as no other crops will grow when planted near tinflower due to toxins in its pollen. Must be planted adjacent to water of some kind.',
        3,
        5,
        1,
        10,
        1,
        {
            'irrigation-channel': {
                'min': 1,
                'or': ['water-source'],
            },
            'water-source': {
                'min': 1,
                'or': ['irrigation-channel'],
            }
        },
        {}
    ),
    'bronzeberry': createCrop(
        'Bronzeberry',
        'Bronzeberries',
        'A common, fast-growing berry that produces quickly but is not particularly valuable. In larger quantities, it is profitable when sold as a dye base. Must be planted adjacent to water of some kind.',
        2,
        2,
        2,
        100,
        1,
        {
            'irrigation-channel': {
                'min': 1,
                'or': ['water-source'],
            },
            'water-source': {
                'min': 1,
                'or': ['irrigation-channel'],
            },
        },
        {
            'planted-ready': {
                'max': 0,
                'or': ['planted-growing', 'planted-inactive'],
                'if-crop': ['tinflower']
            },
            'planted-inactive': {
                'max': 0,
                'or': ['planted-growing', 'planted-ready'],
                'if-crop': ['tinflower']
            },
            'planted-growing': {
                'min': 0,
                'or': ['planted-inactive', 'planted-ready'],
                'if-crop': ['tinflower']
            }

        }
    ),
    'rhodiumvine': createCrop(
        'Rhodium Vine',
        'Rhodium Vines',
        'A creeping trellis vine that produces bark stronger than most metals, but has a very low yield and relatively long growth periods. Can grow in low-moisture areas',
        6,
        10,
        3,
        1000,
        4,
        {},
        {
            'planted-ready': {
                'max': 0,
                'or': ['planted-growing', 'planted-inactive'],
                'if-crop': ['tinflower']
            },
            'planted-inactive': {
                'max': 0,
                'or': ['planted-growing', 'planted-ready'],
                'if-crop': ['tinflower']
            },
            'planted-growing': {
                'max': 0,
                'or': ['planted-inactive', 'planted-ready'],
                'if-crop': ['tinflower']
            }
        }
    ),
    'silverroot': createCrop(
        'Silverroot',
        'Silverroot',
        'A very fragile, slow-growing crop that is highly productive under the right conditions, and has many uses across many different sectors of industry. Cannot be planted near rocky land, as certain naturally occuring geological compounds in our region of the world are toxic to this crop. Must be planted near water.',
        7,
        11,
        5,
        10000,
        10,
        {
            'irrigation-channel': {
                'min': 1,
                'or': ['water-source'],
            },
            'water-source': {
                'min': 1,
                'or': ['irrigation-channel'],
            },
        },
        {
            'planted-ready': {
                'max': 0,
                'or': ['planted-growing', 'planted-inactive'],
                'if-crop': ['tinflower']
            },
            'planted-inactive': {
                'max': 0,
                'or': ['planted-growing', 'planted-ready'],
                'if-crop': ['tinflower']
            },
            'planted-growing': {
                'max': 0,
                'or': ['planted-inactive', 'planted-ready'],
                'if-crop': ['tinflower']
            },
            'rock': {
                'max': 0,
                'or': [],
            }
        }
    ),
    'goldengrain': createCrop(
        'Goldengrain',
        'Goldengrain',
        'A slow-growth, high-yield crop used in both luxury textiles and malt beverages. Goldengrain is not ideal for soil recycling, and therefore needs to be planted near crops that are able to supply it with new soil, such as Rhodium Vine or Bronzeberry. Must also be planted near water.',
        6,
        8,
        8,
        100000,
        25,
        {
            'irrigation-channel': {
                'min': 1,
                'or': ['water-source'],
            },
            'water-source': {
                'min': 1,
                'or': ['irrigation-channel'],
            },
            'planted-ready': {
                'min': 1,
                'or': ['planted-growing', 'planted-inactive'],
                'if-crop': ['rhodiumvine', 'bronzeberry']
            },
            'planted-inactive': {
                'min': 1,
                'or': ['planted-growing', 'planted-ready'],
                'if-crop': ['rhodiumvine', 'bronzeberry']
            },
            'planted-growing': {
                'min': 1,
                'or': ['planted-ready', 'planted-inactive'],
                'if-crop': ['rhodiumvine', 'bronzeberry']
            }
            
        },
        {
            'planted-ready': {
                'max': 0,
                'or': ['planted-growing', 'planted-inactive'],
                'if-crop': ['tinflower']
            },
            'planted-inactive': {
                'max': 0,
                'or': ['planted-growing', 'planted-ready'],
                'if-crop': ['tinflower']
            },
            'planted-growing': {
                'max': 0,
                'or': ['planted-inactive', 'planted-ready'],
                'if-crop': ['tinflower']
            }

        }
    ),
    'neonfruit': createCrop(
        'Neonfruit',
        'Neonfruit',
        'A quick-growing vine with incandescent fruit which contains compounds used in all modern technology. Also recently trending as a nutrient-dense super-food. Requires more water to grow than most crops.',
        3,
        3,
        13,
        1000000,
        32,
        {
            'irrigation-channel': {
                'min': 2,
                'or': ['water-source'],
            },
            'water-source': {
                'min': 2,
                'or': ['irrigation-channel'],
            },
        },
        {
            'planted-ready': {
                'max': 0,
                'or': ['planted-growing', 'planted-inactive'],
                'if-crop': ['tinflower']
            },
            'planted-inactive': {
                'max': 0,
                'or': ['planted-growing', 'planted-ready'],
                'if-crop': ['tinflower']
            },
            'planted-growing': {
                'max': 0,
                'or': ['planted-inactive', 'planted-ready'],
                'if-crop': ['tinflower']
            }

        }
    )

}


function createCrop(
    displayName,
    plural,
    description,
    fallow_days,
    grow_days,
    harvest_days,
    purchase_value,
    harvest_value,
    required_neighbors,
    forbidden_neighbors
) {
    return ({
        displayName: displayName,
        pluralName: plural,
        description: description,
        base_fallow_days: fallow_days,
        base_grow_days: grow_days,
        base_harvest_days: harvest_days,
        purchase_value: purchase_value,
        harvest_value: harvest_value,
        required_neighbors: required_neighbors,
        forbidden_neighbors: forbidden_neighbors
    })
}