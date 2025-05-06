sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "zhrmsportal/utils/formatter"
], (Controller, MessageToast, formatter) => {
    "use strict";

    return Controller.extend("zhrmsportal.controller.AddEmployee", {
        formatter: formatter,
        onInit: function () {
            debugger;
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getRoute("AddEmployee").attachPatternMatched(this.checkFormData,this);
            // this.oRouter.getRoute("editPage");

            this.oDataModel = this.getOwnerComponent().getModel()
            // this.getOwnerComponent().getModel("Modules").getData()
            this.readData("Modules")
            // this.readData("Employees")
            // this.oEmpModel = this.getOwnerComponent().getModel('Employees');
            this.setFormData();
        },
        checkFormData:function(e){
            var formdata=this.getOwnerComponent().getModel("FormData").getData();
            if((!formdata)||formdata.fn==""){
                this.wizard = this.getView().byId('idWizard');
                this.wizard.setCurrentStep(this.byId("PersonalDetails"));
            }
        },
        gotoDashboard:function(e){
            this.oRouter.navTo("AdminDashboard");
        },
        gotoEmployees:function(e){
            this.oRouter.navTo("Employees");
        },
        onModuleSuggest: function (e) {
            var inp=this.getView().byId("Module")
            // oView = this.getView();
            var sValue = e.getParameter("suggestValue");
            // if (!this._pPopover) {
			// 	this._pPopover = sap.ui.core.Fragment.load({
			// 		id: oView.getId(),
			// 		name: "zhrmsportal.fragments.popup",
			// 		controller: this
			// 	}).then(function(oPopover){
			// 		oView.addDependent(oPopover);
			// 		return oPopover;
			// 	});
			// }

			// this._pPopover.then(function(oPopover){
			// 	oPopover.openBy(inp);
			// });
            // var oModel = this.get0wnerComponent().getModel(); // OData model
            var aFilter=[]
            var that = this;
            if (!sValue) return;




            if(sValue){
                aFilter.push(new sap.ui.model.Filter("MODULE_NAME", sap.ui.model.FilterOperator.Contains, sValue))
            }
            e.getSource().getBinding("suggestionItems").filter(aFilter);
            
        },
        onOpenValueHelp: function (e) {
            if(!this.fragModuleHelp){
                this.fragModuleHelp=sap.ui.xmlfragment("zhrmsportal.fragments.ModuleValueHelp",this)
                this.getView().addDependent(this.fragModuleHelp)
            }
            this.fragModuleHelp.open()
        },
        onValueHelpModuleSelect:function(e){
            var id = e.getParameter('selectedItem').getBindingContext("Modules").getObject().MODULE_ID
            this.formData.selModule=id;
            this.getOwnerComponent().getModel("FormData").refresh();
        },
        getModelName:function(e){
            
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
                "salary":"",
                "selSalType":"hr",
                "GRADUATION_DATE": "",
                "mode": "Edit"
            })
        },
        readData: async function (entityset) {
            var oModel = new sap.ui.model.json.JSONModel()
            this.oDataModel.read("/" + entityset, {
                success: async (data, res) => {
                    debugger
                    oModel.setProperty("/"+entityset,data.results)
                    
                    this.getView().setModel(oModel, entityset);
                },
                error: (e) => {
                    debugger
                }
            })
        },
        setBtnVisible: function (id, visible) {
            this.getView().byId(id).setVisible(visible);
        },
        onActionBtnPress: function (oEvent) {
            var btn = oEvent.getSource().getText();
            if (btn === "Next") {
                // this.wizard.goToStep("jobDetails")
                this.wizard.nextStep()
            }
            else if (btn === "Previous") {
                this.wizard.previousStep()

            }
            else {

            }
        },
        // onModuleSelect: function (oEvent) {
        //     var sub = this.getView().byId('modules');
        //     var oDataModels = this.getOwnerComponent().getModel('Modules');
        //     var selectedValue = oDataModels.getData().selMT;
        //     sub.bindAggregation("items", "Modules>/" + selectedValue, new sap.ui.core.ListItem({ text: "{Modules>mName}", key: "{Modules>mKey}" }))
        //     sub.setVisible()
        // },

        personalDetails: function (e) {
            // var nav=this.byId("NavContainer");
            // nav.to(this.getView().byId("editPage"));
            // this.setBtnVisible("previous",false);

            if (e.sId === "liveChange") {
                var v = e.getParameter('value');
                e.getSource().setProperty('value', v);
            }
            this.formData = this.getOwnerComponent().getModel('FormData').getProperty('/EmployeeData')
            this.wizard = this.getView().byId('idWizard');
            var pEmail = this.formData.EMP_EMAIL;
            if (pEmail) {
                // var value = pEmail.getValue();
                var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;

                var sid = e.getSource().sId
                if (!mailregex.test(pEmail)) {
                    sap.ui.getCore().byId(sid).setValueState(sap.ui.core.ValueState.Error)
                    sap.ui.getCore().byId(sid).setValueStateText("Invalid Email")
                    // pEmail.setValueState(sap.ui.core.ValueState.Error);
                }
                else {
                    sap.ui.getCore().byId(sid).setValueState(sap.ui.core.ValueState.Success)
                    // pEmail.setValueState(sap.ui.core.ValueState.Success);
                }
            }
            // var EMP_MOBILE = this.getView().byId('EMP_MOBILE');
            // var mData = EMP_MOBILE.getValue();;
            var mData = this.formData.EMP_MOBILE;

            if (mData) {
                var sid = e.getSource().sId
                sap.ui.getCore().byId(sid).setValueState(sap.ui.core.ValueState.Error)
                if (mData.length == 10) {
                    sap.ui.getCore().byId(sid).setValueState(sap.ui.core.ValueState.Success)
                    
                    // EMP_MOBILE.setValueState(sap.ui.core.ValueState.Success);
                }
                else {
                    sap.ui.getCore().byId(sid).setValueState(sap.ui.core.ValueState.Error)
                    sap.ui.getCore().byId(sid).setValueStateText("Invalid Mobile Number")
                    // EMP_MOBILE.setValueState(sap.ui.core.ValueState.Error);
                }

            }


            // if (fnData != '' && lnData != '' && mData != '' && mData.length == 10 && pEmail != '') {
            if (this.formData.fn != '' && this.formData.ln != '' && this.formData.EMP_MOBILE != '' && this.formData.EMP_MOBILE.length == 10 && this.formData.EMP_EMAIL != '' && this.formData.EMP_DOB != '') {
                this.formData.EMP_NAME = this.capitalize(this.formData.fn) + " " + this.capitalize(this.formData.ln);
                this.wizard.validateStep(this.byId('PersonalDetails'))
                // this.setBtnVisible("next",true);
                this.byId('PersonalDetails').setIcon('sap-icon://accept')
                // this.wizard.validateStep(this.byId('jobDetails'))
            }
            else {
                // this.setBtnVisible("next",false);


                this.wizard.invalidateStep(this.byId('PersonalDetails'))
                this.wizard.setCurrentStep(this.byId("PersonalDetails"));
                this.byId('PersonalDetails').setIcon('sap-icon://account')
            }

        },
        capitalize: function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        },
        jobDetails: function (e) {
            // this.getView().getModel("Modules").refresh();
            // this.getView().byId("previous").setVisible()
            if (e.sId === "liveChange") {
                var v = e.getParameter('value');
                e.getSource().setProperty('value', v);
            }
            if (this.formData.selModule != "" && this.formData.selRole != "" && this.formData.selStatus != ""  && this.formData.selManager  && this.formData.DESIGNATION != "" && this.formData.selManager != "" && this.formData.DATE_OF_JOINING != "") {
                this.wizard.validateStep(this.byId('JobDetails'))
                this.getView().byId('JobDetails').setIcon('sap-icon://accept')
            }
            else {
                this.wizard.invalidateStep(this.byId('JobDetails'))
                this.wizard.setCurrentStep(this.byId("JobDetails"));
                this.getView().byId('JobDetails').setIcon('sap-icon://employee')
            }
        },
        educationDetails: function (e) {
            if (e.sId === "liveChange") {
                var v = e.getParameter('value');
                e.getSource().setProperty('value', v);
            }
            if (this.formData.degType != "" && this.formData.INSTITUTION_NAME != "" && this.formData.CGPA != "" && this.formData.GRADUATION_DATE != "") {
                this.wizard.validateStep(this.byId('EducationDetails'))
                this.getView().byId('EducationDetails').setIcon('sap-icon://accept')
            }
            else {
                this.wizard.invalidateStep(this.byId('EducationDetails'))
                this.wizard.setCurrentStep(this.byId("EducationDetails"));
                this.getView().byId('EducationDetails').setIcon('sap-icon://education')
            }
        },
        onComplete: function (e) {
            // var formData = this.oEmpModel.getProperty('/formData');
            // var nav=this.byId("NavContainer");
            // nav.to(this.getView().byId("editPage"));
            this.oRouter.navTo("EditWizard");
        },
        signature: function () {
            // this.getView().byId("addEmployeePage").setShowFooter(true);
            this.getView().byId("submit").setVisible(true)
            this.getView().byId("html").setContent("<canvas id='signature-pad' width='400' height='200' class='signature-pad'></canvas>");
        },
        // onSubmit: function (e) {
        //     if(this.formData.selModule){
        //         this.oDataModel.read("/Modules",{
        //             success:((data,res)=>{
        //                 var oData=data.results
        //                 oData.forEach(val => {
        //                     if(val.MODULE_ID== this.formData.selModule){
        //                         this.formData.MODULE=val.MODULE_NAME;
        //                     }
        //                 });
        //             }),
        //             error:(e)=>{
        //                 debugger
        //             }
        //         })
        //     }
        //     if(this.formData.selRole){
        //         var oData=this.getOwnerComponent().getModel("FormData").getProperty("/EmployeeRole")
        //         oData.forEach(val => {
        //             if(val.empTKey== this.formData.selRole){
        //                 this.formData.EMP_ROLE=val.empTName
        //             }
        //         });
        //     }
        //     if(this.formData.selStatus){
        //         var oData=this.getOwnerComponent().getModel("FormData").getProperty("/Status")
        //         oData.forEach(val => {
        //             if(val.sKey== this.formData.selStatus){
        //                 this.formData.STATUS=val.sValue;
        //             }
        //         });
        //     }
        //     this.formData.REPORTING_MANAGER=[]
        //     if(this.formData.selManager){
        //         var oData=this.getOwnerComponent().getModel("FormData").getProperty("/ReportingManager")
        //         this.formData.selManager.forEach(val=>{
        //             oData.forEach(obj=>{
        //                 if(obj.repoMKey==val){
        //                     this.formData.REPORTING_MANAGER.push(obj.repoMName)
        //                     return
        //                 }
        //             })
        //         })
        //     }
        //     if(this.formData.selType){
        //         var oData=this.getOwnerComponent().getModel("FormData").getProperty("/EmoloyeeType/"+this.formData.selType).empTName;
        //         this.formData.EMP_TYPE=oData;
        //     }
        //     this.formData.EMP_ID=3
        //     delete this.formData.fn
        //     delete this.formData.ln
        //     delete this.formData.selModule
        //     delete this.formData.selRole
        //     delete this.formData.selStatus
        //     delete this.formData.selManager
        //     delete this.formData.selType

        //     delete this.formData.degType
        //     delete this.formData.INSTITUTION_NAME
        //     delete this.formData.CGPA
        //     delete this.formData.GRADUATION_DATE

        //     // // delete this.formData.
        //     // // this.oDataModel.create("/Degree",)

        //     // this.formData.GRADUATION_DATE=new Date(this.formData.GRADUATION_DATE)
        //     // this.formData.EMP_DOB=new Date(this.formData.EMP_DOB)
        //     // this.formData.DATE_OF_JOINING=new Date(this.formData.DATE_OF_JOINING)

        //     // var degPayload={
        //     //     INSTITUTION_NAME:this.formData.INSTITUTION_NAME,
        //     //     CGPA:this.formData.CGPA,
        //     //     GRADUATION_DATE:this.formData.GRADUATION_DATE,
        //     //     URL:""
        //     // }
        //     // this.oDataModel.create("/Degree",degPayload,{
        //     //     success:()=>{
        //     //         delete this.formData.INSTITUTION_NAME
        //     //         delete this.formData.CGPA
        //     //         delete this.formData.GRADUATION_DATE
        //     //     },
        //     //     error:(e)=>{
        //     //         debugger
        //     //     }
        //     // })

        //     this.oDataModel.create("/Employees",this.formData,{
        //         success:()=>{
        //             this.readData("Employees");
        //             this.oRouter.navTo("Employees");
        //             MessageToast.show("Employee Added Successfully")
        //         },
        //         error:(e)=>{
        //             debugger
        //         }
        //     } )
        //     // this.oEmpModel.getProperty("/Employees").push(this.formData)
        //     // this.oEmpModel.refresh();
        //     // var formData = this.oEmpModel.getProperty('/formData');
        // },
        uploadProfilePic: function (e) {
            var sResponse = "File upload complete. Status: 200",
                iHttpStatusCode = parseInt(/\d{3}/.exec(sResponse)[0]),
                sMessage;

            if (sResponse) {
                sMessage = iHttpStatusCode === 200 ? sResponse + " (Upload Success)" : sResponse + " (Upload Error)";
                MessageToast.show(sMessage);
            }
        },
        onSign: function (oEvent) {
            var canvas = document.getElementById("signature-pad");
            var context = canvas.getContext("2d");
            canvas.width = 276;
            canvas.height = 180;
            context.fillStyle = "#fff";
            context.strokeStyle = "#444";
            context.lineWidth = 1.5;
            context.lineCap = "round";
            context.fillRect(0, 0, canvas.width, canvas.height);
            var disableSave = true;
            var pixels = [];
            var cpixels = [];
            var xyLast = {};
            var xyAddLast = {};
            var calculate = false;
            { 	//functions
                function remove_event_listeners() {
                    canvas.removeEventListener('mousemove', on_mousemove, false);
                    canvas.removeEventListener('mouseup', on_mouseup, false);
                    canvas.removeEventListener('touchmove', on_mousemove, false);
                    canvas.removeEventListener('touchend', on_mouseup, false);

                    document.body.removeEventListener('mouseup', on_mouseup, false);
                    document.body.removeEventListener('touchend', on_mouseup, false);
                }

                function get_coords(e) {
                    var x, y;

                    if (e.changedTouches && e.changedTouches[0]) {
                        var offsety = canvas.offsetTop || 0;
                        var offsetx = canvas.offsetLeft || 0;

                        x = e.changedTouches[0].pageX - offsetx;
                        y = e.changedTouches[0].pageY - offsety;
                    } else if (e.layerX || 0 == e.layerX) {
                        x = e.layerX;
                        y = e.layerY;
                    } else if (e.offsetX || 0 == e.offsetX) {
                        x = e.offsetX;
                        y = e.offsetY;
                    }

                    return {
                        x: x, y: y
                    };
                };

                function on_mousedown(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    canvas.addEventListener('mouseup', on_mouseup, false);
                    canvas.addEventListener('mousemove', on_mousemove, false);
                    canvas.addEventListener('touchend', on_mouseup, false);
                    canvas.addEventListener('touchmove', on_mousemove, false);
                    document.body.addEventListener('mouseup', on_mouseup, false);
                    document.body.addEventListener('touchend', on_mouseup, false);

                    empty = false;
                    var xy = get_coords(e);
                    context.beginPath();
                    pixels.push('moveStart');
                    context.moveTo(xy.x, xy.y);
                    pixels.push(xy.x, xy.y);
                    xyLast = xy;
                };

                function on_mousemove(e, finish) {
                    e.preventDefault();
                    e.stopPropagation();

                    var xy = get_coords(e);
                    var xyAdd = {
                        x: (xyLast.x + xy.x) / 2,
                        y: (xyLast.y + xy.y) / 2
                    };

                    if (calculate) {
                        var xLast = (xyAddLast.x + xyLast.x + xyAdd.x) / 3;
                        var yLast = (xyAddLast.y + xyLast.y + xyAdd.y) / 3;
                        pixels.push(xLast, yLast);
                    } else {
                        calculate = true;
                    }

                    context.quadraticCurveTo(xyLast.x, xyLast.y, xyAdd.x, xyAdd.y);
                    pixels.push(xyAdd.x, xyAdd.y);
                    context.stroke();
                    context.beginPath();
                    context.moveTo(xyAdd.x, xyAdd.y);
                    xyAddLast = xyAdd;
                    xyLast = xy;

                };

                function on_mouseup(e) {
                    remove_event_listeners();
                    disableSave = false;
                    context.stroke();
                    pixels.push('e');
                    calculate = false;
                };
            }
            // canvas.addEventListener('touchstart', on_mousedown, false);
            // canvas.addEventListener('mousedown', on_mousedown, false);

        },



        /***********Download the Signature Pad********************/

        // saveButton : function(oEvent){
        //     var canvas = document.getElementById("signature-pad");
        //     var link = document.createElement('a');
        //     link.href = canvas.toDataURL('image/jpeg'); 
        //     link.download = 'sign.jpeg';
        //     link.click(); 
        //     var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
        //           backgroundColor: 'rgb(74, 69, 69)',
        //           penColor: 'rgb(0, 0, 0)'
        //     })
        // },

        /************Clear Signature Pad**************************/

        // clearButton : function(oEvent){
        //     var canvas = document.getElementById("signature-pad");
        //     var context = canvas.getContext("2d");
        //     context.clearRect(0, 0, canvas.width, canvas.height);

        //     var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
        //           backgroundColor: '#ffffff',
        //           penColor: 'rgb(0, 0, 0)',
        //           penWidth : '1'
        //     })
        // },








        saveButton: function (oEvent) {
            var canvas = document.getElementById("signature-pad");
            var link = document.createElement('a');
            link.href = canvas.toDataURL('image/jpeg');
            link.download = 'sign.jpeg';
            link.click();
            var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
                backgroundColor: '#ffffff',
                penColor: 'rgb(0, 0, 0)'
            })
        },

        onSign: function (oEvent) {
            this._initializeSignaturePad();
        },
        _initializeSignaturePad: function () {
            var canvas = document.getElementById("signature-pad");
            var context = canvas.getContext("2d");
            canvas.width = 276;
            canvas.height = 180;

            // Set canvas styles
            context.fillStyle = "#fff";
            context.strokeStyle = "#444";
            context.lineWidth = 1.5;
            context.lineCap = "round";
            context.fillRect(0, 0, canvas.width, canvas.height);

            // Initialize variables
            var pixels = [];
            var xyLast = {};
            var xyAddLast = {};
            var calculate = false;

            // Functions for drawing
            var get_coords = function (e) {
                var x, y;
                if (e.changedTouches && e.changedTouches[0]) {
                    x = e.changedTouches[0].pageX - canvas.offsetLeft;
                    y = e.changedTouches[0].pageY - canvas.offsetTop;
                } else {
                    x = e.offsetX || e.layerX;
                    y = e.offsetY || e.layerY;
                }
                return { x: x, y: y };
            };

            var on_mousedown = function (e) {
                e.preventDefault();
                var xy = get_coords(e);
                context.beginPath();
                context.moveTo(xy.x, xy.y);
                pixels.push('moveStart', xy.x, xy.y);
                xyLast = xy;

                canvas.addEventListener('mousemove', on_mousemove, false);
                canvas.addEventListener('mouseup', on_mouseup, false);
                document.body.addEventListener('mouseup', on_mouseup, false);
            };

            var on_mousemove = function (e) {
                var xy = get_coords(e);
                var xyAdd = { x: (xyLast.x + xy.x) / 2, y: (xyLast.y + xy.y) / 2 };

                if (calculate) {
                    var xLast = (xyAddLast.x + xyLast.x + xyAdd.x) / 3;
                    var yLast = (xyAddLast.y + xyLast.y + xyAdd.y) / 3;
                    pixels.push(xLast, yLast);
                } else {
                    calculate = true;
                }

                context.quadraticCurveTo(xyLast.x, xyLast.y, xyAdd.x, xyAdd.y);
                pixels.push(xyAdd.x, xyAdd.y);
                context.stroke();
                xyAddLast = xyAdd;
                xyLast = xy;
            };

            var on_mouseup = function () {
                canvas.removeEventListener('mousemove', on_mousemove, false);
                document.body.removeEventListener('mouseup', on_mouseup, false);
                context.stroke();
                pixels.push('e');
                calculate = false;
            };

            // Attach event listeners for touch and mouse interaction
            canvas.addEventListener('mousedown', on_mousedown, false);
            canvas.addEventListener('touchstart', on_mousedown, false);
        },

        saveButton: function () {
            var canvas = document.getElementById("signature-pad");
            if (canvas) {
                var link = document.createElement('a');
                link.href = canvas.toDataURL('image/jpeg');
                link.download = 'sign.jpeg';
                link.click();
                MessageToast.show("Signature saved as JPEG.");
            }
        },

        clearButton: function () {
            var canvas = document.getElementById("signature-pad");
            if (canvas) {
                var context = canvas.getContext("2d");
                context.clearRect(0, 0, canvas.width, canvas.height);
                MessageToast.show("Signature pad cleared.");
            }
        }




    })
}
)