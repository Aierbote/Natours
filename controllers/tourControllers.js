const Tour = require('../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

// REFACTORING
class APIFeatures {
  // arg1: mongoose-query, arg2: express-string
  // arg1 could be easily an hardcode `/tours` but like this is reusable
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // BUILDING QUERY
    // 1a) Filtering
    const queryObj = { ...this.queryString }; // shallow copy
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1b) Advance Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt(e)?|lt(e)?)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    // needed for chaining features
    return this;
  }

  sort() {
    // 2) Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // 3) Field Limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // 4) Pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    // // NOTE : actually no need for this error, receive 0 results will be actually fine for users
    // // exceeding pagination happens only with the `page` field
    // if (this.queryString.page) {
    //   const numTours = await Tour.countDocuments();

    //   if (skip >= numTours) throw new Error('This page does not exist');
    // }

    return this;
  }
}

/* Route Handlers */

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    // Bad Request (probably a missing field)
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    // // BUILDING QUERY
    // // 1a) Filtering
    // const queryObj = { ...req.query }; // shallow copy
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);

    // // 1b) Advance Filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gt(e)?|lt(e)?)\b/g, (match) => `$${match}`);

    // let query = Tour.find(JSON.parse(queryStr));

    // // 2) Sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('-createdAt');
    // }

    // // 3) Field Limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // // 4) Pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // // exceeding pagination happens only with the `page` field
    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();

    //   if (skip >= numTours) throw new Error('This page does not exist');
    // }

    // EXECUTE THE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length, // NOTE : not a standard, but useful for counting multiple objects in array
      data: {
        tours /* explicitly `tours: tours` */,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // if true, return the modified document rather than the original
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
