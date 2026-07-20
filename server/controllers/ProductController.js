const { generateUniqueImageName } = require('../helper/helper');
const message = require('../message');
const fs = require('fs');
const { productModel } = require('../model/productModel');
const {colorModel} =require("../model/colorModel")
const {brandModel} =require("../model/brandModel")
const { categoryModel } = require('../model/categoryModel');

/* ================= GET ALL PRODUCTS ================= */
const getData = async (req, res) => {
  try {
    const query = req.query;
    const dynamicQuery = {};

    console.log("Queriy",query)

    if (query.id) dynamicQuery._id = query.id;
    if (query.home) dynamicQuery.on_home = query.home === "true";
    if (query.top) dynamicQuery.is_top = query.top === "true";
    if (query.best) dynamicQuery.is_best = query.best === "true";
    if (query.status) dynamicQuery.status = query.status === "true";
    if (query.product_slug) dynamicQuery.slug = query.product_slug;

    /* ===== BRAND FILTER ===== */
    if (query.brand_ids) {
      const brandSlug = query.brand_ids.split("_")
      const brands= await brandModel.find({slug:{$in:brandSlug}}).select("_id name")
      const brandIds= brands.map( b => b._id)
      dynamicQuery.brand_id={
        $in:brandIds
      }
    
    }

    /* ===== COLOR FILTER ===== */
    if (query.color_ids) {
      const colorName = query.color_ids.split("_")
      const colors= await colorModel.find({name:{$in:colorName}}).select("_id");
      const colorIds= colors.map(c => c._id);
      dynamicQuery.color_id={
        $in:colorIds
      }

    }

    /* ===== CATEGORY FILTER ===== */
    if (query.category_slug) {
      const category = await categoryModel.findOne({ slug: query.category_slug });
      if (category) dynamicQuery.category_id = category._id;
    }

    const dynamicSort={}

    if(query.sortby){
      if(query.sortby=="1"){
dynamicSort.createdAt=-1
      }
      else if(query.sortby=="2"){
dynamicSort.createdAt=1
      }
      else if( query.sortby=="3"){
dynamicSort.final_price=1
      }
      else if(query.sortby=="4"
      ){
dynamicSort.final_price=-1
      }
      else if(query.sortby=="5"){
dynamicSort.name=1
      }
      else if(query.sortby=="6"){
dynamicSort.name=-1
      }
    }

    // console.log(dynamicQuery,"dynmic")
    

    const product = await productModel
      .find(dynamicQuery)
      .populate([
        { path: "category_id", select: "name" },
        { path: "brand_id", select: "name" },
        { path: "color_id", select: "name code" }
      ])
      .limit(query.limit? parseInt(query.limit):0)
      .sort(dynamicSort);

    res.send({
      message: "Product found",
      flag: 0,
      img_Url: "http://localhost:5000/img/product/main-image/",
      total_products:product.length,
      product
    });

  } catch (error) {
    console.error(error.message);
    res.send(message.catch_error);
  }
};

/* ================= GET PRODUCT BY ID ================= */
const getDataById = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) return res.send(message.DataNotFound);

    res.send({
      message: "Product found",
      flag: 0,
      img_Url: "http://localhost:5000/img/product/main-image/",
      product
    });
  } catch (error) {
    res.send(message.catch_error);
  }
};

/* ================= CREATE PRODUCT ================= */
const createData = async (req, res) => {
  try {
    if (!req.files?.thumbnail) {
      return res.send({ message: "Thumbnail required", flag: 1 });
    }

    const exist = await productModel.findOne({ slug: req.body.slug });
    if (exist) return res.send({ message: "Already Exist", flag: 1 });

    const thumbnail = req.files.thumbnail;
    const imgName = generateUniqueImageName(thumbnail.name);
    await thumbnail.mv(`./public/img/product/main-image/${imgName}`);

    await productModel.create({
      name: req.body.name,
      slug: req.body.slug,
      thumbnail: imgName,
      original_price: req.body.originalPrice,
      final_price: req.body.finalPrice,
      discount_presentage: req.body.discountPercentage,
      category_id: req.body.category_id,
      brand_id: req.body.brand_id,
      color_id: JSON.parse(req.body.color_ids),
      description: req.body.Description
    });

    res.send(message.create_product);
  } catch (error) {
    console.error(error.message);
    res.send(message.catch_error);
  }
};

/* ================= UPLOAD OTHER IMAGES ================= */
const uploadOtherImages = async (req, res) => {
  try {
    const { product_id } = req.body;
    const images = req.files?.other_images;

    const product = await productModel.findById(product_id);
    if (!product) return res.send({ msg: "Product not found", flag: 1 });
    if (!images) return res.send({ msg: "No images provided", flag: 1 });

    const imageArray = Array.isArray(images) ? images : [images];

    for (const img of imageArray) {
      const imgName = generateUniqueImageName(img.name);
      await img.mv(`./public/img/product/other_image/${imgName}`);
      product.other_images.push(imgName);
    }

    await product.save();

    res.send({
      msg: "Images added successfully",
      flag: 0,
      updated_other_images: product.other_images
    });
  } catch (error) {
    console.error(error.message);
    res.send(message.catch_error);
  }
};

/* ================= UPDATE PRODUCT ================= */
const updateData = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) return res.send(message.DataNotFound);

    const update = {};
    if (req.body.name) update.name = req.body.name;
    if (req.body.slug) update.slug = req.body.slug;

    if (req.files?.thumbnail) {
      const img = req.files.thumbnail;
      const imgName = generateUniqueImageName(img.name);

      await img.mv(`./public/img/product/main-image/${imgName}`);
      update.thumbnail = imgName;

      if (product.thumbnail) {
        fs.unlink(`./public/img/product/main-image/${product.thumbnail}`, () => {});
      }
    }

    await productModel.findByIdAndUpdate(req.params.id, update);
    res.send(message.updateData);
  } catch (error) {
    console.error(error.message);
    res.send(message.catch_error);
  }
};

/* ================= UPDATE STATUS ================= */
const status = async (req, res) => {
  try {
    const { flag } = req.body;
    const product = await productModel.findById(req.params.id);
    if (!product) return res.send(message.DataNotFound);

    const update = {};

    if (flag === "1") update.status = !product.status;
    else if (flag === "2") update.on_home = !product.on_home;
    else if (flag === "3") update.is_top = !product.is_top;
    else if (flag === "4") update.is_best = !product.is_best;
    else if (flag === "5") update.is_hot = !product.is_hot;
    else if (flag === "6") update.is_featured = !product.is_featured;
    else if (flag === "7") update.stock = !product.stock;

    await productModel.findByIdAndUpdate(req.params.id, update);
    res.send({ msg: "Status updated successfully", flag: 0 });

  } catch (error) {
    console.log(error)

    res.send(message.catch_error);
  }
};

/* ================= DELETE PRODUCT ================= */
const deleteData = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    if (!product) return res.send(message.DataNotFound);

    if (product.thumbnail) {
      fs.unlink(`./public/img/product/main-image/${product.thumbnail}`, () => {});
    }

    product.other_images?.forEach(img => {
      fs.unlink(`./public/img/product/other_image/${img}`, () => {});
    });

    res.send(message.Datadelet);
  } catch (error) {
    console.log(error)

    res.send(message.catch_error);
  }
};

module.exports = {
  getData,
  getDataById,
  createData,
  uploadOtherImages,
  updateData,
  deleteData,
  status
};
