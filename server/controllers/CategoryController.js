const { generateUniqueImageName } = require('../helper/helper');
const message = require('../message')
const fs = require('fs')
const { categoryModel } = require('../model/categoryModel')
const {productModel} = require("../model/productModel")

const getData = async (req, res) => {
    try {

        const query= req.query
const dynamicquery= {}
if(query.home){
    dynamicquery.on_home= query.home =="true"? true :false
}if(query.best){
    dynamicquery.is_best= query.best =="true"? true :false
}if(query.top){
    dynamicquery.is_top= query.top =="true"? true :false
}if(query.status){
    dynamicquery.status= query.status =="true"? true :false
}if(query.id){
    dynamicquery._id= query.id

}if(query.slug){
    dynamicquery.slug= query.slug
}if(query.home){
    dynamicquery.slug= query.slug =="true"? true :false
}
console.log(dynamicquery)
        const category = await categoryModel.find(dynamicquery).limit(
            query.limit!=null ? query.limit:0
        )

        const finalCategory = [];
    for (const cat of category ) {
      const CatCount = await productModel.find({
        category_id: cat._id,
        status: true,
      }).countDocuments();
      finalCategory.push({
        ...cat.toJSON(),
        CatCount,
      });
    }
            // console.log(category)

        res.send({
            message: "Category find",
            flag: 0,
            category:finalCategory,
            img_Url: "http://localhost:5000/img/category/"
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
        category = await categoryModel.findById({ _id: id });

        res.send({
            message: "Category find",
            flag: 0,
            category,
            img_Url: "http://localhost:5000/img/category/"
        })
    } catch (error) {
        res.send(message.catch_error)
    }
}

const createData = async (req, res) => {
    try {
        const file = req.files.Image;
    
        

        const categoryExist = await categoryModel.findOne({ name: req.body.name });
        if (categoryExist) {
            return res.send({
                message: "already Exist",
                flag: 1
            })
        }

        const unique_Img_Name = generateUniqueImageName(file.name)
        const destination = "./public/img/category/" + unique_Img_Name;

    

        file.mv(
            destination,
            async (error) => {
                if (error) {
                    return res.send(message.ImageUploadFailed)
                } else {
                    const category = await categoryModel.create({
                        name: req.body.name,
                        slug: req.body.slug,
                        img: unique_Img_Name,
                    })
                    // console.log(category)
                    res.send(message.create_category)
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

        const categoryExist = await categoryModel.findById(id);
        if (!categoryExist) {
            return res.send(message.DataNotFound)
        }

        if (flag == "1") {
            objKey.status = !categoryExist.status
        }
        if (flag == "3") {
            objKey.is_top = !categoryExist.is_top
        }
        else if (flag == "2") {
            objKey.on_home = !categoryExist.on_home
        }
         
        else if (flag == "4") {
            objKey.is_best = !categoryExist.is_best
        }

        await categoryModel.findByIdAndUpdate(
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
        const categoryExist = await categoryModel.findById(id)

        if (!categoryExist) return res.send(message.DataNotFound)

        const category = await categoryModel.findByIdAndDelete({ _id: id })
        fs.unlinkSync("./public/img/category/" + category.img)

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
    const category_image = req.files?.Image || null;
    const { name, slug } = req.body;

    const category = await categoryModel.findById(id);
    if (!category) return res.send(message.DataNotFound);

    const update = {};
    if (name) update.name = name;
    if (slug) update.slug = slug;

    // If image is provided
    if (category_image) {
      const unique_Img_Name = generateUniqueImageName(category_image.name);
      const destination = "./public/img/category/" + unique_Img_Name;

      category_image.mv(destination, async (error) => {
        if (error) {
          return res.send(message.ImageUploadFailed);
        } else {
          update.img = unique_Img_Name;

          await categoryModel.findByIdAndUpdate(id, { $set: update });

          // Old Image Delete
          if (category.img) {
            try {
              fs.unlinkSync("./public/img/category/" + category.img);
            } catch (err) {
              console.log("Old image delete error:", err.message);
            }
          }

          return res.send(message.updateData);
        }
      });
    }

    // If image is NOT provided — normal update
    if (!category_image) {
      await categoryModel.findByIdAndUpdate(id, { $set: update });
      return res.send(message.updateData);
    }
  } catch (error) {
    console.log(error.message);
    return res.send(message.catch_error);
  }
};


module.exports = { getData, createData, status, deleteData, getDataById, updateData }
