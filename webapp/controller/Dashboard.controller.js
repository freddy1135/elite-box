sap.ui.define([
	'jquery.sap.global',
	'sap/ui/Device',
	'sap/ui/core/Fragment',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/m/Popover',
	'sap/m/Button',
	'sap/m/library',
	"sap/ui/core/UIComponent",
	"sap/m/MessageBox",
	"elite/model/SideNavigationData"
], function (jQuery, Device, Fragment, Controller, JSONModel, Popover, Button, mobileLibrary, UIComponent, MessageBox, SideNavigationData) {
	"use strict";

	var ButtonType = mobileLibrary.ButtonType,
		PlacementType = mobileLibrary.PlacementType;

	var CController = Controller.extend("elite.controller.Dashboard", {
		model: new JSONModel(),

		data: SideNavigationData,

		onInit: function () {

			this.getView().setBusy(true);
			this.model.setData(this.data);
			this.getView().setModel(this.model);
			this._setToggleButtonTooltip(!Device.system.desktop);

			this.oRouter = UIComponent.getRouterFor(this);
			this.oRouter.getRoute("Dashboard").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function (oEvent) {
			var bUserSession = window.sessionStorage.getItem("UserLoggedIn");
			if (!bUserSession || bUserSession === "false") {
				this.oRouter.navTo("login");
			}
			this.getView().setBusy(false);
		},

		onItemSelect: function (oEvent) {
			var item = oEvent.getParameter('item');
			this.byId("pageContainer").to(this.getView().createId(item.getKey()));
		},

		onPressLogout: function (event) {
			MessageBox.confirm("Do you really want to logout?", {
				onClose: function (sAction) {
					if (sAction === "OK") {
						window.sessionStorage.setItem("UserLoggedIn", "false");
						var oRouter = UIComponent.getRouterFor(this);
						oRouter.navTo("login");

					}
				}.bind(this)
			});
		},

		onSideNavButtonPress: function () {
			var toolPage = this.byId("toolPage");
			var sideExpanded = toolPage.getSideExpanded();

			this._setToggleButtonTooltip(sideExpanded);

			toolPage.setSideExpanded(!toolPage.getSideExpanded());
		},

		_setToggleButtonTooltip: function (bLarge) {
			var toggleButton = this.byId('sideNavigationToggleButton');
			if (bLarge) {
				toggleButton.setTooltip('Expand');
			} else {
				toggleButton.setTooltip('Collapse');
			}
		}

	});


	return CController;

});