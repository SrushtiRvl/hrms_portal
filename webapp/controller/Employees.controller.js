sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller,MessageToast,Filter,FilterOperator) => {
    "use strict";

    return Controller.extend("zhrmsportal.controller.Employees", {
        onInit:function(){
            // var oModel=this.getOwnerComponent().getModel("Modules");
            // this.getView().setModel(oModel,'Modules');
            var oDataModel=this.getOwnerComponent().getModel()
            var oModel=new sap.ui.model.json.JSONModel();
            oDataModel.read("/Employees",{
                success:function(data,res){
                    oModel.setData(data.results)
                    this.getView().setModel(oModel,"Employees")
                    this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);
                    this.oRouter.getRoute("Employees");
                }.bind(this),
                error:function(e){
                    debugger
                }
            })
            // var modelEmp=this.getOwnerComponent().getModel("Employees");
            // this.getView().setModel(modelEmp,'Employees');
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
            var data=oEvent.getSource().getBindingContext("Employees").getObject();
            // var p=sap.ui.getCore().byId("editPage")
            this.oRouter.navTo("Edit")
            
        },
        onDelete:function(oEvent){

        }
        
    })
}
)