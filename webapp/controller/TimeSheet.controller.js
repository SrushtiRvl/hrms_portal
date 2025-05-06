sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/BusyIndicator',
    "sap/ui/core/util/MockServer",
	"sap/ui/export/library",
	"sap/ui/export/Spreadsheet"
], (Controller, MessageToast, MessageBox, Filter, FilterOperator,BusyIndicator, MockServer, exportLibrary, Spreadsheet) => {
    "use strict";

    const EdmType = exportLibrary.EdmType;
    return Controller.extend("zhrmsportal.controller.TimeSheet", {
        onInit: function () {
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getRoute("Time Sheet");

            this.oFormDataModel = this.getOwnerComponent().getModel('FormData');
            this.oDataModel = this.getOwnerComponent().getModel();
            // var oProjectModel = this.getOwnerComponent().getModel("Project");
            // this.getView().setModel(oProjectModel);
            this.readProjectData();
            this.readModuleData();
            this.readEmpData();
            var oData={
                "Name":"",
                "MODULE_ID":"",
                "date":"",
                "P_ID1":"",
                "Activity_P1":"",
                "Hours_P1":"",
                "P_ID2":"",
                "Activity_P2":"",
                "Hours_P2":"",
                "P_ID3":"",
                "Activity_P3":"",
                "Hours_P3":"",
            }
            this.oFormDataModel.setProperty("/TimeSheet",oData);
            if(!this.frag){
               this.frag=sap.ui.xmlfragment("zhrmsportal.fragments.TimeSheet",this)
               this.getView().addDependent(this.frag);
            }
            this.frag.open();
        },
		empSelect:function(e){
			var oModel= new sap.ui.model.json.JSONModel();
			var eCombo=this.getView().byId("emp")
			var selE=eCombo.getSelectedKey();
			var empModel=this.getOwnerComponent().getModel("Employees").getData();
			empModel.forEach((e)=>{
				if(e.EMP_ID==selE){
					oModel.setProperty("/Task",e.EMP_TASK.results)
					this.getView().byId("modules").setSelectedKey(e.EMP_MODULE_MODULE_ID);
					
					oModel.setProperty("/Project",e.EMP_PRJ.results)
					this.getView().setModel(oModel,"combo")
				}
			})
		},
		readEmpData:function(e){
            this.oDataModel.read("/Employees",{
                urlParameters:{"$expand":"EMP_DEGREES,EMP_TASK,EMP_PRJ,EMP_TIME"},
                success:function(data,res){
                    
                    this.getOwnerComponent().getModel("Employees").setData(data.results);
                    
                    
                }.bind(this),
                error:function(e){
                    debugger
                }
            })
        },
        createColumnConfig: function() {
			const aCols = [];

			aCols.push({
				label: "Full name",
				property: ["Lastname", "Firstname"],
				type: EdmType.String,
				template: "{0}, {1}"
			});

			aCols.push({
				label: "ID",
				type: EdmType.Number,
				property: "UserID",
				scale: 0
			});

			aCols.push({
				property: "Firstname",
				type: EdmType.String
			});

			aCols.push({
				property: "Lastname",
				type: EdmType.String
			});

			aCols.push({
				property: "Birthdate",
				type: EdmType.Date
			});

			aCols.push({
				property: "Salary",
				type: EdmType.Number,
				scale: 2,
				delimiter: true
			});

			aCols.push({
				property: "Currency",
				type: EdmType.String
			});

			aCols.push({
				property: "Active",
				type: EdmType.Boolean,
				trueValue: "YES",
				falseValue: "NO"
			});

			return aCols;
		},createColumnConfig: function() {
			const aCols = [];

			aCols.push({
				label: "Full name",
				property: ["Lastname", "Firstname"],
				type: EdmType.String,
				template: "{0}, {1}"
			});

			aCols.push({
				label: "ID",
				type: EdmType.Number,
				property: "UserID",
				scale: 0
			});

			aCols.push({
				property: "Firstname",
				type: EdmType.String
			});

			aCols.push({
				property: "Lastname",
				type: EdmType.String
			});

			aCols.push({
				property: "Birthdate",
				type: EdmType.Date
			});

			aCols.push({
				property: "Salary",
				type: EdmType.Number,
				scale: 2,
				delimiter: true
			});

			aCols.push({
				property: "Currency",
				type: EdmType.String
			});

			aCols.push({
				property: "Active",
				type: EdmType.Boolean,
				trueValue: "YES",
				falseValue: "NO"
			});

			return aCols;
		},
        readModuleData:function(){
            var oModel = this.getOwnerComponent().getModel("Modules");
            this.oDataModel.read("/Modules", {
                success: (data, res) => {
                    debugger
                    oModel.setProperty("/Modules", data.results)
                    this.getView().setModel(oModel,"Modules");
                },
                error: (e) => {
                    debugger
                }
            })
        },
        createColumnConfig: function() {
			const aCols = [];

			aCols.push({
				label: "Name",
				property: "Name",
				type: EdmType.String,
				
			});

			aCols.push({
				label: "Module",
				type: EdmType.Number,
				property: "MODULE_ID"
			});

			aCols.push({
				label: "Date",
				property: "date",
				type: EdmType.String
			});

			aCols.push({
				label: "Project1",
				property: "P_ID1",
				type: EdmType.String
			});

			aCols.push({
				property: "Activity_P1",
				type: EdmType.Date
			});

			aCols.push({
				property: "Hours_P1",
				type: EdmType.Number,
				scale: 2,
				delimiter: true
			});


			return aCols;
		},
        readProjectData: function () {
            var oModel = this.getOwnerComponent().getModel("Project");
            this.oDataModel.read("/Project", {
                urlParameters:{"$expand":"P_TASK"},
                success: (data, res) => {
                    debugger
                    oModel.setProperty("/Project", data.results)
                    this.getView().setModel(oModel,"Project");
                },
                error: (e) => {
                    debugger
                }
            })
        },
        onSubmit:function(e){
            debugger
            this.getOwnerComponent().getModel("formData").getProperty("/TimeSheet")
        },
        gotoDashboard: function (e) {
            this.oRouter.navTo("AdminDashboard");
        },
    })
}
)