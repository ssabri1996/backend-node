const sectionModel = require('../models/Sections');

// get all sections
exports.list = async(req, res) => {
  try {
      var sections = await sectionModel.find();
      res.status(200).json(sections);
  } catch (error) {

      res.status(200).json({ error })
  }
}

// get section by id
exports.getOne = (req, res) => {
  id = req.params.id;
  sectionModel.findById(id).then(async(data) => {
      if (!data) {
          res.status(404).send({
              message: 'Section not found'
          })
      } else {
          res.status(200).send({
              message: 'section found successfully !',
              section: data
          });
      }
  }).catch(err => {
      res.status(500).send({
          message: "Error getting Section ",
          error: err
      })
  })

}

// create
exports.create = async(req, res) => {
  if (!req.body) {
      res.status(400).json({ message: 'content can not be empty' })
  }
  var section = new sectionModel(req.body);
  try {
    section = await section.save();
      res.status(200).json({
          message: "section was created successfully no not forget index",
          section: section.name,
      });
  } catch (error) {
      res.status(500).json({ error })
  }
}



// update section
exports.update = (req, res) => {
  id = req.params.id;
  if (!req.body) {
      res.status(400).json({ message: 'content can not be empty' })
  }
  sectionModel.findByIdAndUpdate(id, req.body).then(async(data) => {
      if (!data) {
          res.status(404).send({
              message: 'cannot update section'
          })
      } else {
          section = await sectionModel.findById(data._id);
          res.status(200).send({
              message: 'section was updated successfully !',
              section: section
          });
      }
  }).catch(err => {
      res.status(500).send({
          message: "Error updating Section ",
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
      var section = await sectionModel.findByIdAndDelete(id);
      res.status(200).json({ message: 'section deleted' })
  } catch (error) {
      res.status(500).json({ error })

  }
}
