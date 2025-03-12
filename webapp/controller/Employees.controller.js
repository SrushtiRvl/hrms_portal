sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller,MessageToast) => {
    "use strict";

    return Controller.extend("zhrmsportal.controller.Employees", {
        onInit:function(){
            var oModel=this.getOwnerComponent().getModel("Departments");
            this.getView().setModel(oModel,'Departments');
            var modelEmp=this.getOwnerComponent().getModel("Employees");
            this.getView().setModel(modelEmp,'Employees');
            this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getRoute("Employees");
        },
        onEdit:function(oEvent){
            
        },
        onDelete:function(oEvent){
            
        }
        
    })
}
)