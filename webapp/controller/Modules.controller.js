sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    'sap/ui/core/BusyIndicator'
], (Controller, MessageToast, Filter, FilterOperator, MessageBox,BusyIndicator) => {
    "use strict";

    return Controller.extend("zhrmsportal.controller.Modules", {
        onInit: function () {
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getRoute("Modules");

            this.oFormDataModel = this.getOwnerComponent().getModel('FormData')
            this.oFormDataModel.setProperty("/ModuleData", {
                "MODULE_CODE": "",
                "MODULE_TYPE": "",
                "MODULE_NAME": ""
            })

            this.oDataModel = this.getOwnerComponent().getModel();
            this.readData()
            var oModuleModel = this.getOwnerComponent().getModel("Modules")
            this.getView().setModel(oModuleModel)


            // var oModel = this.getOwnerComponent().getModel("Modules")
            // this.getView().setModel(oModel)


            // var oModel=this.getOwnerComponent().getModel("Modules");
            // this.getView().setModel(oModel,'Modules');
        },
        gotoDashboard: function (e) {
            this.oRouter.navTo("AdminDashboard");
        },
        // onModuleSuggest: function (e) {
        //     var sValue = oEvent.getParameter("suggestValue");
        //     var oModel = this.get0wnerComponent().getModel(); // OData model
        //     var that = this;
        //     if (!sValue) return;
        //     var oFilter = new sap.ui.model.Filter("MODULE_NAME", sap.ui.model.Filteraperator.Contains, sValue);
        //     this.oDataModel.read("/Modules", {
        //         fîlters: [oFilter],
        //         success: function (oData) {
        //             var oJSONModel = new sap.ui.model.json.JSONModel(oData.results);
        //             that.getView().setModel(oJSONModel, "Modules");
        //         },
        //         error: function () {
        //             sap.m.MessageToast.show("Failed to fetch material suggestions");
        //         },
        //     })
        // },
        readData: function (e) {
            this.oDataModel.read("/Modules", {
                success: (data, res) => {
                    debugger
                    this.getView().setModel(this.oDataModel);
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
                BusyIndicator.show(0)
                this.frag = sap.ui.xmlfragment("zhrmsportal.fragments.AddModule", this)
                this.getView().addDependent(this.frag);
            }
            this.frag.open();
            BusyIndicator.hide();
        },
        onSearch: function (oEvent) {
            var tbl = this.getView().byId('mTable');
            var aFilter = [];
            // var sQuery=oEvent.getParameter('query');
            var sQuery = oEvent.getSource().getValue();
            if (sQuery.length >= 3) {


                aFilter.push(new Filter({
                    'filters': [
                        new Filter({ path: 'MODULE_NAME', caseSensitive: false, operator: FilterOperator.Contains, value1: sQuery }),
                        new Filter({ path: 'MODULE_CODE', caseSensitive: false, operator: FilterOperator.Contains, value1: sQuery }),
                        new Filter({ path: 'MODULE_TYPE', caseSensitive: false, operator: FilterOperator.Contains, value1: sQuery })
                    ],
                    or: true
                }))
            }
            else {
                aFilter.push(new Filter({
                    'filters': [
                        new Filter({ path: 'MODULE_NAME', caseSensitive: false, operator: FilterOperator.Contains, value1: "" }),
                        new Filter({ path: 'MODULE_CODE', caseSensitive: false, operator: FilterOperator.Contains, value1: "" }),
                        new Filter({ path: 'MODULE_TYPE', caseSensitive: false, operator: FilterOperator.Contains, value1: "" })
                    ],
                    or: true
                }))
            }
            tbl.getBinding('items').filter(aFilter);
        },
        onPress: function (oEvent) {
            var tile = oEvent.getSource().getProperty('header');
            this.oRouter.navTo(tile);
        },
        onDelete: function (oEvent) {
            var that = this
            MessageBox.confirm("Do you want to delete this module?", {
                title: "Delete Module",
                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                onClose: function (e) {

                    if (e === "OK") {
                        BusyIndicator.show(0);
                        var sPath = oEvent.getSource().getBindingContext().sPath;
                        that.oDataModel.remove(sPath, {
                            success: (e) => {
                                that.readData()
                                BusyIndicator.hide();
                            },
                            error: (e) => {
                                debugger
                            }
                        })
                    }
                    else{
                        return;
                    }
                }
            });

        },
        onAddModule: function (e) {
            var oData = this.oFormDataModel.getProperty("/ModuleData");
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
                oData.MODULE_TYPE = sap.ui.getCore().byId("TYPE").getValue()
                delete oData.selValue
                this.oDataModel.create("/Modules", oData, {
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
            this.frag.close()
            this.frag.destroy()
            this.frag = null
        }
    })
}
)