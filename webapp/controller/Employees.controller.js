sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/BusyIndicator',
    "zhrmsportal/utils/formatter",
], (Controller,MessageToast,Filter,FilterOperator,BusyIndicator,formatter) => {
    "use strict";

    return Controller.extend("zhrmsportal.controller.Employees", {
        formatter: formatter,
        onInit:function(){
            this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);
            this.oDataModel=this.getOwnerComponent().getModel();
            this.readData("Modules");
            this.readEmpData();
            this.setFormData()
            // var modelEmp=this.getOwnerComponent().getModel("Employees");
            // this.getView().setModel(modelEmp,'Employees');
        },
        readEmpData:function(e){
            this.oDataModel.read("/Employees",{
                urlParameters:{"$expand":"EMP_DEGREES,EMP_TASK,EMP_PRJ,EMP_TIME"},
                success:function(data,res){
                    // oModel.setData(data.results)
                    var aManager=[];
                    data.results.forEach((e)=>{
                        if(e.DESIGNATION=="Lead" || e.DESIGNATION.includes("Manager") ){
                            aManager.push({"mValue":e.EMP_NAME})
                        }
                    })
                    this.getOwnerComponent().getModel("FormData").setProperty("/Manager",aManager)
                    this.getOwnerComponent().getModel("Employees").setData(data.results);
                    this.getOwnerComponent().getModel("Employees").setDefaultBindingMode('OneWay');
                    // data.results.forEach((e)=>{
                    //     if(e.)
                    // })
                    this.oRouter.getRoute("Employees");
                    this.getView().byId("empTable").setBusy(false)
                    
                }.bind(this),
                error:function(e){
                    debugger
                }
            })
        },
        onIncompleteProfile:function(e){
            debugger
            // var oData=e.getSource().getBindingContext("Employees").getObject();

            // // using spread operator for deep cloning object
            // var data= JSON.parse(JSON.stringify(...oData))
            // this.getOwnerComponent().getModel("FormData").setProperty('/EmployeeData',data)
           // Step 1: Deep clone the employee object
var path = e.getSource().getBindingContext("Employees").getPath();
var empData = this.getOwnerComponent().getModel("Employees").getProperty(path);
var clonedData = JSON.parse(JSON.stringify(...empData));

// Step 2: Create a NEW JSONModel with the cloned data
var newFormDataModel = new sap.ui.model.json.JSONModel({
    EmployeeData: clonedData
});

// Step 3: Set this model to your component (or view)
this.getOwnerComponent().setModel(newFormDataModel, "FormData");
console.log(
    this.getOwnerComponent().getModel("FormData").getProperty("/EmployeeData") ===
    this.getOwnerComponent().getModel("Employees").getProperty(path)
  ); 


            this.oRouter.navTo("IncompleteProfile", {
                EMP_ID : data.EMP_ID
            });
            BusyIndicator.show(0);
        },
        gotoDashboard:function(e){
            this.oRouter.navTo("AdminDashboard");
        },
        onEmpSelect:function(e){
            debugger
            var path=e.getParameter("listItem").getBindingContext("Employees").sPath.split("/")[1]
            this.oRouter.navTo("EmployeeDetails", {
						path:path
					});
            this.byId("empTable").removeSelections()
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
                "mode":"Edit"
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
                            path: 'MANAGER',
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
        readData:function(entityset){
            // var oModel=new sap.ui.model.json.JSONModel()
            this.oDataModel.read("/"+entityset, {
                success: async (data, res) => {
                    debugger
                    // oModel.setData()
                    this.getOwnerComponent().getModel(entityset).setProperty("/"+entityset,data.results);
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
                    this.readEmpData();
                },
                error:(e)=>{
                    debugger
                }
            })
        }
        
    })
}
)