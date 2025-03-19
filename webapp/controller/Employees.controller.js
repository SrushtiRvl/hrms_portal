sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller,MessageToast,Filter,FilterOperator) => {
    "use strict";

    return Controller.extend("zhrmsportal.controller.Employees", {
        onInit:function(){
            var oModel=this.getOwnerComponent().getModel("Modules");
            this.getView().setModel(oModel,'Modules');
            var modelEmp=this.getOwnerComponent().getModel("Employees");
            this.getView().setModel(modelEmp,'Employees');
            this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getRoute("Employees");
        },
        onAddEmp(oEvent){
            this.oRouter.navTo("AddEmployee");
        },
        onSearch(oEvent){
            var tbl=this.getView().byId('empTable');
            var aFilter=[];
            // var sQuery=oEvent.getParameter('query');
            var sQuery=oEvent.getSource().getValue();
            aFilter.push(new Filter({
                'filters':[
                    new Filter('empName',FilterOperator.Contains,sQuery),
                    new Filter('empCode',FilterOperator.EQ,sQuery),
                    new Filter('officialEmail',FilterOperator.Contains,sQuery),
                    new Filter('joiningDate',FilterOperator.Contains,sQuery),
                    new Filter('teamLead',FilterOperator.Contains,sQuery),
                    new Filter('role',FilterOperator.Contains,sQuery),
                    new Filter('status',FilterOperator.Contains,sQuery)
                ],
                or:true
            }))
            tbl.getBinding('items').filter(aFilter);
        },
        onEdit:function(oEvent){
            
        },
        onDelete:function(oEvent){

        }
        
    })
}
)