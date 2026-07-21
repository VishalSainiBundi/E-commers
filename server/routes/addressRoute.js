const express = require("express");
const {
  addAddress,
  listAddresses,
  editAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/AddressController");

const AddressRouter = express.Router();

AddressRouter.get("/list",                listAddresses);
AddressRouter.post("/add",                addAddress);
AddressRouter.put("/edit/:index",         editAddress);
AddressRouter.delete("/delete/:index",    deleteAddress);
AddressRouter.put("/set-default/:index",  setDefaultAddress);

module.exports = AddressRouter;
