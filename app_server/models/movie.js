var mongoose = require('mongoose');
var movieSchema = mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  releaseDate: {
    type: String,
    required: true,
  },
  rating: {
    type:  Number,
    required: true,

  },
  seats:{
    type: Number,
    required: false,
  },
  description:{
    type: String,
    required: true,
  },
  URL:{
    type: String,
    required: true,
  }

});

module.exports = mongoose.model('movie', movieSchema);



