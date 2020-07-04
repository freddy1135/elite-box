sap.ui.define([
    "sap/ui/model/json/JSONModel",
], function (JSONModel) {
    "use strict";

    var firebaseConfig = {
        apiKey: "AIzaSyAPvPi1Vqb-W-YunrXSkduRBDyYn-xATWk",
        authDomain: "elite-box.firebaseapp.com",
        databaseURL: "https://elite-box.firebaseio.com",
        projectId: "elite-box",
        storageBucket: "elite-box.appspot.com",
        messagingSenderId: "454266096372",
        appId: "1:454266096372:web:0ec81db9e53c428df12ca1"
      };

    return {
        initializeFirebase: function () {
            // Initialize Firebase with the Firebase-config
            firebase.initializeApp(firebaseConfig);
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