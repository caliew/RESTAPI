const mongoose = require('mongoose');
const Sensor = require("../models/sensor");

exports.sensors_get_all = (req,res,next) => {
    Sensor.find()
        .exec()
        .then(docs => {
            const reponse = {
                count: docs.length,
                sensors: docs.map(doc => {
                    return {
                        name : doc.name,
                        type: doc.type,
                        request: {
                            type: 'GET',
                            url: 'http:/localhost:3000/sensors/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(reponse);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}

exports.sensors_get_sensor = (req,res,next) => {
    const id = req.params.sensorId;
    Sensor.findById(id)
        .select('name type data')
        .exec()
        .then(doc =>{
            console.log("From Database", doc);
            if (doc) {
                res.status(200).json({
                    sensor: doc,
                    request: {
                        type: 'GET',
                        url: 'http:/localhost:3000/sensor/' + id
                    }
                })
            } else {
                res.status(404).json({
                    message: 'No Valid Entry Found For Provided ID'
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}

exports.sensor_create_sensor = (req,res,next) => {
    const sensor = new Sensor({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        type : req.body.type,
        data : req.body.data
    });
    sensor
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message:"Handling POST requests to /sensors",
                createdSensor: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}

exports.sensors_update_sensor = (req,res,next) => {
    const id = req.params.sensorId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Sensor.update({_id: id}, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch( err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}

exports.sensors_delete_sensor = (req,res,next) => {
    const id = req.params.sensorId;    
    Sensor.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}