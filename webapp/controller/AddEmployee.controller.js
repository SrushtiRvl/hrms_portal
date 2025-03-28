sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {
    "use strict";

    this._timeout = null;
    return Controller.extend("zhrmsportal.controller.AddEmployee", {
        onInit: function () {
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getRoute("AddEmployee");

            this.oModelModule = this.getOwnerComponent().getModel()
            this.oModelModule.read("/Modules", {
                success: (data, res) => {
                    debugger
                    this.getView().setModel(this.oModelModule);
                },
                error: (e) => {
                    debugger
                }
            })
            this.oEmpModel = this.getOwnerComponent().getModel('Employees');
            this.getView().setModel(this.oEmpModel, "Employees")
            this.oEmpModel.setProperty('/formData', {
                "ln": "",
                "fn": "",
                "personalEmail": "",
                "mobile": "",
                "dob": new Date()
            })
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
        onModuleSelect: function (oEvent) {
            var sub = this.getView().byId('modules');
            var oModelModules=this.getOwnerComponent().getModel('Modules');
            // var selectedValue = oEvent.getSource().getSelectedItem().getBindingContext('Modules').getObject().mName;
            var selectedValue=oModelModules.getData().selMT;
            sub.bindAggregation("items","Modules>/"+selectedValue, new sap.ui.core.ListItem({text:"{Modules>mName}",key:"{Modules>mKey}"}))
            sub.setVisible()
        },
        setModelData:function(data,property){
            var formData = this.oEmpModel.getProperty('/formData');
            formData.property=data;
        },

        personalDetails: function (e) {
            if(e.sId === "liveChange"){
                var v=e.getParameter('value');
                e.getSource().setProperty('value',v);
            }
            var formData = this.oEmpModel.getProperty('/formData');
            this.wizard = this.getView().byId('idWizard');
            var pEmail= formData.personalEmail;
            if (pEmail) {
                // var value = pEmail.getValue();
                var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
                
                var sid=e.getSource().sId
                if (!mailregex.test(pEmail)) {
                    sap.ui.getCore().byId(sid).setValueState(sap.ui.core.ValueState.Error)
                    // pEmail.setValueState(sap.ui.core.ValueState.Error);
                }
                else {
                    sap.ui.getCore().byId(sid).setValueState(sap.ui.core.ValueState.Success)
                    // pEmail.setValueState(sap.ui.core.ValueState.Success);
                }
            }
            var mobile = this.getView().byId('mobile');
            // var mData = mobile.getValue();;
            var mData = formData.mobile;

            if (mData) {
                var sid=e.getSource().sId
                sap.ui.getCore().byId(sid).setValueState(sap.ui.core.ValueState.Error)
                if (mData.length == 10) {
                    sap.ui.getCore().byId(sid).setValueState(sap.ui.core.ValueState.Success)
                    // mobile.setValueState(sap.ui.core.ValueState.Success);
                }
                else {
                    sap.ui.getCore().byId(sid).setValueState(sap.ui.core.ValueState.Error)
                    // mobile.setValueState(sap.ui.core.ValueState.Error);
                }

            }
            
            
            if (formData.fn != '' && formData.ln != '' && formData.mobile != '' && formData.mobile.length == 10 && formData.personalEmail != '') {
            // if (fnData != '' && lnData != '' && mData != '' && mData.length == 10 && pEmail != '') {
                this.wizard.validateStep(this.byId('PersonalDetails'))
                this.getView().byId('next').setVisible();
                this.byId('PersonalDetails').setIcon('sap-icon://accept')
            }
            else {
                // this.wizard.invalidateStep(this.byId('PersonalDetails'))
                // this.wizard.setCurrentStep(this.byId("PersonalDetails"));
                // this.getView().byId('next').setVisible(false);
                // this.byId('PersonalDetails').setIcon('sap-icon://account')
            }

        },
        jobDetails: function () {
            // this.wizard.goToStep(this.getView().byId('personalDetails'))
            // this.oEmpModel.attachPropertyChange(()=>{
            //     debugger;
            //     this.wizard = this.getView().byId('idWizard');
                // var formData = this.oEmpModel.getProperty('/formData');
                // if (formData.fn != '' && formData.ln != '' && formData.mobile != '' && formData.mobile.length == 10 && formData.personalEmail != '') {
                //     this.wizard.validateStep(this.byId('PersonalDetails'))
                //     this.getView().byId('next').setVisible();
                //     this.byId('PersonalDetails').setIcon('sap-icon://accept')
                // }
                // else {
                //     this.wizard.invalidateStep(this.byId('PersonalDetails'))
                //     this.wizard.setCurrentStep(this.byId("PersonalDetails"));
                //     this.getView().byId('next').setVisible(false);
                //     this.byId('PersonalDetails').setIcon('sap-icon://account')
                // }
            // })
        },
        projectDetails:function(){

            this.getView().byId("html").setContent("<canvas id='signature-pad' width='400' height='200' class='signature-pad'></canvas>");
        },
        onSign : function(oEvent){
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
                        x : x, y : y
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
                        x : (xyLast.x + xy.x) / 2,
                        y : (xyLast.y + xy.y) / 2
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








        saveButton : function(oEvent){
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