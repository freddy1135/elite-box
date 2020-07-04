sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "./Firebase"
], function (UIComponent, JSONModel, Firebase) {
    "use strict";

    return UIComponent.extend("elite.Component", {

        metadata: {
            manifest: "json"
        },

        init: function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);
            this.setModel(Firebase.initializeFirebase(), "firebase");
            this.getRouter().initialize();
        }
    });
});