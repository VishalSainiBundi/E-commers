const { generateUniqueImageName } = require('../helper/helper');
const message = require('../message')
const fs = require('fs')
const { brandModel } = require('../model/brandModel')
const {productModel} =require("../model/productModel")

const getData = async (req, res) => {
    try {
        const filterQuery = {};
    const query = req.query;

    if (query.home) {
      filterQuery.on_home = query.home == "true";
    }

    if (query.top) {
      filterQuery.is_top = query.top == "true";
    }

    if (query.best) {
      filterQuery.is_best = query.best == "true";
    }
    if (query.status) {
      filterQuery.status = query.status == "true";
    }
    if (query.slug) {
      filterQuery.slug = query.slug;
    }

    const brands = await brandModel.find(filterQuery).limit(query.limit ? Number(query.limit) : 0);

    const finalBrands = [];
    for (const brand of brands) {
      const productCount = await productModel.find({
        brand_id: brand._id,
        status: true,
      }).countDocuments();
      finalBrands.push({
        ...brand.toJSON(),
        productCount,
      });
    }
        const brand = await brandModel.find();
            // console.log()

        res.send({
            message: "brand find",
            flag: 0,
            brand:finalBrands,
            img_Url: "http://localhost:5000/img/brand/"
        })
    } catch (error) {
        console.log(error.message)
        res.send(message.catch_error)
    }
}

const getDataById = async (req, res) => {
    try {
        const id = req.params.id;
        // console.log(id)
        brand = await brandModel.findById({ _id: id });



        res.send({
            message: "brand find",
            flag: 0,
            brand:finalBrand,
            img_Url: "http://localhost:5000/img/brand/"
        })
    } catch (error) {
        res.send(message.catch_error)
    }
}

const createData = async (req, res) => {
    try {
        const file = req.files.Image;
    
        

        const brandExist = await brandModel.findOne({ name: req.body.name });
        if (brandExist) {
            return res.send({
                message: "already Exist",
                flag: 1
            })
        }

        const unique_Img_Name = generateUniqueImageName(file.name)
        const destination = "./public/img/brand/" + unique_Img_Name;

    

        file.mv(
            destination,
            async (error) => {
                if (error) {
                    return res.send(message.ImageUploadFailed)
                } else {
                    const brand = await brandModel.create({
                        name: req.body.name,
                        slug: req.body.slug,
                        img: unique_Img_Name,
                    })
                    // console.log(brand)
                    res.send(message.create_brand)
                }
            }
        )

    } catch (error) {
        console.log(error.message)
        res.send(message.catch_error)
    }
}

const status = async (req, res) => {
    try {
        const flag = req.body.flag;
        const objKey = {};
        const id = req.params.id;

        const brandExist = await brandModel.findById(id);
        if (!brandExist) {
            return res.send(message.DataNotFound)
        }

        if (flag == "1") {
            objKey.status = !brandExist.status
        }
        else if (flag == "2") {
            objKey.on_home = !brandExist.on_home
        }
        else if (flag == "3") {
            objKey.is_top = !brandExist.is_top
        }
        else if (flag == "4") {
            objKey.is_best = !brandExist.is_best
        }
    else if (flag === "5") objKey.is_featured =!brandExist.is_featured;


        await brandModel.findByIdAndUpdate(
            { _id: id },
            objKey,
        );

        res.send({
            msg: "Status updated successfully",
            flag: 0
        });
        // console.log(id)

    } catch {
    console.log(error)

        res.send(message.catch_error)
    }
}

const deleteData = async (req, res) => {
    try {
        const id = req.params.id;
        const brandExist = await brandModel.findById(id)

        if (!brandExist) return res.send(message.DataNotFound)

        const brand = await brandModel.findByIdAndDelete({ _id: id })
        fs.unlinkSync("./public/img/brand/" + brand.img)

        res.send(message.Datadelet)
    }

    catch (error) {
    console.log(error)

        res.send(message.catch_error)
    }

}

const updateData = async (req, res) => {
  try {
    const id = req.params.id;
    const brand_image = req.files?.Image || null;
    const { name, slug } = req.body;

    const brand = await brandModel.findById(id);
    if (!brand) return res.send(message.DataNotFound);

    const update = {};
    if (name) update.name = name;
    if (slug) update.slug = slug;

    // If image is provided
    if (brand_image) {
      const unique_Img_Name = generateUniqueImageName(brand_image.name);
      const destination = "./public/img/brand/" + unique_Img_Name;

      brand_image.mv(destination, async (error) => {
        if (error) {
          return res.send(message.ImageUploadFailed);
        } else {
          update.img = unique_Img_Name;

          await brandModel.findByIdAndUpdate(id, { $set: update });

          // Old Image Delete
          if (brand.img) {
            try {
              fs.unlinkSync("./public/img/brand/" + brand.img);
            } catch (err) {
              console.log("Old image delete error:", err.message);
            }
          }

          return res.send(message.updateData);
        }
      });
    }

    // If image is NOT provided — normal update
    if (!brand_image) {
      await brandModel.findByIdAndUpdate(id, { $set: update });
      return res.send(message.updateData);
    }
  } catch (error) {
    console.log(error.message);
    return res.send(message.catch_error);
  }
};


module.exports = { getData, createData, status, deleteData, getDataById, updateData }
