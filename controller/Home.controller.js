sap.ui.define([
	"sap/coveragemap/maintainmycustomer/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("sap.coveragemap.maintainmycustomer.controller.Home", {
		onInit: function () {
			this.getView().setModel(sap.ui.getCore().getModel("i18n"), "i18n");
			// initialize customer list table
			this._initializeCustomerListTable();
		},
		
		_initializeCustomerListTable : function () {
		   var pageContainer =	this.getView().byId("customerListPage");
		   var parentCmp = this;
		   var customerListTable = new sap.m.Table({
							id: "customerListTable",
							inset: false,
							headerToolbar: new sap.m.Toolbar({

								content: [								
								  new sap.m.Title({text:"{i18n>customerList}"}),
								  new sap.m.ToolbarSpacer({}),
                                  new sap.m.Text({text:"3 {i18n>customers}"})
							  ]
							}),
							columns : [
				                        new sap.m.Column({
				                            demandPopin: true,
				                            styleClass: "columnStyle",
				                            header: new sap.m.Text({
				                                text: "{i18n>customer}"
				                            })
				                        }),
				                        new sap.m.Column({
				                            demandPopin: true,
				                            styleClass: "columnStyle",
				                            header: new sap.m.Text({
				                                text: "{i18n>alert}"
				                            })
				                        }),
				                        new sap.m.Column({
				                            demandPopin: true,
				                            styleClass: "columnStyle",
				                            header: new sap.m.Text({
				                                text: "{i18n>allAverageScore}"
				                            })
				                        })

				                    ],
							items:{
								path: 'customerModel>/Customers',
								factory: function (sId, oContext) {
									var data1Index = oContext.sPath.split("/")[2];
									var customerId = oContext.oModel.oData.Customers[data1Index].CustomerId;
									var cfoAveNum = oContext.oModel.oData.Customers[data1Index].CXOAverageScore;
									var cfoAvePercent = cfoAveNum/4*100 -4;
									var allAveNum = oContext.oModel.oData.Customers[data1Index].AllAverageScore;
									var allAvePercent = allAveNum/4*100 -4;
									jQuery('<style>').text(".point1"+customerId
									+"{bottom:42%;left:"+cfoAvePercent+"%; width:85%;height:30%;position:absolute;}").appendTo(jQuery('head'));
									jQuery('<style>').text(".point2"+customerId
									+"{bottom:28%;left:"+allAvePercent+"%; width:85%;height:30%;position:absolute;}").appendTo(jQuery('head'));
									
									//define cxoAve/allAve diagram
									var tableItemString = "<div class='tableClass'><div class='rectangleRed'></div><div class='rectangleOrange'></div><div class='rectangleGreen'></div>"
															+"<div class='"+"point1"+customerId+"'><div id='cxoAveScore' style='font-size:62.5%;'>CXO AVE "+cfoAveNum+"</div><div class='triangle-down'></div></div>"
															+"<div class='"+"point2"+customerId+"'><div class='triangle-up'></div><div id='allAveScore' style='font-size:62.5%'>All AVE "+allAveNum+"</div></div>"
															+"<div class='line'></div>"
															+"<div class='num0'>0</div><div class='num1'>1</div><div class='num2'>2</div><div class='num3'>3</div><div class='num4'>4</div>"
															+"<div class='letterD'>D</div><div class='letterC'>C</div><div class='letterB'>B</div><div class='letterA'>A</div></div>";
									return new sap.m.ColumnListItem({
										type: "Navigation",
										press:  [function(oEvent) {
														var oItem;
														oItem = oEvent.getSource();
														//var oCtx1 = oItem.getBindingContext();
														var oCtx = oItem.getBindingContext("customerModel");
														parentCmp.getRouter().navTo("customer",{
														//	companyID : oCtx1.getProperty("CompanyID")
													    	customerIndexID : oCtx.getPath().substr(11)
														});
			                             }, this],
			                            cells: [
			                                    new sap.m.Text({text:"{customerModel>Customer}"}),
			                                    new sap.m.Button({
			                                    	icon: "sap-icon://alert",
			                                    	type: sap.m.ButtonType.Transparent,
													visible: "{customerModel>Alert}"
			                                    }),
			                                  new sap.ui.core.HTML({content: tableItemString}).addStyleClass("columnStyle")
			                            ]
			                        });
								}
							}
						});
			pageContainer.addContent(customerListTable);
		},
		
		
		onSortButtonPressed : function (oEvent) {
			this._oVSD.open();
		},
		
		onCompanyChatsButton : function (oEvent) {
			this.getRouter().navTo("report",{});
		},
		
		onItemPressed : function(oEvent){
			var oItem;
			oItem = oEvent.getSource();
			var oCtx1 = oItem.getBindingContext();
			//oCtx = oItem.getBindingContext("Employees");
			this.getRouter().navTo("company",{
			//	companyID : oCtx1.getProperty("CompanyID")
		    	companyIndexID : oCtx1.getPath().substr(11)
			});
		},
		
		commonCreateEditDialog : function(selectedId){
			 if(this.companyDetailsDialog){
			  this.companyDetailsDialog.destroy();
		   }
		   this.companyDetailsDialog = sap.ui.xmlfragment("companyDetailsDialog","com.test.hcp2c4a.view.fragment.CompanyDetails", this);
		   this.getView().addDependent(this.companyDetailsDialog);
		  // this.companyDetailsDialog.setModel(this.goalModel);      
		  var oModel = new JSONModel();
		  if(selectedId){
		  	//set selected data if has selected Id
		  	var data = this.getView().getModel().getData();
		  	var ajustGroup = this._oTable.getBinding("items").aIndices;
		  	var realIndex = ajustGroup[selectedId];
		  	oModel.setData(data.Companies[realIndex]);
		  	this.companyDetailsDialog.selectedCompanyIndexId = selectedId;
		  }
		  this.companyDetailsDialog.setModel(oModel);
		  this.companyDetailsDialog.attachAfterClose(jQuery.proxy(function() {
		    	this.companyDetailsDialog.destroy();
		    }, this));
		  this.getView().addDependent(this.companyDetailsDialog);
		  this.companyDetailsDialog.attachBeforeOpen(jQuery.proxy(function() {
		   }, this));
	       
	       // set dialog title
	      var oBundle = this.getView().getModel("i18n").getResourceBundle();
	      if(selectedId){
			  	//edit company if has selectedId
			  	var editTitle = oBundle.getText("createEditCompany", ["Edit"]);
			  	this.companyDetailsDialog.setTitle(editTitle);
		  }else{
			  	//create company if has no selectedId
			  	var createTitle = oBundle.getText("createEditCompany", ["Create"]);
			  	this.companyDetailsDialog.setTitle(createTitle);
		   }
		   this.companyDetailsDialog.open();
		},
		
		onCreateCompany  : function(){
		  this.commonCreateEditDialog();
		},
		
		
		onEditCompany  : function(oEvent){
		   var idStr=	oEvent.getParameter("id");
		   var selectedId = this.parseSelectedCompanyIndexId(idStr);
			if (selectedId) {
		    	this.commonCreateEditDialog(selectedId);
			}else {
				jQuery.sap.require("sap.ui.commons.MessageBox");
                sap.ui.commons.MessageBox.show("No Company Id.",
                        sap.ui.commons.MessageBox.Icon.INFORMATION, "Caution!",
                        [sap.ui.commons.MessageBox.Action.YES,sap.ui.commons.MessageBox.Action.OK]);
			}
		},
		
		onDeleteCompany  : function(oEvent){
			var me = this;
			var idStr=	oEvent.getParameter("id");
			jQuery.sap.require("sap.ui.commons.MessageBox");
            sap.ui.commons.MessageBox.show("Are you sure to delete?",
                        sap.ui.commons.MessageBox.Icon.INFORMATION, "Caution!",
                        [sap.ui.commons.MessageBox.Action.YES,sap.ui.commons.MessageBox.Action.CANCEL], function(data){
                        	if(data === "YES"){
								var selectedId = me.parseSelectedCompanyIndexId(idStr);
								var data = me.getView().getModel().getData();
								if(selectedId && data){
									// delete selected data
									data.Companies.splice(selectedId,1);
									me.getView().getModel().setData(data);
								}
                        	}
              });
		},
		
		parseSelectedCompanyIndexId :  function(idStr){
		  var groups = idStr.split("-");
		  var selectedId= groups[groups.length-1];
		  return selectedId;
		},
		
		onCompanyDetailsCancelPressed: function () {
			if(this.companyDetailsDialog){
				this.companyDetailsDialog.close();
			}
       },
       
       onCompanyDetailsSavePressed: function(){
       	var data = this.getView().getModel().getData();
        var inputData =	this.companyDetailsDialog.getModel().getData();
        if(this.companyDetailsDialog.selectedCompanyIndexId){
        	// save edited company by selectedCompanyIndexId
        	data.Companies[this.companyDetailsDialog.selectedCompanyIndexId]=inputData;
        }else{
        	//save new company
        	inputData["CompanyID"]=data.Companies.length +1;
            data.Companies[data.Companies.length]=inputData;
        }
        this.getView().getModel().setData(data);
        this.onCompanyDetailsCancelPressed();
       },
       
       onFilterCompanyTable : function (oEvent) {
			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter(
					[new Filter("Customer", FilterOperator.Contains, sQuery),
					 new Filter("Sector", FilterOperator.Contains, sQuery),
					 new Filter("BU", FilterOperator.Contains, sQuery),
					 new Filter("AE", FilterOperator.Contains, sQuery)],false));
				
			//	filter.aFilters.push(new sap.ui.model.Filter(filterList[i].path,
              //  operator, searchTerm)); 
			}
			// filter binding
		    var oTable = this.getView().byId("compniesTable");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(aFilter);
		}
	});

});