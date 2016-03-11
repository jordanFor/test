sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/coveragemap/maintainmycustomer/model/models",
	"sap/ui/model/json/JSONModel"
], function(UIComponent, Device, models, JSONModel) {
	"use strict";

	return UIComponent.extend("sap.coveragemap.maintainmycustomer.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			// create the views based on the url/hash
            this.getRouter().initialize();
			     
        	var sNamespace = this.getMetadata().getManifestEntry("sap.app").id;
    		var oModel = new JSONModel(jQuery.sap.getModulePath(sNamespace, "/mockdata/Companies.json")); 
    		this.setModel(oModel,"customerModel");
    		//this.setModel(oModel);
		}
	});

});