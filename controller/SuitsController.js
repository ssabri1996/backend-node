const suitsModel = require('../models/Suits');
const reservationModel = require('../models/Reservation');
// get all suitss
exports.list = async(req, res) => {
  try {
      var suits = await suitsModel.find();
      let filter_type = ['Marabou', 'Brecon', 'Ruppia', 'Ciconia', 'Colony', 'Bonelli', 'Cicogne', 'Amorpha']
      let data_array = []
   for (let index = 0; index < suits.length; index++) {
        await reservationModel.find({
            roomName: suits[index].title,
            "isActive": true,
            "type": "room"
         })
        .then(reservations => {
            array = []
            arrayOfRange = []
            arrayToSend = [];
            a = []
            reservations.map((item) => {
                    this.list1 = item.startFiltre
                    this.list2 = item.endFiltre
                    array.push(this.list1, this.list2)
                    const range = dateRange(item.startFiltre, item.endFiltre, 1)
                    arrayOfRange.push(range)
                })
                data_array =  arrayOfRange
            })
            suits[index]['history'] = data_array
        
    }
    
    let response =[]
    suits.forEach(element => {
        response.push({suit:element, reservation_date: element['history']})
    });
    res.status(200).send(response) 
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
       const reservation =  await reservationModel.find({
            "roomName": data.title,
            "isActive": true,
            "type": "room"
        })
        array = []
        arrayOfRange = []
        arrayToSend = [];
        a = []
        const dateArray = [];
        reservation.map((item) => {
                this.list1 = item.startFiltre
                this.list2 = item.endFiltre
                array.push(this.list1, this.list2)
                const range = dateRange(item.startFiltre, item.endFiltre, 1)
                arrayOfRange.push(range)
            })
          res.status(200).send({
              message: 'suits found successfully !',
              suits: data,
              reservation_date : arrayOfRange
          });
      }
  }).catch(err => {
      res.status(500).send({
          message: "Error getting suits ",
          error: err
      })
  })

}
function dateRange(startDate, endDate, steps) {
    const dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        dateArray.push(new Date(currentDate));
        // Use UTC date to prevent problems with time zones and DST
        currentDate.setUTCDate(currentDate.getUTCDate() + steps);
    }
    return dateArray;


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
