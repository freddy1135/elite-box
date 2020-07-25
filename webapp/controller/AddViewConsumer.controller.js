sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast"
], function (Controller, UIComponent, JSONModel, Fragment, MessageToast) {
    "use strict";

    return Controller.extend("elite.controller.AddViewConsumer", {

        onInit: function (oEvent) {

            var oConsumerModel = new JSONModel({
                consumers: []
            });
            oConsumerModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay)
            this.getView().setModel(oConsumerModel);

            this.getRealTimeConsumers(this.getConsumerCollection());
        },

        getConsumerCollection: function () {
            var firebaseModel = this.getOwnerComponent().getModel("firebase"),
                firestore = firebaseModel.getData().firestore,
                cConsumer = firestore.collection("consumer");
            return cConsumer;
        },

        getRealTimeConsumers: function (cConsumer) {

            cConsumer.onSnapshot(function (snapshot) {
                var aConsumerData = this.getView().getModel().getData();
                snapshot.docChanges().forEach(function (change) {

                    var oConsumer = change.doc.data(),
                        index;
                    oConsumer.id = change.doc.id;

                    if (change.type === "added") {
                        aConsumerData.consumers.push(oConsumer);
                    } else if (change.type === "modified") {
                        index = aConsumerData.consumers.map(function (consumer) {
                            return consumer.id;
                        }).indexOf(oConsumer.id);
                        aConsumerData.consumers[index] = oConsumer;
                    } else if (change.type === "removed") {
                        index = aConsumerData.consumers.map(function (consumer) {
                            return consumer.id;
                        }).indexOf(oConsumer.id);
                        aConsumerData.consumers.splice(index, 1);
                    }
                });

                this.getView().getModel().refresh(true);
                this.byId("idConsumerTable").getBinding("items").refresh();
            }.bind(this));
        },

        onEdit: function (oEvent) {
            var oView = this.getView();
            var sPath = this.byId("idConsumerTable").getSelectedContextPaths()[0];
            if (!this.byId("oEditConsumerDialog")) {
                Fragment.load({
                    id: oView.getId(),
                    name: "elite.fragment.ConsumerEdit",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.bindElement(sPath);
                    oDialog.open();
                }.bind(this));
            } else {
                this.byId("oEditConsumerDialog").bindElement(sPath);
                this.byId("oEditConsumerDialog").open();
            }
        },

        onCreate: function (oEvent) {
            var oView = this.getView();
            var sPath = this.byId("idConsumerTable").getSelectedContextPaths()[0];

            if (!this.byId("oCreateConsumerDialog")) {
                Fragment.load({
                    id: oView.getId(),
                    name: "elite.fragment.ConsumerCreate",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.open();
                }.bind(this));
            } else {
                this.byId("oCreateConsumerDialog").open();
            }
            this.byId("createConsumerNoInput").setValue();
            this.byId("createConsumerNameInput").setValue();
        },

        onSelectionChange: function (oEvent) {
            var bVisibility = this.byId("idConsumerTable").getSelectedItems().length > 0;
            this.byId("consumerEditBtn").setEnabled(bVisibility);
        },

        onPressSubmit: function (oEvent) {
            var sID = this.byId("oEditConsumerDialog").getBindingContext().getProperty("id"),
                cConsumerRef = this.getConsumerCollection().doc(sID);
            cConsumerRef.update({
                "ConsumerNo": this.byId("consumerNoInput").getValue(),
                "Name": this.byId("consumerNameInput").getValue()
            }).then(function () {
                MessageToast.show("Consumer Details Updated");
                this.byId("oEditConsumerDialog").close();
                this.byId("idConsumerTable").fireSelectionChange();
            }.bind(this)).catch(function (error) {
                MessageToast.show("Error: " + error);
            });
        },

        onPressDelete: function (oEvent) {
            var sID = this.byId("oEditConsumerDialog").getBindingContext().getProperty("id"),
                cConsumerRef = this.getConsumerCollection().doc(sID);
            cConsumerRef.delete().then(function () {
                MessageToast.show("Consumer Deleted");
                this.byId("oEditConsumerDialog").close();
                this.byId("idConsumerTable").fireSelectionChange();
            }.bind(this)).catch(function (error) {
                MessageToast.show("Error: " + error);
            });
        },

        onPressCreate: function (oEvent) {
            var cConsumer = this.getConsumerCollection();
            cConsumer.add({
                "ConsumerNo": this.byId("createConsumerNoInput").getValue(),
                "Name": this.byId("createConsumerNameInput").getValue()
            }).then(function () {
                MessageToast.show("Consumer Created");
                this.byId("oCreateConsumerDialog").close();
                this.byId("idConsumerTable").fireSelectionChange();
            }.bind(this)).catch(function (error) {
                MessageToast.show("Error: " + error);
            });
        },

        onPressCancel: function (oEvent) {
            if (this.byId("oEditConsumerDialog")) {
                this.byId("oEditConsumerDialog").close();
            }
            if (this.byId("oCreateConsumerDialog")) {
                this.byId("oCreateConsumerDialog").close();
            }
        },

        onPressCreateCancel: function (oEvent) {
            this.byId("oCreateConsumerDialog").close();
        }

    });

});