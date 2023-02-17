var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// var logger = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
require("tls").DEFAULT_MIN_VERSION = "TLSv1";

// // Add this to the VERY top of the first file loaded in your app
// var apm = require("elastic-apm-node").start({
//   // Override the service name from package.json
//   // Allowed characters: a-z, A-Z, 0-9, -, _, and space
//   serviceName: `cma-api-${process.env.DM_ENV}`,

//   // Use if APM Server requires a secret token
//   secretToken: "",

//   // Set the custom APM Server URL (default: http://localhost:8200)
//   serverUrl: "https://elasticsearch.biotechfarms.net",

//   // Set the service environment
//   environment: `${process.env.DM_ENV}`,
// });



dotenv.config();

//login service layer
const { users } = require('./sl-access/users/user');


// var indexRouter = require('../routes/api/index');
// var usersRouter = require('../routes/api/users');
var rolesRouter = require('../routes/api/role');
var actionRouter = require('../routes/api/action')
var moduleRouter = require('../routes/api/module')
var accessRightsRouter = require('../routes/api/access-right');
var userAccountsRouter = require('../routes/api/user-accounts');
var checkRouters = require('../routes/api/checks');
var transactionRouters = require('../routes/api/transactions');
var userGroupsRouters = require('../routes/api/user-groups');
var locationRouters = require('../routes/api/locations');
var reportsRouters = require('../routes/api/reports');
var activityLogRouters = require('../routes/api/activity-logs');

var app = express();

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


// app.use('/', indexRouter);
// app.use('/users', usersRouter);

//roles route
app.use('/cma-api/roles', rolesRouter);
//action route
app.use('/cma-api/action', actionRouter);
//roles module
app.use('/cma-api/module', moduleRouter);
//access right
app.use('/cma-api/access-rights', accessRightsRouter);
//users
app.use('/cma-api/user', userAccountsRouter);
//checks
app.use('/cma-api/check', checkRouters);
//transactions
app.use('/cma-api/transaction', transactionRouters);
//user groups
app.use('/cma-api/user-groups', userGroupsRouters);
//locations
app.use('/cma-api/locations', locationRouters);
//reports
app.use('/cma-api/reports', reportsRouters);
//activity logs
app.use('/cma-api/activity-logs', activityLogRouters);

const PORT = process.env.PORT || 3000;

// users.userLogin()
//   .then(res => {
//     process.env.SESSIONID = res.SessionId;
//   })

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});

console.log(`Server is connecting to db: ${process.env.PGDATABASE}.`);

module.exports = app;
