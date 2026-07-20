const express = require('express');
const { getData, createData, status, deleteData, getDataById, updateData } = require('../controllers/CategoryController');
const FileUploader = require('express-fileupload');

const CategoryRouter = express.Router();

CategoryRouter.get(
    "/",
    getData
);


CategoryRouter.get(
    "/:id",
    getDataById
);

CategoryRouter.post(
    "/create",
    FileUploader({ createParentPath: true }),
    createData
);

CategoryRouter.patch(
    "/status/:id",
    status
);

CategoryRouter.delete(
    "/delete/:id",
    deleteData
);

CategoryRouter.put(
    "/update/:id",
    FileUploader({ createParentPath: true }),

    updateData
);

module.exports = CategoryRouter;
