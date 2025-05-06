sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "zhrmsportal/utils/formatter",
    'sap/ui/core/BusyIndicator'
], (Controller, MessageToast, MessageBox, formatter, BusyIndicator) => {
    return Controller.extend("zhrmsportal.controller.Edit", {
        formatter: formatter,
        onInit: function () {
            // this.oRouter=sap.ui.get
            // this.readData("Modules")
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getRoute("Edit").attachPatternMatched(this.EditEmp, this);
            this.oRouter.getRoute("EditWizard").attachPatternMatched(this.addEmp, this);
            this.oRouter.getRoute("IncompleteProfile").attachPatternMatched(this.IncompleteProfile, this);
            this.oDataModel = this.getOwnerComponent().getModel();

            var m=this.getOwnerComponent().getModel("Modules")
            this.getView().setModel(m,"Modules")

            // this.getOwnerComponent().getModel("FormData").setProperty('/EmployeeData',)

        },

        handleFileChange: function (e) {
            debugger
            this.file = e.getParameter("files")[0];
            var empId = this.formData.EMP_ID;
            var fileName = empId + ". " + this.formData.EMP_NAME;
            // var fileType=this.file.type;

            var reader = new FileReader();
            reader.onload = (e) => {
                var content = e.target.result.split(",")[1];
                var string = e.target.result
                this.formData.EMP_IMG_FILE_NAME = fileName,
                this.formData.EMP_IMG = content,
                this.formData.EMP_IMG_STR = string

            };
            reader.readAsDataURL(this.file)
        },
        gotoDashboard:function(e){
            this.oRouter.navTo("AdminDashboard");
        },  
        gotoEmployees:function(e){
            
            this.oRouter.navTo("Employees");
            this.setFormData();
        },
        gotoWizard:function(e){
            this.oRouter.navTo("AddEmployee");
        },
        dateFormat:function(e){
            debugger
            var type;
            if(typeof e=="object"){
                if(e.mParameters.value || e.mParameters.value==""){
                    var val=e.getParameter("value")
                    if(val.length==0){
                        e.getSource().setValueState("Error");
                        return false
                    }
                }
                else{
                    var s=e.getSource().getProperty('dateValue').toISOString().split("T")[0]
                    var val=s.split("-").reverse().join("-")
                }
            }
            else{
                type="str"
                var val=e
            }
            var regex_date = /^\d{1,2}\-\d{1,2}\-\d{4}$/;

            if(!regex_date.test(val))
            {
                if(type != "str"){
                    e.getSource().setValueState("Error");
                }
                else{
                    return false
                }
            }
            else{
                var parts   = val.split("-");
                var day     = parseInt(parts[0], 10);
                var month   = parseInt(parts[1], 10);
                var year    = parseInt(parts[2], 10);
            
                // Check the ranges of month and year
               
            
                var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
            
                // Adjust for leap years
                if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
                {
                    monthLength[1] = 29;
                }
                if(day > 0 && day <= monthLength[month - 1] && year > 1000 && year < 3000 && month != 0 && month <= 12){
                    if(type != "str"){
                        e.getSource().setValueState("Success");
                    }
                    else{
                        return true
                    }
                }
                else{
                    if(type != "str"){
                        e.getSource().setValueState("Error");
                    }
                    else{
                        return false
                    }
                }

            }
        
            // Parse the date parts to integers
            
        },
        beforeUploadStarts: function (e) {
            debugger
        },
        handleUploadPress: function (e) {




            // var oFileUploader = this.byId("fileUploader");
            // if (!oFileUploader.getValue()) {
            // 	MessageToast.show("Choose a file first");
            // 	return;
            // }
            // oFileUploader.checkFileReadable().then(function() {
            // 	oFileUploader.upload();
            // }, function(error) {
            // 	MessageToast.show("The file cannot be read. It may have changed.");
            // }).then(function() {
            // 	oFileUploader.clear();
            // });
        },
        uploadProfilePic: function (e) {
            var sResponse = "File upload complete. Status: 200",
                iHttpStatusCode = parseInt(/\d{3}/.exec(sResponse)[0]),
                sMessage;

            if (sResponse) {
                sMessage = iHttpStatusCode === 200 ? sResponse + " (Upload Success)" : sResponse + " (Upload Error)";
                MessageToast.show(sMessage);
            }
        },
        checkDegreeData:function(){
            var status="ok"
            var inps = ["inpGrad", "cgpa", "inpInstitute", "inpDegType"]
            inps.forEach((inp) => {
                if (this.getView().byId(inp).getValue() === "") {
                    this.getView().byId(inp).setValueState("Error")
                    return "Error"
                }
                else{
                    this.getView().byId(inp).setValueState("Success")
                    // status="ok"
                }
            })
            return "ok"

        },
        addDegree: function (choice) {
            var status = "ok"
            if (choice === "OK") {
                status=this.checkDegreeData();
                BusyIndicator.show(0);
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
                                BusyIndicator.hide();
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
            var that = this
            var formData = this.formData;
            MessageBox.confirm("Do you want to add this degree?", {
                title: "Add Degree",
                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                onClose: function (e) {
                    selChoice = e
                    formData.selChoice = e
                    
                    that.addDegree(selChoice);
                    
                }
            });
        },
        addEmp: function () {
            this.mode = "add"
            this.formData = this.getOwnerComponent().getModel("FormData").getProperty('/EmployeeData');
            if(this.formData){
                this.formData.mode = "Add"
            }
            BusyIndicator.hide();
        },
        readData: async function (entityset) {
            // var oModel=new sap.ui.model.json.JSONModel()
            if (entityset == "Employees") {

                this.oDataModel.read("/" + entityset, {
                    urlParameters: { "$expand": "EMP_DEGREES" },
                    success: async (data, res) => {
                        debugger
                        // oModel.setData(data.results)
                        this.getOwnerComponent().getModel(entityset).setData(data.results);

                    },
                    error: (e) => {
                        debugger
                    }
                })
            }
            else {
                this.oDataModel.read("/" + entityset, {
                    success: async (data, res) => {
                        debugger
                        // oModel.setData(data.results)
                        this.getOwnerComponent().getModel(entityset).setData(data.results);

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
        IncompleteProfile:function(e){
            debugger

            // this.EditEmp()
            this.getView().byId("educationContainer").focus()
            BusyIndicator.hide();
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
            this.formData.MANAGER.forEach((mName) => {
                oFormDataModel.getProperty("/ReportingManager").forEach((obj) => {
                    if (obj.repoMName === mName) {
                        this.formData.selManager.push(obj.repoMKey)
                    }
                })

            })


            // this.getView().setModel(oFormDataModel,"FormData")
            oFormDataModel.refresh()
            BusyIndicator.hide();
        },
        onSubmit: function (e) {
            BusyIndicator.show(0);
            if(this.dateFormat(this.formData.EMP_DOB) && this.dateFormat(this.formData.DATE_OF_JOINING)){
                
            }
            else{
                MessageBox.show("Please Enter Valid Date (DD-MM-YYYY)")
                BusyIndicator.hide()
                return false
            }
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
            this.formData.MANAGER = []
            if (this.formData.selManager) {
                var oData = this.getOwnerComponent().getModel("FormData").getProperty("/ReportingManager")
                this.formData.selManager.forEach(val => {
                    oData.forEach(obj => {
                        if (obj.repoMKey == val) {
                            this.formData.MANAGER.push(obj.repoMName)
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
                MANAGER: this.formData.MANAGER,
                DATE_OF_JOINING: this.formData.DATE_OF_JOINING,
                DESIGNATION: this.formData.DESIGNATION,
                EMP_DOB: this.formData.EMP_DOB,
                EMP_EMAIL: this.formData.EMP_EMAIL,
                EMP_MOBILE: this.formData.EMP_MOBILE,
                EMP_MODULE_MODULE_ID: this.formData.EMP_MODULE_MODULE_ID,
                EMP_NAME: this.formData.EMP_NAME,
                EMP_ROLE: this.formData.EMP_ROLE,
                EMP_TYPE: this.formData.EMP_TYPE,
                STATUS: this.formData.STATUS
            }
            // var oPayload = {
            //     MANAGER: this.formData.MANAGER,
            //     DATE_OF_JOINING: this.formData.DATE_OF_JOINING,
            //     DESIGNATION: this.formData.DESIGNATION,
            //     EMP_DOB: this.formData.EMP_DOB,
            //     EMP_EMAIL: this.formData.EMP_EMAIL,
            //     EMP_MOBILE: this.formData.EMP_MOBILE,
            //     EMP_MODULE_MODULE_ID: this.formData.EMP_MODULE_MODULE_ID,
            //     EMP_NAME: this.formData.EMP_NAME,
            //     EMP_ROLE: this.formData.EMP_ROLE,
            //     EMP_TYPE: this.formData.EMP_TYPE,
            //     STATUS: this.formData.STATUS,
            //     EMP_IMG_FILE_NAME: this.formData.EMP_IMG_FILE_NAME,
            //     EMP_IMG: this.formData.EMP_IMG,
            //     EMP_IMG_STR: this.formData.EMP_IMG_STR,
            // }

            // var oPayload = {
            //     REPORTING_MANAGER: this.formData.REPORTING_MANAGER,
            //     DATE_OF_JOINING: this.formData.DATE_OF_JOINING,
            //     DESIGNATION: this.formData.DESIGNATION,
            //     EMP_CODE: this.formData.EMP_CODE,
            //     EMP_DOB: this.formData.EMP_DOB,
            //     EMP_EMAIL: this.formData.EMP_EMAIL,
            //     EMP_MOBILE: this.formData.EMP_MOBILE,
            //     EMP_MODULE_MODULE_ID: this.formData.EMP_MODULE_MODULE_ID,
            //     EMP_NAME: this.formData.EMP_NAME,
            //     EMP_ROLE: this.formData.EMP_ROLE,
            //     EMP_SALARY: this.formData.EMP_SALARY,
            //     EMP_TYPE: this.formData.EMP_TYPE,
            //     STATUS: this.formData.STATUS
            // };
            // var id = Number(this.formData.EMP_ID);


            // var path1 = "/Employees(" + id + ")"
            // var path = "https://97b43115trial-dev-zproduct-srv.cfapps.us10-001.hana.ondemand.com/v2/odata" + path1


            // $.ajax({
            //     contentType: "application/json",
            //     type: "PATCH",
            //     data: JSON.stringify(oPayload),
            //     url: path,
            //     success: (d)=>{
            //         debugger;
            //     },
            //     error: (e)=>{
            //         debugger;
            //     }

            // });


            // && this.formData.CGPA !== "" && this.formData.GRADUATION_DATE !== "" && this.formData.INSTITUTION_NAME !== "" && this.formData.DEGREE_NAME !== ""

            // if (this.formData.MANAGER !== "" && this.formData.DATE_OF_JOINING !== "" && this.formData.DESIGNATION !== "" && this.formData.EMP_CODE !== "" && this.dateFormat(this.formData.EMP_DOB)  && this.formData.EMP_EMAIL !== "" && this.formData.EMP_MOBILE !== "" && this.formData.EMP_MODULE_MODULE_ID !== "" && this.formData.EMP_NAME !== "" && this.formData.EMP_ROLE !== "" && this.formData.EMP_SALARY !== "" && this.formData.EMP_TYPE !== "" && this.formData.STATUS !== "") {
            if (this.formData.MANAGER !== "" && this.formData.DATE_OF_JOINING !== "" && this.formData.DESIGNATION !== ""  && this.dateFormat(this.formData.EMP_DOB)  && this.formData.EMP_EMAIL !== "" && this.formData.EMP_MOBILE !== "" && this.formData.EMP_MODULE_MODULE_ID !== "" && this.formData.EMP_NAME !== "" && this.formData.EMP_ROLE !== ""  && this.formData.EMP_TYPE !== "" && this.formData.STATUS !== "") {

                if (this.formData.mode === "Add") {

                    this.oDataModel.create("/Employees", oPayload, {
                        success: async () => {
                            this.readData("Employees");

                            BusyIndicator.hide();
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
                    // var id = this.formData.EMP_ID
                    var id = Number(this.formData.EMP_ID);
                    this.addDegree("OK");


                    var path = "/Employees(" + id + ")"
                    this.oDataModel.update(path, oPayload, {
                        success: () => {
                            this.readData("Employees");
                            this.oRouter.navTo("Employees");
                            MessageToast.show("Employee Updated Successfully")
                            this.setFormData();
                            BusyIndicator.hide();
                        },
                        error: (e) => {
                            debugger
                        }
                    })
                }
            }
            else {
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
                "GRADUATION_DATE": "",
                "mode":"Edit"
            })

        }

    })
})