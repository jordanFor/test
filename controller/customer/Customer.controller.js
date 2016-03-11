sap.ui.define([
	"sap/coveragemap/maintainmycustomer/controller/BaseController"
], function (BaseController) {
	"use strict";
	return BaseController.extend("sap.coveragemap.maintainmycustomer.controller.customer.Customer", {
		onInit: function () {
			var oRouter = this.getRouter();
			oRouter.getRoute("customer").attachMatched(this._onRouteMatched, this);
			this._initializeUpdateTable();
		},
		
		_onRouteMatched : function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();
			//var oModel = oView.getModel("customerModel");
			oView.bindElement({
			    path : "/Customers/" + oArgs.customerIndexID,
			    model: 'customerModel',
				events : {
					change: this._onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
						oView.setBusy(false);
					}
				}
			});
		},
		_onBindingChange : function (oEvent) {
			// No data for the binding
		//	if (!this.getView().getBindingContext()) {
		//		this.getRouter().getTargets().display("notFound");
		//	}
		},
		
		_initializeUpdateTable : function (oEvent) {
		   var coverageMapUpdatePageContainer =	this.getView().byId("coverageMapUpdatePage");
		   var parentCmp = this;
		   var coverageMapUpdateTable = new sap.m.Table({
							id: "coverageMapUpdatePTable",
							inset: false,
							headerToolbar: new sap.m.Toolbar({
								content: [								
								  new sap.m.Title({text:"{i18n>updateCoverageDataTip}:"})
							  ]
							}),
							columns : [
				                        new sap.m.Column({
				                            demandPopin: true,
				                            styleClass: "columnStyle",
				                            header: new sap.m.Text({
				                                text: "{i18n>category}"
				                            })
				                        }),
				                        new sap.m.Column({
				                            demandPopin: true,
				                            styleClass: "columnStyle",
				                            header: new sap.m.Text({
				                                text: "{i18n>role}"
				                            })
				                        }),
				                        new sap.m.Column({
				                            demandPopin: true,
				                            styleClass: "columnStyle",
				                            header: new sap.m.Text({
				                                text: "{i18n>level}"
				                            })
				                        }),
				                        new sap.m.Column({
				                            demandPopin: true,
				                            styleClass: "columnStyle",
				                            header: new sap.m.Text({
				                                text: "{i18n>innovator}"
				                            })
				                        })

				                    ],
							items:{
								path: 'customerModel>roleSet',
								factory: function (sId, oContext) {
									   var level=[{"key":"0","value":"NA"}, {"key":"1","value":"D"},{"key":"2","value":"C"},{"key":"3","value":"B"},{"key":"4","value":"A"}];
									   var arrayLevels = new Array();
									  for(var i=0; i< level.length; i++){
									  	arrayLevels.push(new sap.ui.core.Item({key: level[i].key,text: level[i].value}));
									  }
									   var innovator=[ {"key":"0","value":"false"},{"key":"1","value":"true"}];
									   var innovatorArray = new Array();
									  for(var j=0; j< innovator.length; j++){
									  	innovatorArray.push(new sap.ui.core.Item({key: innovator[j].key,text: innovator[j].value}));
									  }
									return new sap.m.ColumnListItem({
			                            cells: [
			                                    new sap.m.Text({text:"{customerModel>category}"}),
			                                    new sap.m.Text({text:"{customerModel>roleName}"}),
			                                    new sap.m.Select({items: arrayLevels}),
												new sap.m.Select({items: innovatorArray})
			                            ]
			                        });
								}
							}
						});
			coverageMapUpdatePageContainer.addContent(coverageMapUpdateTable);
			  var updateButton = new sap.m.Button({
								  	text:"update",
								  	type:"Accept",  visible: true,
					              	press: function(){
					              		  		parentCmp.getRouter().navTo("appHome",{});
								 }});
			  	coverageMapUpdatePageContainer.addContent(updateButton);
		
		},
		
		onShowHistoryCoverageeData : function(oEvent){
			var oItem;
			oItem = oEvent.getSource();
			var oCtx1 = oItem.getBindingContext();
			//oCtx = oItem.getBindingContext("Employees");
			this.getRouter().navTo("coverageDataHistory",{
			//	companyID : oCtx1.getProperty("CompanyID")
		    	companyHistoryIndexID : oCtx1.getPath().substr(11)
			});
		},
		
		onSavCoverageeData : function(oEvent){
			var oItem;
			oItem = oEvent.getSource();
			var oModel = oItem.getBindingContext().getModel();
			var sPath =oItem.getBindingContext().getPath();
			var bindingData = oModel.getProperty(sPath);
			var test="";
		}
	});
});