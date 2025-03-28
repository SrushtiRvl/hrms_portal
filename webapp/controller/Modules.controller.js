sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, MessageToast, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("zhrmsportal.controller.Modules", {
        onInit: function () {
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getRoute("Modules");

            this.oFormDataModel = this.getOwnerComponent().getModel('FormData')
            this.oModelModule = this.getOwnerComponent().getModel()

            this.readData()


            // var oModel=this.getOwnerComponent().getModel("Modules");
            // this.getView().setModel(oModel,'Modules');
        },
        readData: function (e) {
            this.oModelModule.read("/Modules", {
                success: (data, res) => {
                    debugger
                    this.getView().setModel(this.oModelModule);
                    var mt = new Set();
                    data.results.forEach(module => {
                        mt.add(module.MODULE_TYPE)
                    });

                    var ModuleTypes = []
                    mt.forEach((val) => {
                        var obj = {}
                        obj.mKey = val.substring(0, 3)
                        obj.mValue = val
                        ModuleTypes.push(obj)
                    })
                    this.oFormDataModel.setProperty("/ModuleData", {
                        "MODULE_CODE": "",
                        "MODULE_TYPE": "",
                        "MODULE_NAME": ""
                    })
                    this.oFormDataModel.setProperty("/ModuleTypes", ModuleTypes)
                },
                error: (e) => {
                    debugger
                }
            })
        },
        onAdd: function (e) {
            if (!this.frag) {
                this.frag = sap.ui.xmlfragment("zhrmsportal.fragments.AddModule", this)
                this.getView().addDependent(this.frag);
            }
            this.frag.open();
        },
        onSearch: function (oEvent) {
            var tbl = this.getView().byId('mTable');
            var aFilter = [];
            // var sQuery=oEvent.getParameter('query');
            var sQuery = oEvent.getSource().getValue();
            aFilter.push(new Filter({
                'filters': [
                    new Filter({ path: 'MODULE_NAME', caseSensitive: false, operator: FilterOperator.Contains, value1: sQuery }),
                    new Filter({ path: 'MODULE_CODE', caseSensitive: false, operator: FilterOperator.Contains, value1: sQuery }),
                    new Filter({ path: 'MODULE_TYPE', caseSensitive: false, operator: FilterOperator.Contains, value1: sQuery })
                ],
                or: true
            }))
            tbl.getBinding('items').filter(aFilter);
        },
        onPress: function (oEvent) {
            var tile = oEvent.getSource().getProperty('header');
            this.oRouter.navTo(tile);
        },
        onDelete:function(e){
            var sPath=e.getSource().getBindingContext().sPath;
            this.oModelModule.remove(sPath,{
                success:(e)=>{
                    this.readData()
                },
                error:(e)=>{
                    debugger
                }
            })
        },
        onAddModule: function (e) {
            var oData=this.oFormDataModel.getProperty("/ModuleData");
            var fields = ['CODE', 'NAME', 'TYPE']
            var status = "OK"
            fields.forEach((val, index) => {
                var field = sap.ui.getCore().byId(val);
                var value = field.getValue();
                field.setValueState(sap.ui.core.ValueState.Error)
                if (value !== "") {
                    field.setValueState(sap.ui.core.ValueState.Success)
                    fields[index] = "OK"
                }
            })
            fields.forEach(val => {
                if (val !== "OK") {
                    status = "ERROR"
                }
            })
            if (status === "OK") {
                oData.MODULE_TYPE=sap.ui.getCore().byId("TYPE").getValue()
                delete oData.selValue
                this.oModelModule.create("/Modules", oData, {
                    success: (e) => {
                        this.readData();
                        this.frag.close()
                        this.frag.destroy()
                        this.frag = null
                    }
                })
            }
            // var oData=this.oFormDataModel.getProperty("/ModuleData");
            // var selV=oData.selValue
            // var oComboboxData=this.oFormDataModel.getProperty("/ModuleTypes");
            // oComboboxData.forEach((val)=>{
            //     if(val.mKey===selV){
            //         oData.MODULE_TYPE=val.mValue;
            //         delete oData.selValue
            //     }
            // })

        },
        onAddCancelModule: function (e) {
            this.readData();
            this.frag.close()
            this.frag.destroy()
            this.frag = null
        }
    })
}
)