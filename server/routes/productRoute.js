const express = require('express');
const { getData, createData, status, deleteData, getDataById, updateData, uploadOtherImages } = require('../controllers/ProductController');
const FileUploader = require('express-fileupload');

const ProdutRouter = express.Router();

ProdutRouter.get(
    "/",
    getData
);


ProdutRouter.get(
    "/:id",
    getDataById
);

ProdutRouter.post(
    "/add_other_images",
    FileUploader({createParentPath:true}),
    uploadOtherImages
)
ProdutRouter.post(
    "/create",
    FileUploader({ createParentPath: true }),
    createData
);

ProdutRouter.patch(
    "/status/:id",
    status
);

ProdutRouter.delete(
    "/delete/:id",
    deleteData
);

ProdutRouter.put(
    "/update/:id",
    FileUploader({ createParentPath: true }),

    updateData
);

module.exports = ProdutRouter;
