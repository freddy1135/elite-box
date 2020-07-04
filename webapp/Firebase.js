sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "elite/FirebaseConfig"
], function (JSONModel, FirebaseConfig) {
    "use strict";

    return {
        initializeFirebase: function () {
            // Initialize Firebase with the Firebase-config
            firebase.initializeApp(FirebaseConfig);
            // firebase.analytics();

            // Create a Firestore reference
            var firestore = firebase.firestore();

            // Firebase services object
            var oFirebase = {
                firestore: firestore
            };

            // Create a Firebase model out of the oFirebase service object which contains all required Firebase services
            var fbModel = new JSONModel(oFirebase);

            // Return the Firebase Model
            return fbModel;
        }
    };
});