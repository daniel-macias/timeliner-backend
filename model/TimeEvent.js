const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TimeEventSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String, required: false},
  timeline: { type: mongoose.Types.ObjectId, required: true, ref: 'Timeline' },
  startDate: { type: Date, require: true},
  endDate: { type: Date } // Not to be used in initial version of the product
});

const TimeEvent = mongoose.model('TimeEvent', TimeEventSchema);

module.exports = TimeEvent;