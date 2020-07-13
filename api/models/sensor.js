const mongoose = require('mongoose');

const sensorSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : String,
    type : String,
    data : Number
});

var EnumSENSOR = {
    RH: "Relative Humidity & Temperature",
    PWRMTR: "Power Meter",
    WTRLEAK: "Water Leak",
    PIR: "Proximity Infra-Red",
    ADC: "ADC Converter",
    SMOKEFIRE: "SMOKE & FIRE DETECTOR"
  };
  
module.exports = mongoose.model('Sensor',sensorSchema) 