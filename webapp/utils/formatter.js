sap.ui.define([],
    function(){
        return {
            captialize:function(word){
                if(word){
                    return word.toUpperCase();
                }
            },
            totalMembers:function(members){
                if(members){
                    return members.length
                }
            },
            number:function(val){
                if(val){
                    return Number(val);
                }
            },
            date:function(date){
                if(date){
                    date=date.split("/")
                    if(date[0].length==2){
                        date.reverse()
                        date.join("/")
                    }
                    return new Date(date);
                }
            },
            getModuleName:function(id){
                debugger
                if(id){
                    var oData=this.getOwnerComponent().getModel("Modules").getData();
                    var len=oData.Modules.length;
                    if(len>0){
                        var module = oData.Modules.find((e) => e.MODULE_ID === id);
                        return module ? module.MODULE_NAME : "";
                    }
                }
            }
        };
    }
);