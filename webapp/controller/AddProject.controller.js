sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, MessageToast, Filter, FilterOperator) => {
    return Controller.extend("zhrmsportal.controller.AddProject", {
        onInit: function () {
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getRoute("AddProject");

            this.oFormDataModel = this.getOwnerComponent().getModel('FormData');
            this.oDataModel= this.getOwnerComponent().getModel();
            // var oProjectModel = this.getOwnerComponent().getModel("Project");
            // this.getView().setModel(oProjectModel);

            // this.readData();

        },
        gotoDashboard:function(e){
            this.oRouter.navTo("AdminDashboard");
        },
})
}
)