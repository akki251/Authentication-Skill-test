// this is global catchAsync function for handing async errors globally
const catchAsync = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => next(err));
  };
};

module.exports = catchAsync;
