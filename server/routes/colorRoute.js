const express = require('express');
const { getData, createData, status, deleteData, getDataById, updateData } = require('../controllers/ColorController');


const ColorRouter = express.Router();

ColorRouter.get(
    "/",
    getData
);


ColorRouter.get(
    "/:id",
    getDataById
);

ColorRouter.post(
    "/create",

    createData
);

ColorRouter.patch(
    "/status/:id",
    status
);

ColorRouter.delete(
    "/delete/:id",
    deleteData
);

ColorRouter.put(
    "/update/:id",


    updateData
);

module.exports = ColorRouter;
