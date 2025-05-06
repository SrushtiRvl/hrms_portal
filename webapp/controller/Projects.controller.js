sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/BusyIndicator',
    "zhrmsportal/utils/formatter",
], (Controller, MessageToast, MessageBox, Filter, FilterOperator,BusyIndicator,formatter) => {
    "use strict";

    return Controller.extend("zhrmsportal.controller.Projects", {
        formatter: formatter,
        onInit: function () {
            this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.oRouter.getRoute("Projects");

            this.oFormDataModel = this.getOwnerComponent().getModel('FormData');
            this.oDataModel = this.getOwnerComponent().getModel();

            var oProjData={
                "selMembers":[],
                "selManager":"",
                "EMP_EMP_ID": "",
                "P_CODE": "",
                "P_END_DATE": "",
                "P_NAME": "",
                "P_START_DATE": "",
                "REPORTING_MANAGER": "",
                "STATUS": "",
            }
            this.oFormDataModel.setProperty("/ProjectData",oProjData);
            // var oProjectModel = this.getOwnerComponent().getModel("Project");
            // this.getView().setModel(oProjectModel);

            this.readData();
            this.readEmpData();

        },
        readEmpData:function(){
            this.oDataModel.read("/Employees",{
                success:(e)=>{
                    this.getOwnerComponent().getModel("Employees").setData(e.results)
                },
                error:(e)=>{
                    debugger
                }
            })
        },
        addTask:function(e){
            if(!this.taskFrag){
                var oModel=this.getOwnerComponent().getModel("Project");
                this.taskFrag=sap.ui.xmlfragment("zhrmsportal.fragments.AddTask",this).setModel(oModel)
                this.getView().addDependent(this.taskFrag);
            }
            this.taskFrag.open();
        },
        gotoDashboard: function (e) {
            this.oRouter.navTo("AdminDashboard");
        },
        cancelDeleteProject: function (e) {
            this.getView().getModel().setProperty("/Delete", false)

        },
        deleteProject: function (e) {
            // this.oRouter.navTo("AddProject")
            this.getView().getModel().setProperty("/Delete", true)
            // debugger
        },
        onProjectPress: function (e) {
            debugger
            var id = e.getSource().getBindingContext().sPath.split("/")[2]
            var oTile = e.getSource(),
                sTileName = oTile.getHeader() || oTile.getTooltip();

            if (e.getParameter("action") === "Remove") {
                var that = this
                MessageBox.confirm("Do you want to delete this project?",
                    {
                        title: "Delete project",
                        actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                        onClose: (choice)=>{
                            debugger
                            if (choice == "OK") {
                                debugger
                                BusyIndicator.show(0);
                                var id=Number(e.getSource().getBindingContext().sPath.split("/")[2])
                                var path="/Project("+id+")";
                                this.oDataModel.remove(path,{
                                    success:(e)=>{
                                        this.readData();
                                        MessageToast.show("Project has been deleted successfuly!");
                                        BusyIndicator.hide()
                                    },
                                    error:(e)=>{
                                        debugger
                                        MessageToast.show("Something went wrong!");
                                        BusyIndicator.hide()
                                    }
                                })
                            }

                            // that.addDegree(selChoice);
                        }
                    }
                )
            } else {
                BusyIndicator.show(0)
                var id = e.getSource().getBindingContext().sPath.split("/")[2]
                this.oRouter.navTo("ProjectDetails", {
                    P_ID : id
                });
                MessageToast.show("The GenericTile \"" + sTileName + "\" has been pressed.");
            }
        },
        createNewProjectTile:function(){
            var box = this.getView().byId("projectsBox")
            var oVbox1 = new sap.m.VBox();
            var g = new sap.m.GenericTile();
            var link = new sap.m.Link().setText("New");
            var tc = new sap.m.TileContent()


            var btn = new sap.m.Button();
            btn.setText("Create New Project");
            btn.setType("Emphasized")
            btn.attachPress(this.addProject, this)
            // img.addStyleClass("add");
            tc.setContent(btn)
            g.addStyleClass("sapUiMediumMarginTop");
            g.addStyleClass("tileLayout");
            g.addStyleClass("newProject");
            g.addTileContent(tc);
            g.setFrameType("TwoByOne");

            oVbox1.addStyleClass("sapUiMediumMarginBegin");
            oVbox1.addStyleClass("flexbox");
            oVbox1.addItem(g);
            oVbox1.addItem(link);
            return oVbox1
            // box.addItem(oVbox1);

        },
        createTiles: function () {
            var oTileList = new sap.m.HBox(); // or any container
            // var newPTile=this.createNewProjectTile();
            // oTileList.addItem(newPTile);
            oTileList.bindAggregation("items", {
                path: "/projects", // your data path
                factory: function () {
                    var oData=this.getView().getModel().getProperty("/Project")
                    var status = oData.STATUS;

                    var oTile = new sap.m.GenericTile({
                        header: "{P_NAME}",
                        subheader: "{REPORTING_MANAGER}",
                        scope: oData.Delete ? "ActionRemove" : "Display",
                        press: function () {
                            // Your press handler here
                        },
                        frameType: "TwoByOne",
                        tileContent: [
                            new sap.m.TileContent({
                                content: new sap.m.ObjectStatus({
                                    text: "{STATUS}"
                                })
                            })
                        ]
                    });

                    // Add dynamic class based on STATUS
                    oTile.addStyleClass("tiles"); // base class for ::after
                    if (status === "Complete") {
                        oTile.addStyleClass("completeTile");
                    } else {
                        oTile.addStyleClass("newTile");
                    }
                    oTileList.addItem(oTile);
                    // return oTile;
                }
            });
            this.getView().byId("projectsBox").addItem(oTileList)

        },
        addTiles: function (data) {
            debugger
            var box = this.getView().byId("projectsBox")
            var oVbox1 = new sap.m.VBox();
            var g = new sap.m.GenericTile();
            var link = new sap.m.Link().setText("New");
            var tc = new sap.m.TileContent()


            var btn = new sap.m.Button();
            btn.setText("Create New Project");
            btn.setType("Emphasized")
            btn.attachPress(this.addProject, this)
            // img.addStyleClass("add");
            tc.setContent(btn)
            g.addStyleClass("sapUiMediumMarginTop");
            g.addStyleClass("tileLayout");
            g.addStyleClass("newProject");
            g.addTileContent(tc);
            g.setFrameType("TwoByOne");

            oVbox1.addStyleClass("sapUiMediumMarginBegin");
            oVbox1.addStyleClass("flexbox");
            oVbox1.addItem(g);
            oVbox1.addItem(link);
            box.addItem(oVbox1);

            data.forEach((p) => {
                var pName = p.P_NAME;
                var oVbox1 = new sap.m.VBox();
                var label = new sap.m.Label({ text: p.P_ID, visible: false })
                var tcl = new sap.m.TileContent({ content: label })
                var g = new sap.m.GenericTile({
                    scope: "{= ${/Delete}? 'ActionRemove' : 'Display'}",
                    header: p.P_NAME,
                    subheader: p.REPORTING_MANAGER,
                    frameType: "TwoByOne",
                    press: this.onProjectPress
                });
                var link = new sap.m.Link().setText(pName);
                var tc = new sap.m.TileContent()
                var objS = new sap.m.ObjectStatus()
                objS.setText(p.STATUS)
                objS.setIcon("sap-icon://sys-enter-2")
                objS.setState("Success")


                var img = new sap.m.ImageContent({ src: "sap-icon://dimension" });
                // img.setSrc("sap-icon://dimension")
                tc.setContent(objS)

                // tc.setContent(img);
                // g.addStyleClass("sapUiTinyMarginBegin");
                // g.setHeader(p.P_NAME);
                // g.setSubheader(p.REPORTING_MANAGER);
                g.addStyleClass("sapUiMediumMarginTop");
                g.addStyleClass("tileLayout");
                g.addStyleClass("tiles");
                g.addTileContent(tc);
                g.addTileContent(tcl);
                // g.setFrameType("TwoByOne");
                oVbox1.addStyleClass("sapUiMediumMarginBegin");
                oVbox1.addStyleClass("flexbox");
                oVbox1.addItem(g);
                oVbox1.addItem(link);
                box.addItem(oVbox1);
            })

        },
        readData: function () {
            var oModel = this.getOwnerComponent().getModel("Project");
            this.oDataModel.read("/Project", {
                urlParameters:{"$expand":"P_TASK"},
                success: (data, res) => {
                    debugger
                    oModel.setProperty("/Project", data.results)
                    oModel.setProperty("/Delete", false)
                    this.getView().setModel(oModel);
                    this.createTiles();
                    // this.addTiles(data.results);
                },
                error: (e) => {
                    debugger
                }
            })
        },
        onAdd: function (e) {
            debugger
            if(!this.frag){
                this.frag=sap.ui.xmlfragment("zhrmsportal.fragments.AddProject",this)
                this.getView().addDependent(this.frag)
            }
            this.frag.open();
        },
        onAddProject:function(e){
            var oData=this.oFormDataModel.getProperty("/ProjectData");

            var oPayload={
                P_CODE:oData.P_CODE,
                P_END_DATE:oData.P_END_DATE,
                P_NAME:oData.P_NAME,
                P_START_DATE:oData.P_START_DATE,
                REPORTING_MANAGER:oData.selManager,
                STATUS:oData.STATUS,
                P_EMP:oData.selMembers,
                EMP_EMP_ID:2
            }
            this.oDataModel.create("/Project",oPayload,{
                success:(e)=>{
                    MessageToast.show("Project has been addded successfully");
                    this.onCancelProject();
                    this.readData();
                    debugger
                },
                error:(e)=>{
                    debugger
                }
            })
            debugger

        },
        onCancelProject:function(e){
            debugger;
            this.frag.close();
            this.frag.destroy();
            this.frag=null;
        }
    })
}
)