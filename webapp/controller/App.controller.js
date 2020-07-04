sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
	"use strict";

	return Controller.extend("elite.controller.App", {

		onInit: function () {
			var oRouter = UIComponent.getRouterFor(this);
			oRouter.getRoute("login").attachPatternMatched(this._onObjectMatched, this);
		},

		onBeforeRendering: function (oEvent) {
			this.oBusyDialog = new sap.m.BusyDialog();
			this.oBusyDialog.open();
		},

		onAfterRendering: function (oEvent) {
			this.oBusyDialog.close();
		},

		_onObjectMatched: function (oEvent) {
			var bUserSession = window.sessionStorage.getItem("UserLoggedIn");
			if (bUserSession && bUserSession === "true") {
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("Dashboard");
			}
		},

		onPressLogin: function (oEvent) {
			var firebaseModel = this.getView().getModel("firebase"),
				firestore = firebaseModel.getData().firestore,
				users = firestore.collection("users"),
				username = this.byId("username").getValue().trim(),
				password = this.byId("password").getValue().trim();
			this.oBusyDialog = new sap.m.BusyDialog();
			this.oBusyDialog.open();
			users.where("username", "==", username).where("password", "==", password)
				.get().then(function (querySnapshot) {
					if (querySnapshot.docs.length > 0) {
						this.byId("loginStrip").setVisible(false);
						window.sessionStorage.setItem("UserLoggedIn", "true");
						var oRouter = UIComponent.getRouterFor(this);
						oRouter.navTo("Dashboard", null, true);
					} else {
						this.byId("loginStrip").setVisible(true);
					}
					this.oBusyDialog.close();
				}.bind(this))
				.catch(function (error) {
					this.oBusyDialog.close();
					console.log("Error getting user details: ", error);
				});
		},

	});

});