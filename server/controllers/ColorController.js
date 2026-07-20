const message = require('../message')
const { colorModel } = require('../model/colorModel')

const getData = async (req, res) => {
  try {
    const color = await colorModel.find()
    // console.log(color)

    res.send({
      message: "Color find",
      flag: 0,
      color
    })
    // console.log(color)

  } catch (error) {
    console.log(error.message)
    res.send(message.catch_error)
  }
}

const getDataById = async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id)
    color = await colorModel.findById({ _id: id });

    res.send({
      message: "Color find",
      flag: 0,
      color
    })
  } catch (error) {
    console.log(error)

    res.send(message.catch_error)
  }
}

const createData = async (req, res) => {
  try {
    const { name, code } = req.body;

    // Check if name or code is missing


    const colorExist = await colorModel.findOne({ name });
    if (colorExist) {
      return res.send({
        message: "Color already exists",
        flag: 1,
      });
    }

    const color = await colorModel.create({
      name: req.body.name,
      code: req.body.code
    });

    // BUG FIX: Ensure message object exists and has proper format
    res.send({
      message: "Color created successfully",
      flag: 0,
      data: color,
    });
  } catch (error) {
    console.log(error.message);
    res.send(message.catch_error);
  }
};


const status = async (req, res) => {
    try {
        const flag = req.body.flag;
        const objKey = {};
        const id = req.params.id;
        // console.log(id)

        const colorExist = await colorModel.findById(id);
        if (!colorExist) {
            return res.send(message.DataNotFound)
        }

        if (flag == "1") {
            objKey.status = !colorExist.status
        }
        

        await colorModel.findByIdAndUpdate(
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
    // console.log(id)

  
    const colorExist = await colorModel.findById(id)
  

    if (!colorExist) return res.send(message.DataNotFound)

    const color = await colorModel.findByIdAndDelete(id)
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
    const { name, code, status } = req.body;

    const color = await colorModel.findById(id);
    if (!color) return res.send(message.DataNotFound);

    const update = {};
    if (name) update.name = name;
    if (code) update.code = code;
    if (status !== undefined) update.status = status; // fixed: include false status too

    // BUG FIX: Use colorModel instead of categoryModel
    await colorModel.findByIdAndUpdate(id, { $set: update });

    return res.send(message.updateData);
  } catch (error) {
    console.log(error.message);
    return res.send(message.catch_error);
  }
};


module.exports = { getData, getDataById, createData, status, deleteData, updateData }
