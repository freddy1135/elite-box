sap.ui.define([], function () {
    "use strict";
    return {
        "selectedKey": "home",
        "navigation": [{
                "title": "Home",
                "icon": "sap-icon://home",
                "key": "home"
            },
            {
                "title": "Search",
                "icon": "sap-icon://search",
                "key": "search",
                "expanded": false
            },
            {
                "title": "Lend Box",
                "icon": "sap-icon://add",
                "key": "lend_box",
                "expanded": false
            },
            {
                "title": "Return Box",
                "icon": "sap-icon://sap-box",
                "key": "return_box",
                "expanded": false
            },
            {
                "title": "Settings",
                "icon": "sap-icon://settings",
                "expanded": false,
                "key": "addViewBox",
                "items": [{
                        "title": "Add/View Boxes",
                        "key": "addViewBox"
                    },
                    {
                        "title": "Add/View Consumers",
                        "key": "addViewConsumer"
                    }
                ]
            }
        ],
        "fixedNavigation": [{
            "title": "About",
            "icon": "sap-icon://hint"
        }]
    };
});