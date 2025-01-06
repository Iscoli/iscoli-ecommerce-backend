import constants  from "../constant.js";



const errorHandler = (err, req, res, next) => {
 
  const statusCode = err.statusCode || constants.SERVER_ERROR;
  res.status(statusCode);
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.json({
        title: "Validation Failed",
        message: err.message,
        stackTrace: err.stacks,
      });
      break;
    case constants.NOT_FOUND:
      res.json({
        title: "Not Found",
        message: err.message,
        stackTrace: err.stacks,
      });
    case constants.UNAUTHORIZED:
      res.json({
        title: "Unauthorized",
        message: err.message,
        stackTrace: err.stacks,
      });
    case constants.FORBIDDEN:
      res.json({
        title: "Forbidden",
        message: err.message,
        stackTrace: err.stacks,
      });
      break;
    case constants.SERVER_ERROR:
      res.json({
        title: "server Error",
        message: err.message,
        stackTrace: err.stacks,
      });
      break;
    default:
      console.log("No Error, all good ");
      break;
  }
};

export default errorHandler;
