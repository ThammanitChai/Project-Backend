const Reservation = require('../models/Reservation');
const CoworkingSpace = require('../models/CoworkingSpace');

exports.getSpaces = async(req, res,next) => {
    let query;

    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit'];

    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    query = CoworkingSpace.find(JSON.parse(queryStr)).populate('reservations');

    if(req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    try {
        const total = await CoworkingSpace.countDocuments();
        query = query.skip(startIndex).limit(limit);
        const spaces = await query;

        const pagination = {};
        if(endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }

        if(startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }

        res.status(200).json({
            success: true,
            count: spaces.length,
            pagination,
            data: spaces
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

exports.getSpace = async(req, res,next) => {
    try {
        const space = await CoworkingSpace.findById(req.params.id);
        if(!space) {
            return res.status(400).json({
                success: false,
                error: 'No space found'
            });
        }
        res.status(200).json({
            success: true,
            data: space
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

exports.createSpace = async(req, res,next) => {
    const space = await CoworkingSpace.create(req.body);
    res.status(201).json({
        success: true,
        data: space
    });
};

exports.updateSpace = async(req, res,next) => {
    try {
        const space = await CoworkingSpace.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if(!space) {
            return res.status(400).json({
                success: false,
                error: 'No space found'
            });
        }
        res.status(200).json({
            success: true,
            data: space
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

exports.deleteSpace = async(req, res,next) => {
    try {
        const space = await CoworkingSpace.findById(req.params.id);
        if(!space) {
            return res.status(404).json({
                success: false,
                message: `Space not found for id ${req.params.id}`
            });
        }
        await Reservation.deleteMany({ coworkingSpace: req.params.id });
        await space.deleteOne({ _id: req.params.id });
        
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};