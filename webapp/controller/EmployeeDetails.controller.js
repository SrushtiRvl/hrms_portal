sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    'sap/ui/core/BusyIndicator'
], (Controller,MessageToast,Filter,FilterOperator,MessageBox,BusyIndicator) => {
    "use strict";
    return Controller.extend("zhrmsportal.controller.EmployeeDetails", {
        onInit:function(){
            this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getRoute("EmployeeDetails").attachPatternMatched(this.bindDetails,this);
        },
        onDeleteDegree:function(oEvent){
            MessageBox.confirm("Do you want to delete degree?", {
                title: "Delete Degree",
                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                onClose: function (e) {
                    if(e==="OK"){
                        BusyIndicator.show(0);
                        var sPath=oEvent.getSource().getBindingContext().sPath
                        var id=this.getView().getModel().getProperty(sPath).DEGREE_ID
                        var path="/Degree("+id+")"
                        this.getOwnerComponent().getModel().remove(path,{
                            success: (e)=>{
                                this.getOwnerComponent().getModel().read("/Employees",{
                                    urlParameters:{"$expand":"EMP_DEGREES"},
                                    success:(data)=>{
                                        this.getOwnerComponent().getModel("Employees").setData(data.results)
                                        var oData=this.getOwnerComponent().getModel("Employees").getData()[this.path]
                                        this.getView().getModel().setData(oData)
                                        this.getView().getModel().refresh();
                                        BusyIndicator.hide();
                                        MessageToast("Degree has been deleted successfuly!");
                                    },
                                    error:(e)=>{
                                        debugger
                                    }
                                })
                                debugger
                            },
                            error: ((e)=>{
                                debugger
                            })
                        })
                    }
                }.bind(this)
            });
           
        },
        gotoDashboard:function(e){
            this.oRouter.navTo("AdminDashboard");
        },
        gotoEmployees:function(e){
            this.oRouter.navTo("Employees");
        },
        bindDetails:function(e){
            debugger
            BusyIndicator.hide();
            this.path=Number(e.getParameter('arguments').path)
            var oData=this.getOwnerComponent().getModel('Employees').getData()[this.path]
            var oModel=new sap.ui.model.json.JSONModel(oData)
            this.getView().setModel(oModel)
        }
    })
}
)