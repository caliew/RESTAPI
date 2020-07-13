const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const sensorRoutes = require('./api/routes/sensors');
const userRoutes = require('./api/routes/users');

mongoose.connect("mongodb+srv://caliew:" + process.env.MONGO_ATLAS_PW + "@contactkepper-xbxsx.mongodb.net/MutiaraIOT?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});
//  REMOVE DEPRECATION WARNING
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads')); 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//  PREVENT CORS ERROR IN SPA APPLICATION
//  CORS = CROSS-ORIGIN RESOURCE SHARING
app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({})
    }
    next();
});

//  ROUTES WHICH SHOULD HANDLE REQUESTS
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/sensors',sensorRoutes);
app.use('/users',userRoutes);

app.use((req,res,next) => {
    const error = new Error('Not Found');
    error.status= 404;
    next(error);
})

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app; 