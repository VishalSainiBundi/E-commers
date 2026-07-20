const express = require('express');
const { getData, createData, status, deleteData, getDataById, updateData } = require('../controllers/BrandController');
const FileUploader = require('express-fileupload');

const BrandRouter = express.Router();

BrandRouter.get(
    "/",
    getData
);


BrandRouter.get(
    "/:id",
    getDataById
);

BrandRouter.post(
    "/create",
    FileUploader({ createParentPath: true }),
    createData
);

BrandRouter.patch(
    "/status/:id",
    status
);

BrandRouter.delete(
    "/delete/:id",
    deleteData
);

BrandRouter.put(
    "/update/:id",
    FileUploader({ createParentPath: true }),

    updateData
);

module.exports = BrandRouter;
