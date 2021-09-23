/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable no-console */
// import http from 'http';
import config from './config/config';
import bodyParser from 'body-parser';
import express from 'express';
import logging from './config/logging';
import serverless from 'serverless-http';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/user';



const NAMESPACE = 'Server';
const app = express();
app.use(cors());

let ress='';

mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then((result) => {
      ress='Mongo Connected';
      logging.info(NAMESPACE, 'Mongo Connected');
    })
    .catch((error) => {
      ress=error.message+'il y a eu probleme';
      logging.error(NAMESPACE, error.message, error);
});






// const port = 3000;
// app.use(cors());
app.get('/', (req, res) => {
   res.send("TEST RESET HARD")
});
// app.listen( port, () => {
//     return console.log(`server is listening on ${port}`);
// }).on('error', (err) => {
//     console.log(err);
// });

/** Log the request */
app.use((req, res, next) => {
  /** Log the req */
  logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

  res.on('finish', () => {
      /** Log the res */
      logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
  });
  next();
});

/** Parse the body of the request */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/** Rules of our API */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method == 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
  }
  next();
});

/** Routes go here */
app.use('/users', userRoutes);

/** Error handling */
app.use((req, res, next) => {
  const error = new Error('Not found');
  res.status(404).json({
      message: error.message
  });
});

const port=4444;
app.listen(config.server.port, () => logging.info(NAMESPACE, `Server is running on http://localhost:${config.server.port}`));


// module.exports.handler = serverless(app);
