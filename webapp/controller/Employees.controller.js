sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/BusyIndicator'
], (Controller,MessageToast,Filter,FilterOperator,BusyIndicator) => {
    "use strict";

    return Controller.extend("zhrmsportal.controller.Employees", {
        onInit:function(){
            // var oModel=this.getOwnerComponent().getModel("Modules");
            // this.getView().setModel(oModel,'Modules');
            this.oDataModel=this.getOwnerComponent().getModel()
            // var oModel=new sap.ui.model.json.JSONModel();
            this.oDataModel.read("/Employees",{
                urlParameters:{"$expand":"EMP_DEGREES"},
                success:function(data,res){
                    // oModel.setData(data.results)
                    this.getOwnerComponent().getModel("Employees").setData(data.results);
                    this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);
                    this.oRouter.getRoute("Employees");
                    var oData=this.getOwnerComponent().getModel("Employees").getData()
                    
                }.bind(this),
                error:function(e){
                    debugger
                }
            })
            this.setFormData()
            // var modelEmp=this.getOwnerComponent().getModel("Employees");
            // this.getView().setModel(modelEmp,'Employees');
        },
        onIncompleteProfile:function(e){
            debugger
            var path=e.getParameter("listItem").getBindingContext("Employees").sPath.split("/")[1]
            this.oRouter.navTo("EmployeeDetails", {
						path:path
					});
        },
        onEmpSelect:function(e){
            debugger
            var path=e.getParameter("listItem").getBindingContext("Employees").sPath.split("/")[1]
            this.oRouter.navTo("EmployeeDetails", {
						path:path
					});
            BusyIndicator.show(0)
        },
        setFormData: function (e) {
            this.getOwnerComponent().getModel('FormData').setProperty('/EmployeeData', {
                "fn": "",
                "ln": "",
                "EMP_EMAIL": "",
                "EMP_MOBILE": "",
                "EMP_DOB": "",
                "EMP_CODE": "",
                "selModule": "",
                "selRole": "",
                "selStatus": "",
                "DESIGNATION": "",
                "DATE_OF_JOINING": "",
                "DEGREE_NAME": "",
                "INSTITUTION_NAME": "",
                "CGPA": "",
                "GRADUATION_DATE": "",
                "mode":""
            })
        },
        onAddEmp(oEvent){
            this.oRouter.navTo("AddEmployee");
        },
        onSearch(oEvent){
            var tbl=this.getView().byId('empTable');
            var aFilter=[];
            // var sQuery=oEvent.getParameter('query');
            var sQuery=oEvent.getSource().getValue();
            if(sQuery){

                aFilter.push(new Filter({
                    filters:[
                        new Filter({ path: 'EMP_NAME', caseSensitive: false, operator: FilterOperator.Contains, value1: sQuery }),
                        new Filter({ path: 'EMP_CODE', caseSensitive: false, operator: FilterOperator.Contains, value1: sQuery }),
                        new Filter({ path: 'EMP_EMAIL', caseSensitive: false, operator: FilterOperator.Contains, value1: sQuery }),
                        new Filter({ path: 'DATE_OF_JOINING', caseSensitive: false, operator: FilterOperator.Contains, value1: sQuery }),
                        new Filter({
                            path: 'REPORTING_MANAGER',
                            test: function(oValue) {
                                // Check if any manager name in the array matches the query
                                if (Array.isArray(oValue)) {
                                    return oValue.some(function(name) {
                                        return name.toLowerCase().includes(sQuery.toLowerCase());
                                    });
                                }
                                return false;
                            }
                        }),
                        // new Filter({ path: 'REPORTING_MANAGER', caseSensitive: false, operator: FilterOperator.Contains, value1: sQuery }),
                        new Filter({ path: 'EMP_ROLE', caseSensitive: false, operator: FilterOperator.Contains, value1: sQuery }),
                        new Filter({ path: 'STATUS', caseSensitive: false, operator: FilterOperator.Contains, value1: sQuery })
                    ],
                    or:true
                }))
            }
            tbl.getBinding('items').filter(aFilter);
        },
        onEdit:function(oEvent){
            var data=oEvent.getSource().getBindingContext("Employees").getObject();
            var sPath = oEvent.getSource().getBindingContext("Employees").getPath()
            this.getOwnerComponent().getModel("FormData").setProperty('/EmployeeData',data)
            this.getOwnerComponent().getModel("FormData").setProperty('/Path',sPath)
            // var p=sap.ui.getCore().byId("editPage")
            var oRouter =  this.getOwnerComponent().getRouter();
		    oRouter.navTo("Edit", {
						EMP_ID : data.EMP_ID
					});
            // this.oRouter.navTo("Edit")
            
        },
        readData:async function(entityset){
            // var oModel=new sap.ui.model.json.JSONModel()
            await this.oDataModel.read("/"+entityset, {
                success: async (data, res) => {
                    debugger
                    // oModel.setData()
                    await this.getOwnerComponent().getModel(entityset).setData(data.results);
                },
                error: (e) => {
                    debugger
                }
            })
        },
        onDelete:function(oEvent){
            debugger
            var id=oEvent.getSource().getBindingContext("Employees").getObject().EMP_ID
            var path="/Employees("+id+")"
            this.oDataModel.remove(path,{
                success:(e)=>{
                    this.readData("Employees")
                },
                error:(e)=>{
                    debugger
                }
            })
        }
        
    })
}
)