require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const router = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const cron = require("./utils/scheduller");
const moment = require("moment-timezone");
const fs = require("fs");
const YAML = require("yaml");
const swaggerUi = require("swagger-ui-express");
const Sentry = require("@sentry/node");

const { SENTRY_DSN, ENVIRONMENT } = process.env;

Sentry.init({
  environment: ENVIRONMENT,
  dsn: SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],

  tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

moment.tz.setDefault("Asia/Jakarta");

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(morgan("dev"));

const file = fs.readFileSync("./docs.yaml", "utf-8");
const swaggerDocument = YAML.parse(file);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(router);

//sentry error handler
app.use(Sentry.Handlers.errorHandler());

// 500
// app.use((err, req, res, next) => {
//   console.log(err);
//   return res.status(500).json({
//     status: false,
//     message: err.message,
//     data: null,
//   });
// });

cron.schedulleUpdateExpiredUser();

module.exports = app;
