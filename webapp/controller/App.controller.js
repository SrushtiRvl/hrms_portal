sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller,MessageToast) => {
    "use strict";

    return Controller.extend("zhrmsportal.controller.App", {
        onInit: function() {
				
            if(!this.loginFrag){
                this.loginFrag=sap.ui.xmlfragment("zhrmsportal.fragments.login",this);
                this.getView().addDependent(this.loginFrag);
            }
            this.loginFrag.open();
            var oModel=this.getOwnerComponent().getModel("loginDetails");
            oModel.setProperty('/formData',{
                "uName":"",
                "password":""
            });
            this.getView().setModel(oModel);
            oModel.refresh();
        },
        onLogin:function(oEvent){
            var oModel=this.getOwnerComponent().getModel("loginDetails");
            var oData=oModel.getProperty('/formData');
            if(oData.uName==="Admin" && oData.password==="admin"){
                MessageToast.show("You have successfuly logged in")
                oModel.setProperty("/login","Success");
                
                
                
                var oRouter=sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("AdminDashboard");
                
                
                this.closeDialog();
            }
            else{
                MessageToast.show("Wrong user name or password");
            }
        },
        closeDialog:function(){
            this.loginFrag.close();
            this.loginFrag.destroy();
            this.loginFrag=null;
        },
        showPassword:function(oEvent){
            // var oModel=this.getOwnerComponent().getModel("loginDetails");
            // oModel.refresh()
            // var oData=oModel.getProperty('/formData');
            // var pass=oData.password
            var inp=sap.ui.getCore().byId('inpPassword');

            if(inp.getType()==="Password"){
                // inp.setValue(pass)
                inp.setType("Text")
                inp.setValueHelpIconSrc("sap-icon://show")
            }
            else{
                inp.setType("Password")
                inp.setValueHelpIconSrc("sap-icon://hide")
            }
        }
    });
});