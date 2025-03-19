sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller,MessageToast,Filter,FilterOperator) => {
    "use strict";

    return Controller.extend("zhrmsportal.controller.Modules", {
        onInit:function(){
            this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getRoute("Modules");

            var oModel=this.getOwnerComponent().getModel("Modules");
            this.getView().setModel(oModel,'Modules');
        },
        onSearch:function(oEvent){
            var tbl=this.getView().byId('mTable');
            var aFilter=[];
            // var sQuery=oEvent.getParameter('query');
            var sQuery=oEvent.getSource().getValue();
            aFilter.push(new Filter({
                'filters':[
                    new Filter('mName',FilterOperator.Contains,sQuery),
                    new Filter('mCode',FilterOperator.EQ,sQuery),
                    new Filter('mType',FilterOperator.Contains,sQuery)
                ],
                or:true
            }))
            tbl.getBinding('items').filter(aFilter);
        },
        onPress:function(oEvent){
            var tile=oEvent.getSource().getProperty('header');
            this.oRouter.navTo(tile);
        }
    })
}
)