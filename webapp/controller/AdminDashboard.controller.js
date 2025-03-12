sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller,MessageToast) => {
    "use strict";

    return Controller.extend("zhrmsportal.controller.AdminDashboard", {
        onInit:function(){
            this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getRoute("AdminDashboard");
        },
        onPress:function(oEvent){
            var tile=oEvent.getSource().getProperty('header');
            this.oRouter.navTo(tile);
        }
    })
}
)