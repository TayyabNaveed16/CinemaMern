var mongoose = require('mongoose');
var customerSchema = mongoose.Schema({

  name: {
    type: String,
    required: [true, 'please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please add a phone number'],

  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
  },
  ticket: [{

      ticketNumber: {
        type: Number,
      },
      movieName: {
        type: String,
      }
  }],

},

{
  timestamps: true
}
);

module.exports = mongoose.model('customer', customerSchema);



