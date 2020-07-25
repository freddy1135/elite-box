sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast"
], function (Controller, UIComponent, JSONModel, Fragment, MessageToast) {
    "use strict";

    return Controller.extend("elite.controller.AddViewBox", {

        onInit: function (oEvent) {

            var oBoxModel = new JSONModel({
                boxes: []
            });
            oBoxModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay)
            this.getView().setModel(oBoxModel);

            this.getRealTimeBoxes(this.getBoxCollection());
        },

        getBoxCollection: function () {
            var firebaseModel = this.getOwnerComponent().getModel("firebase"),
                firestore = firebaseModel.getData().firestore,
                cBox = firestore.collection("box");
            return cBox;
        },

        getRealTimeBoxes: function (cBox) {

            cBox.onSnapshot(function (snapshot) {
                var aBoxData = this.getView().getModel().getData();
                snapshot.docChanges().forEach(function (change) {

                    var oBox = change.doc.data(),
                        index;
                    oBox.id = change.doc.id;

                    if (change.type === "added") {
                        aBoxData.boxes.push(oBox);
                    } else if (change.type === "modified") {
                        index = aBoxData.boxes.map(function (box) {
                            return box.id;
                        }).indexOf(oBox.id);
                        aBoxData.boxes[index] = oBox;
                    } else if (change.type === "removed") {
                        index = aBoxData.boxes.map(function (box) {
                            return box.id;
                        }).indexOf(oBox.id);
                        aBoxData.boxes.splice(index, 1);
                    }
                });

                this.getView().getModel().refresh(true);
                this.byId("idBoxTable").getBinding("items").refresh();
            }.bind(this));
        },

        onEdit: function (oEvent) {
            var oView = this.getView();
            var sPath = this.byId("idBoxTable").getSelectedContextPaths()[0];
            if (!this.byId("oEditBoxDialog")) {
                Fragment.load({
                    id: oView.getId(),
                    name: "elite.fragment.BoxEdit",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.bindElement(sPath);
                    oDialog.open();
                }.bind(this));
            } else {
                this.byId("oEditBoxDialog").bindElement(sPath);
                this.byId("oEditBoxDialog").open();
            }
        },

        onCreate: function (oEvent) {
            var oView = this.getView();
            var sPath = this.byId("idBoxTable").getSelectedContextPaths()[0];

            if (!this.byId("oCreateBoxDialog")) {
                Fragment.load({
                    id: oView.getId(),
                    name: "elite.fragment.BoxCreate",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.open();
                }.bind(this));
            } else {
                this.byId("oCreateBoxDialog").open();
            }
            this.byId("createBoxNoInput").setValue();
            this.byId("createBoxNameInput").setValue();
        },

        onSelectionChange: function (oEvent) {
            var bVisibility = this.byId("idBoxTable").getSelectedItems().length > 0;
            this.byId("boxEditBtn").setEnabled(bVisibility);
        },

        onPressSubmit: function (oEvent) {
            var sID = this.byId("oEditBoxDialog").getBindingContext().getProperty("id"),
                cBoxRef = this.getBoxCollection().doc(sID);
            cBoxRef.update({
                "BoxNo": this.byId("boxNoInput").getValue(),
                "Name": this.byId("boxNameInput").getValue()
            }).then(function () {
                MessageToast.show("Box Details Updated");
                this.byId("oEditBoxDialog").close();
                this.byId("idBoxTable").fireSelectionChange();
            }.bind(this)).catch(function (error) {
                MessageToast.show("Error: " + error);
            });
        },

        onPressDelete: function (oEvent) {
            var sID = this.byId("oEditBoxDialog").getBindingContext().getProperty("id"),
                cBoxRef = this.getBoxCollection().doc(sID);
            cBoxRef.delete().then(function () {
                MessageToast.show("Box Deleted");
                this.byId("oEditBoxDialog").close();
                this.byId("idBoxTable").fireSelectionChange();
            }.bind(this)).catch(function (error) {
                MessageToast.show("Error: " + error);
            });
        },

        onPressCreate: function (oEvent) {
            var cBox = this.getBoxCollection();
            cBox.add({
                "BoxNo": this.byId("createBoxNoInput").getValue(),
                "Name": this.byId("createBoxNameInput").getValue()
            }).then(function () {
                MessageToast.show("Box Created");
                this.byId("oCreateBoxDialog").close();
                this.byId("idBoxTable").fireSelectionChange();
            }.bind(this)).catch(function (error) {
                MessageToast.show("Error: " + error);
            });
        },

        onPressCancel: function (oEvent) {
            if (this.byId("oEditBoxDialog")) {
                this.byId("oEditBoxDialog").close();
            }
            if (this.byId("oCreateBoxDialog")) {
                this.byId("oCreateBoxDialog").close();
            }
        },

        onPressCreateCancel: function (oEvent) {
            this.byId("oCreateBoxDialog").close();
        }

    });

});