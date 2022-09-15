const Environment = require('./environment');
const express = require('express');
const Logger = require('./logger');
const port = Environment.get('PORT');
const app = express();
const http = new require('http').Server(app);
const Scheduler = require('./scheduler')

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const routes = require('./routes')
app.use(routes)

Scheduler.scheduleTransferForNextOpenTime()

http.listen(port, () =>
  Logger.info(`server started on port: ${port}`)
);