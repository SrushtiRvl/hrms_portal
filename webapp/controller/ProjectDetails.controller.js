sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/BusyIndicator',
    "zhrmsportal/utils/formatter"
], (Controller, MessageToast, MessageBox, Filter, FilterOperator, BusyIndicator, formatter) => {
    "use strict";

    return Controller.extend("zhrmsportal.controller.ProjectDetails", {
        formatter: formatter,
        onInit: function () {
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getRoute("ProjectDetails").attachPatternMatched(this.bindDetails, this);

            var oTaskData = {
                "PROGRESS": "",
                "STATUS": "",
                "T_END_DATE": "",
                "T_NAME": "",
                "T_START_DATE": ""
            }
            this.oFormDataModel = this.getOwnerComponent().getModel('FormData');
            this.oFormDataModel.setProperty("/TaskData", oTaskData);

            this.oDataModel = this.getOwnerComponent().getModel();
            var oData = [
                {
                    "pName": "pen",
                    "price": 5
                },
                {
                    "pName": "pencil",
                    "price": 2
                },
                {
                    "pName": "rubber",
                    "price": 10
                },
                {
                    "pName": "a",
                    "price": 5
                },
                {
                    "pName": "b",
                    "price": 2
                },
                {
                    "pName": "c",
                    "price": 10
                },
                {
                    "pName": "d",
                    "price": 5
                },
                {
                    "pName": "e",
                    "price": 2
                },
                {
                    "pName": "f",
                    "price": 10
                },
            ]
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setProperty("/data", oData);
            // var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            // oVizFrame.setModel(oModel)
            this.readEmpData()
        },
        EditProject: function (e) {
            if(!this.projfrag){
                this.projfrag=sap.ui.xmlfragment("zhrmsportal.fragments.AddProject",this)
                this.getView().addDependent(this.projfrag)
            }
            this.projfrag.open();
        }, 
        dataselect: function (e) {
            debugger
            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            oVizFrame.vizSelection()
        },
        onAfterRendering: function (e) {
            var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            oVizFrame.attachSelectData(this.dataselect.bind(this))
        },
        setChartData(data){
            debugger
            var oModel=this.getView().getModel()
            oModel.setProperty("/chart",[]);
            var pData=this.getView().getModel().getData()
            var pId=pData.P_ID
            var members=pData.P_EMP
            members.forEach((e)=>{
                var id=Number(e)
                data.forEach((emp)=>{
                    if(emp.EMP_ID===id){
                        emp.EMP_TIME.resutls.forEach((time)=>{
                            if(time.TASK_P_ID===pId){
                                var hw=Number(time.HOURS_WORKED)
                                var oPayload={
                                    name:emp.EMP_NAME,
                                    time:hw,
                                    date:time.ENTRY_DATE
                                }
                                oModel.getProperty("/chart").push(oPayload);

                            }
                        })
                    }
                })
            })
        },
        readEmpData: function () {
            var oEmpModel = this.getOwnerComponent().getModel("Employees");

            this.oDataModel.read("/Employees" , {
                urlParameters:{"$expand":"EMP_DEGREES,EMP_TASK,EMP_PRJ,EMP_TIME"},
                success: (data, res) => {
                    debugger
                    oEmpModel.setData(data.results)
                    this.setChartData(data.results)
                    // this.getView().setModel(oModel);
                    // this.addTiles(data.results);
                },
                error: (e) => {
                    debugger
                }
            })
        },
        addTask: function (e) {
            if (!this.frag) {
                var oModel = this.getView().getModel();
                this.frag = sap.ui.xmlfragment("zhrmsportal.fragments.AddTask", this).setModel(oModel)
                this.getView().addDependent(this.frag);
            }
            this.frag.open();
        },
        onAddSave: function (e) {
            debugger
            var id=this.getView().getModel().getData().P_ID;
            var data=this.oFormDataModel.getProperty("/TaskData");
            var oPayload={
                EMP_EMP_ID:data.EMP_EMP_ID,
                PRIORITY:data.PRIORITY,
                PROGRESS:data.PROGRESS,
                STATUS:data.STATUS,
                TASK_P_ID:id,
                T_END_DATE:data.T_END_DATE,
                T_NAME:data.T_NAME,
                T_START_DATE:data.T_START_DATE
            }
            this.oDataModel.create("/Tasks",oPayload,{
                success:(e)=>{
                    MessageToast.show("Task has been added successfuly!");
                    this.onAddCancel();
                }
            })
        },
        onAddCancel: function (e) {
            this.frag.close();
            this.frag.destroy();
            this.frag = null;
        },
        gotoDashboard: function (e) {
            this.oRouter.navTo("AdminDashboard");
        },
        gotoProjects: function (e) {
            this.oRouter.navTo("Projects");
        },
        bindDetails: function (e) {
            debugger
            BusyIndicator.hide();
            this.path = Number(e.getParameter('arguments').P_ID)
            this.oData = this.getOwnerComponent().getModel('Project').getProperty("/Project")[this.path]
            if (!this.oData) {
                this.gotoProjects();
            }
            var oModel = new sap.ui.model.json.JSONModel(this.oData)
            this.getView().setModel(oModel)
        }
    })
}
)