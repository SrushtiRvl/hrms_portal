sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "zhrmsportal/utils/formatter"
], (Controller, MessageToast, MessageBox, formatter) => {
    return Controller.extend("zhrmsportal.controller.Edit", {


        onInit: function () {
            // this.oRouter=sap.ui.get
            // this.readData("Modules")
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getRoute("Edit").attachPatternMatched(this.EditEmp, this);
            this.oRouter.getRoute("EditWizard").attachPatternMatched(this.addEmp, this);
            this.oDataModel = this.getOwnerComponent().getModel();

            
            // this.getOwnerComponent().getModel("FormData").setProperty('/EmployeeData',)
            
        },
        onAfterRendering(e){
            debugger
        },
        addDegree:function(choice){
            var status="ok"
            if(choice==="OK"){
                var inps = ["inpGrad", "cgpa", "inpInstitute", "inpDegType"]
                inps.forEach((inp) => {
                    if (this.getView().byId(inp).getValue() === "") {
                        this.getView().byId(inp).setValueState("Error")
                        status = "Error"
                    }
                })
                if (status === "ok") {
                    if (this.formData.CGPA !== "" && this.formData.GRADUATION_DATE !== "" && this.formData.INSTITUTION_NAME !== "" && this.formData.DEGREE_NAME !== "") {
                        var id = this.formData.EMP_ID
                        var degPayload = {
                            INSTITUTION_NAME: this.formData.INSTITUTION_NAME,
                            CGPA: this.formData.CGPA,
                            GRADUATION_DATE: this.formData.GRADUATION_DATE,
                            DEGREE_NAME: this.formData.DEGREE_NAME,
                            EMP_EMP_ID: this.formData.EMP_ID
                        }
                        this.oDataModel.create("/Degree", degPayload, {
                            success: (e) => {
                                debugger
                                this.formData.INSTITUTION_NAME = ""
                                this.formData.CGPA = ""
                                this.formData.GRADUATION_DATE = ""
                                this.formData.DEGREE_NAME = ""
                                this.getOwnerComponent().getModel("FormData").refresh()
                            },
                            error: (e) => {
                                debugger
                            }
                            
                        })
                    }
                }
                
                else {
                    MessageToast.show("All the fileds are mendataory")
                }
            }
            
        },
        addDegreeSection: function (e) {
            this.getOwnerComponent().getModel("Employees").getData()
            var selChoice;
            var that=this
            var formData=this.formData;
            MessageBox.confirm("Do you want to add this degree?", {
                titile: "Add Degree",
                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                onClose: function (e) {
                    selChoice=e
                    formData.selChoice=e
                    
                    that.addDegree(selChoice);
                }
            });
        },
        addEmp: function () {
            this.mode = "add"
            this.formData = this.getOwnerComponent().getModel("FormData").getProperty('/EmployeeData');
            this.formData.mode = "Add"
        },
        readData: async function (entityset) {
            // var oModel=new sap.ui.model.json.JSONModel()
            if(entityset=="Employees"){
                
                await this.oDataModel.read("/" + entityset, {
                    urlParameters:{"$expand":"EMP_DEGREES"},
                    success: async (data, res) => {
                        debugger
                        // oModel.setData(data.results)
                        await this.getOwnerComponent().getModel(entityset).setData(data.results);
                        
                    },
                    error: (e) => {
                        debugger
                    }
                })
            }
            else{
                await this.oDataModel.read("/" + entityset, {
                    success: async (data, res) => {
                        debugger
                        // oModel.setData(data.results)
                        await this.getOwnerComponent().getModel(entityset).setData(data.results);
                        
                    },
                    error: (e) => {
                        debugger
                    }
                })
            }
        },
        onModuleSelect: function (oEvent) {
            var sub = this.getView().byId('modules');
            var oDataModels = this.getOwnerComponent().getModel('Modules');
            var selectedValue = oDataModels.getData().selMT;
            sub.bindAggregation("items", "Modules>/" + selectedValue, new sap.ui.core.ListItem({ text: "{Modules>mName}", key: "{Modules>mKey}" }))
            sub.setVisible()
        },
        EditEmp: function (e) {
            this.mode = "Edit"
            debugger
            this.formData = this.getOwnerComponent().getModel("FormData").getProperty('/EmployeeData');
            
            if (!this.formData) {
                this.oRouter.navTo("Employees")
            }
            this.formData.mode = "Edit"
            this.formData.CGPA = "" 
            this.formData.GRADUATION_DATE = "" 
            this.formData.INSTITUTION_NAME = ""
            this.formData.DEGREE_NAME = ""
            // var sPath = this.getOwnerComponent().getModel("FormData").getProperty('/Path');
            // var oBindingObj = { path: sPath, model: "Employees" }
            // this.byId("form").bindElement(oBindingObj);

            var oFormDataModel = this.getOwnerComponent().getModel("FormData")
            oFormDataModel.getProperty("/EmployeeRole").forEach((obj) => {
                if (obj.empRName === this.formData.EMP_ROLE) {
                    this.formData.selRole = obj.empRKey
                }
            })

            oFormDataModel.getProperty("/EmoloyeeType").forEach((obj, index) => {
                if (obj.empTName === this.formData.EMP_TYPE) {
                    this.formData.selType = index;
                }
            })

            oFormDataModel.getProperty("/Status").forEach((obj) => {
                if (obj.sValue === this.formData.STATUS) {
                    this.formData.selStatus = obj.sKey
                }
            })

            this.formData.selModule = this.formData.EMP_MODULE_MODULE_ID;
            // this.getOwnerComponent().getModel("Modules").getData().forEach((obj)=>{
            //     if(obj.MODULE_===this.formData.EMP_MODULE_MODULE_ID){
            //     }
            // })

            this.formData.selManager = []
            this.formData.REPORTING_MANAGER.forEach((mName) => {
                oFormDataModel.getProperty("/ReportingManager").forEach((obj) => {
                    if (obj.repoMName === mName) {
                        this.formData.selManager.push(obj.repoMKey)
                    }
                })

            })


            // this.getView().setModel(oFormDataModel,"FormData")
            oFormDataModel.refresh()

        },
        onSubmit: function (e) {
            this.formData.EMP_MODULE_MODULE_ID = Number(this.formData.selModule)
            // if (this.formData.selModule) {
            //     this.oDataModel.read("/Modules", {
            //         success: ((data, res) => {
            //             var oData = data.results
            //             oData.forEach(val => {
            //                 if (val.MODULE_ID == this.formData.selModule) {
            //                     this.formData.MODULE = val.MODULE_NAME;
            //                 }
            //             });
            //         }),
            //         error: (e) => {
            //             debugger
            //         }
            //     })
            // }
            if (this.formData.selRole) {
                var oData = this.getOwnerComponent().getModel("FormData").getProperty("/EmployeeRole")
                oData.forEach(val => {
                    if (val.empRKey == this.formData.selRole) {
                        this.formData.EMP_ROLE = val.empRName
                    }
                });
            }
            if (this.formData.selStatus) {
                var oData = this.getOwnerComponent().getModel("FormData").getProperty("/Status")
                oData.forEach(val => {
                    if (val.sKey == this.formData.selStatus) {
                        this.formData.STATUS = val.sValue;
                    }
                });
            }
            this.formData.REPORTING_MANAGER = []
            if (this.formData.selManager) {
                var oData = this.getOwnerComponent().getModel("FormData").getProperty("/ReportingManager")
                this.formData.selManager.forEach(val => {
                    oData.forEach(obj => {
                        if (obj.repoMKey == val) {
                            this.formData.REPORTING_MANAGER.push(obj.repoMName)
                            return
                        }
                    })
                })
            }
            if (this.formData.selType) {
                var oData = this.getOwnerComponent().getModel("FormData").getProperty("/EmoloyeeType/" + this.formData.selType).empTName;
                this.formData.EMP_TYPE = oData;
            }

            // delete this.formData.fn
            // delete this.formData.ln
            // delete this.formData.selModule
            // delete this.formData.selRole
            // delete this.formData.selStatus
            // delete this.formData.selManager
            // delete this.formData.selType

            // delete this.formData.degType
            // delete this.formData.INSTITUTION_NAME
            // delete this.formData.CGPA
            // delete this.formData.GRADUATION_DATE

            // // delete this.formData.
            // // this.oDataModel.create("/Degree",)
            
            // this.formData.GRADUATION_DATE=new Date(this.formData.GRADUATION_DATE)
            // this.formData.EMP_DOB=new Date(this.formData.EMP_DOB)
            // this.formData.DATE_OF_JOINING=new Date(this.formData.DATE_OF_JOINING)

            // this.oDataModel.create("/Degree",degPayload,{
            //     success:()=>{
                //         delete this.formData.INSTITUTION_NAME
            //         delete this.formData.CGPA
            //         delete this.formData.GRADUATION_DATE
            //     },
            //     error:(e)=>{
            //         debugger
            //     }
            // })
            var oPayload = {
                REPORTING_MANAGER: this.formData.REPORTING_MANAGER,
                DATE_OF_JOINING: this.formData.DATE_OF_JOINING,
                DESIGNATION: this.formData.DESIGNATION,
                EMP_CODE: this.formData.EMP_CODE,
                EMP_DOB: this.formData.EMP_DOB,
                EMP_EMAIL: this.formData.EMP_EMAIL,
                EMP_MOBILE: this.formData.EMP_MOBILE,
                EMP_MODULE_MODULE_ID: this.formData.EMP_MODULE_MODULE_ID,
                EMP_NAME: this.formData.EMP_NAME,
                EMP_ROLE: this.formData.EMP_ROLE,
                EMP_SALARY: this.formData.EMP_SALARY,
                EMP_TYPE: this.formData.EMP_TYPE,
                STATUS: this.formData.STATUS
            }
            // && this.formData.CGPA !== "" && this.formData.GRADUATION_DATE !== "" && this.formData.INSTITUTION_NAME !== "" && this.formData.DEGREE_NAME !== ""

            if (this.formData.REPORTING_MANAGER !== "" && this.formData.DATE_OF_JOINING !== "" && this.formData.DESIGNATION !== "" && this.formData.EMP_CODE !== "" && this.formData.EMP_DOB !== "" && this.formData.EMP_EMAIL !== "" && this.formData.EMP_MOBILE !== "" && this.formData.EMP_MODULE_MODULE_ID !== "" && this.formData.EMP_NAME !== "" && this.formData.EMP_ROLE !== "" && this.formData.EMP_SALARY !== "" && this.formData.EMP_TYPE !== "" && this.formData.STATUS !== "" ){

                if (this.formData.mode === "Add") {
                    
                    this.oDataModel.create("/Employees", oPayload, {
                    success: async () => {
                        this.readData("Employees");
                        
                        
                        this.oRouter.navTo("Employees");
                        MessageToast.show("Employee Added Successfully");
                        this.setFormData();
                    },
                    error: (e) => {
                        debugger
                    }
                })
            }
            else {
                var id = this.formData.EMP_ID
                this.addDegree("OK");
                var path = "/Employees(" + id + ")"
                this.oDataModel.update(path, oPayload, {
                    success: () => {
                        this.readData("Employees");
                        this.oRouter.navTo("Employees");
                        MessageToast.show("Employee Updated Successfully")
                        this.setFormData();
                    },
                    error: (e) => {
                        debugger
                    }
                })
            }
        }
        else{
            MessageToast.show("All the fields are mendatory")
        }
            // this.oEmpModel.getProperty("/Employees").push(this.formData)
            // this.oEmpModel.refresh();
            // var formData = this.oEmpModel.getProperty('/formData');
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
                "degType": "",
                "INSTITUTION_NAME": "",
                "CGPA": "",
                "GRADUATION_DATE": ""
            })

        }

    })
})