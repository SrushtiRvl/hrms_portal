sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    return Controller.extend("zhrmsportal.controller.AdminDashboard", {
        onInit: function () {
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getRoute("AdminDashboard");
            this.getOwnerComponent().getModel("User").setData({
                User1: "Srushti Raval",
                User2: "Kurvesh Patel",
                User3: "Bhavesh Tiwari",
                UserModule: "SAP Fiori"
            });
            this.oDataModel = this.getOwnerComponent().getModel();
            this.oModel = new sap.ui.model.json.JSONModel()
            this.readData("Modules");
            this.readData("Employees");
            this.readData("Project");
            this.readModelData("Modules");
            debugger
        },
        readModelData:function(entityset){
            this.oDataModel.read("/"+entityset, {
                success: (data, res) => {
                    debugger
                    this.getOwnerComponent().getModel(entityset).setProperty("/"+entityset,data.results)
                },
                error: (e) => {
                    debugger
                }
            })
        },
        readData:function(entityset){
            this.oDataModel.read("/"+entityset+"/$count", {
                success: async (data, res) => {
                    debugger
                    this.oModel.setProperty("/"+entityset,data)
                    this.getView().setModel(this.oModel)
                },
                error: (e) => {
                    debugger
                }
            })
            
           
        },
        onPress: function (oEvent) {
            var tile = oEvent.getSource().getProperty('header');
            this.oRouter.navTo(tile);
        }
    })
}
)