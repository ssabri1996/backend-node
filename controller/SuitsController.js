const suitsModel = require('../models/Suits');

// get all suitss
exports.list = async(req, res) => {
  try {
      var suits = await suitsModel.find();
      res.status(200).json(suits);
  } catch (error) {

      res.status(200).json({ error })
  }
}

// get suits by id
exports.getOne = (req, res) => {
  id = req.params.id;
  suitsModel.findById(id).then(async(data) => {
      if (!data) {
          res.status(404).send({
              message: 'suits not found'
          })
      } else {
          res.status(200).send({
              message: 'suits found successfully !',
              suits: data
          });
      }
  }).catch(err => {
      res.status(500).send({
          message: "Error getting suits ",
          error: err
      })
  })

}

// create
exports.create = async(req, res) => {
  if (!req.body) {
      res.status(400).json({ message: 'content can not be empty' })
  }
  var suits = new suitsModel(req.body);
  try {
    suits = await suits.save();
      res.status(200).json({
          message: "suits was created successfully no not forget index",
          suits: suits.title,
      });
  } catch (error) {
      res.status(500).json({ error })
  }
}



// update suits
exports.update = (req, res) => {
  id = req.params.id;
  if (!req.body) {
      res.status(400).json({ message: 'content can not be empty' })
  }
  suitsModel.findByIdAndUpdate(id, req.body).then(async(data) => {
      if (!data) {
          res.status(404).send({
              message: 'cannot update suits'
          })
      } else {
          suits = await suitsModel.findById(data._id);
          res.status(200).send({
              message: 'suits was updated successfully !',
              suits: suits
          });
      }
  }).catch(err => {
      res.status(500).send({
          message: "Error updating suits ",
          error: err
      })
  })

}

// delete
exports.delete = async(req, res) => {
  var { id } = req.params;
  if (!id) {
      res.status(400).json({ message: 'id can not be empty' })
  }
  try {
      var suits = await suitsModel.findByIdAndDelete(id);
      res.status(200).json({ message: 'suits deleted' })
  } catch (error) {
      res.status(500).json({ error })

  }
}
