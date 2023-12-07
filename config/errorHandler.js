const handleSequelizeValidationError = (error, req, res, next) => {
  if (error.name === "SequelizeValidationError") {
    // Handle validation errors
    const validationErrors = error.errors.map((err) => ({
      field: err.path,
      message: err.message,
    }));
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: validationErrors,
    });
  }

  next(error);
};

const handleUnexpectedError = (error, req, res, next) => {
  console.log("Unexpected error", error.message);
  res.status(500).json({ success: false, message: "Internal Server Error" });
};

module.exports = { handleSequelizeValidationError, handleUnexpectedError };
