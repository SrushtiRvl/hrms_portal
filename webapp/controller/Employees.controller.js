sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller,MessageToast) => {
    "use strict";

    return Controller.extend("zhrmsportal.controller.Employees", {
        onInit:function(){
            var oModel=this.getOwnerComponent().getModel("Departments");
            this.getView().setModel('Departments',oModel);
            this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getRoute("Employees");
        }
        
    })
}
)