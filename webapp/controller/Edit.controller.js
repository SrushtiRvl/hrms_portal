sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "zhrmsportal/utils/formatter"
], (Controller, MessageToast, formatter) => {
    return Controller.extend("zhrmsportal.controller.Edit", {


    onInit:function(){
        // this.oRouter=sap.ui.get
        this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        this.oRouter.getRouterFor("Edit")
        this.oDataModel=this.getOwnerComponent().getModel();
        this.formData=this.getOwnerComponent().getModel("FormData").getProperty('/EmployeeData');
    },
    onSubmit: function (e) {
        if(this.formData.selModule){
            this.oDataModel.read("/Modules",{
                success:((data,res)=>{
                    var oData=data.results
                    oData.forEach(val => {
                        if(val.MODULE_ID== this.formData.selModule){
                            this.formData.MODULE=val.MODULE_NAME;
                        }
                    });
                }),
                error:(e)=>{
                    debugger
                }
            })
        }
        if(this.formData.selRole){
            var oData=this.getOwnerComponent().getModel("FormData").getProperty("/EmployeeRole")
            oData.forEach(val => {
                if(val.empTKey== this.formData.selRole){
                    this.formData.EMP_ROLE=val.empTName
                }
            });
        }
        if(this.formData.selStatus){
            var oData=this.getOwnerComponent().getModel("FormData").getProperty("/Status")
            oData.forEach(val => {
                if(val.sKey== this.formData.selStatus){
                    this.formData.STATUS=val.sValue;
                }
            });
        }
        this.formData.REPORTING_MANAGER=[]
        if(this.formData.selManager){
            var oData=this.getOwnerComponent().getModel("FormData").getProperty("/ReportingManager")
            this.formData.selManager.forEach(val=>{
                oData.forEach(obj=>{
                    if(obj.repoMKey==val){
                        this.formData.REPORTING_MANAGER.push(obj.repoMName)
                        return
                    }
                })
            })
        }
        if(this.formData.selType){
            var oData=this.getOwnerComponent().getModel("FormData").getProperty("/EmoloyeeType/"+this.formData.selType).empTName;
            this.formData.EMP_TYPE=oData;
        }
        this.formData.EMP_ID=3
        delete this.formData.fn
        delete this.formData.ln
        delete this.formData.selModule
        delete this.formData.selRole
        delete this.formData.selStatus
        delete this.formData.selManager
        delete this.formData.selType
        
        delete this.formData.degType
        delete this.formData.INSTITUTION_NAME
        delete this.formData.CGPA
        delete this.formData.GRADUATION_DATE
        
        // // delete this.formData.
        // // this.oDataModel.create("/Degree",)
        
        // this.formData.GRADUATION_DATE=new Date(this.formData.GRADUATION_DATE)
        // this.formData.EMP_DOB=new Date(this.formData.EMP_DOB)
        // this.formData.DATE_OF_JOINING=new Date(this.formData.DATE_OF_JOINING)
        
        // var degPayload={
        //     INSTITUTION_NAME:this.formData.INSTITUTION_NAME,
        //     CGPA:this.formData.CGPA,
        //     GRADUATION_DATE:this.formData.GRADUATION_DATE,
        //     URL:""
        // }
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

        this.oDataModel.create("/Employees",this.formData,{
            success:()=>{
                this.readData("Employees");
                this.oRouter.navTo("Employees");
                MessageToast.show("Employee Added Successfully")
            },
            error:(e)=>{
                debugger
            }
        } )
        // this.oEmpModel.getProperty("/Employees").push(this.formData)
        // this.oEmpModel.refresh();
        // var formData = this.oEmpModel.getProperty('/formData');
    }
})
})