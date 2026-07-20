const { updateData } = require("./controllers/CategoryController");

const message={
    catch_error:{
        msg:"something went wrong",
        flag:1
    },
    creat:{
        msg:"Data create sucessfully",
        flag:0

    },
    un:{
        msg:"unbale to server",
        flag:1
    },
    create_category:{
msg:"create data successfully",
flag:0
    },
    ImageUploadFailed:{
        msg:"File Upload Failed try again ",
        flag:1
    },
    DataNotFound:{
        msg:"Data is not found",
        flag:1
    },
    DataAdd:{
        msg:"Data is already Created",
        flag:1
    },
    Datadelet:{
        msg:"Data deleted successfully",
        flag:0
    },
    updateData:{
        msg:"Resourse update successfully",
        flag:0
    }
}
module.exports=message;