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
        onEmpRoleSelect: function (oEvent) {
            var sub = this.getView().byId('subRoleType');
            var selectedValue = oEvent.getSource().getSelectedItem().getBindingContext('Employees').getObject().empRName;
            if (selectedValue === 'Employee') {
                sub.setVisible(true)
                this.wizard.setNextStep(this.byId('personalDetails'))
                sub.setRequired(true)
            }
            else {
                sub.setVisible(false)
                sub.setRequired(false)

            }
        },
        setModelData:function(data,property){
            var formData = this.oEmpModel.getProperty('/formData');
            formData.property=data;
        },

        personalDetails: function (e) {
            var v=e.getParameter('value');
            e.getSource().setProperty('value',v);
            if(e.sId === "liveChange"){
                var data=e.getParameter('value');
                // var property=e.get
            }
            var formData = this.oEmpModel.getProperty('/formData');
            this.wizard = this.getView().byId('idWizard');
            var pEmail = this.getView().byId('pEmail')
            if (pEmail.getValue()) {
                var value = pEmail.getValue();
                var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;

                if (!mailregex.test(value)) {
                    pEmail.setValueState(sap.ui.core.ValueState.Error);
                }
                else {
                    pEmail.setValueState(sap.ui.core.ValueState.Success);
                }
            }
            var mobile = this.getView().byId('mobile');
            var mData = mobile.getValue();
            if (mData) {
                if (mData.length == 10) {
                    mobile.setValueState(sap.ui.core.ValueState.Success);
                }
                else {
                    mobile.setValueState(sap.ui.core.ValueState.Error);
                }

            }

            var fn = this.getView().byId('fName');
            var fnData = fn.getValue();

            var ln = this.getView().byId('lName');
            var lnData = ln.getValue();
            
            
            // if (formData.fn != '' && formData.ln != '' && formData.mobile != '' && formData.mobile.length == 10 && formData.personalEmail != '') {
            if (fnData != '' && lnData != '' && mData != '' && mData.length == 10 && pEmail != '') {
                this.wizard.validateStep(this.byId('PersonalDetails'))
                this.getView().byId('next').setVisible();
                this.byId('PersonalDetails').setIcon('sap-icon://accept')
            }
            else {
                this.wizard.invalidateStep(this.byId('PersonalDetails'))
                this.wizard.setCurrentStep(this.byId("PersonalDetails"));
                this.getView().byId('next').setVisible(false);
                this.byId('PersonalDetails').setIcon('sap-icon://account')
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
        }
    })
}
)