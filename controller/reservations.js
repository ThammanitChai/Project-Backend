const Reservation = require('../models/Reservation');
const CoworkingSpace = require('../models/CoworkingSpace');

exports.getReservations = async(req, res, next) => {
    let query;

    if(req.user.role !== 'admin') {
        query = Reservation.find({ user: req.user.id }).populate({
            path: 'coworkingSpace',
            select: 'name address tel openTime closeTime'
        });
    } 
    else {
        if(req.params.spaceId) {
            query = Reservation.find({ coworkingSpace: req.params.spaceId }).populate({
                path: 'coworkingSpace',
                select: 'name address tel openTime closeTime'
            });
        }
        else {
            query = Reservation.find().populate({
                path: 'coworkingSpace',
                select: 'name address tel openTime closeTime'
            });
        }
    }
    try {
        const reservations = await query;
        res.status(200).json({
            success: true,
            count: reservations.length,
            data: reservations
        });
     } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: 'Cannot find Reservations'
        });
    }
};

exports.getReservation= async(req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate({
            path: 'coworkingSpace',
            select: 'name address tel openTime closeTime'
        });

        if(!reservation) {
            return res.status(404).json({
                success: false,
                message: `No reservation with the id of ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: reservation
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: 'Cannot find Reservation'
        });
    }
};

exports.addReservation = async(req, res, next) => {
    try {
        if (!req.params.spaceId) {
            return res.status(400).json({
                success: false,
                message: 'Space ID is required to create a reservation'
            });
        }
        req.body.coworkingSpace = req.params.spaceId;

        const space = await CoworkingSpace.findById(req.params.spaceId);

        if(!space) {
            return res.status(404).json({
                success: false,
                message: `No space with the id of ${req.params.spaceId}`
            });
        }

        // ensure reservation date provided
        if(!req.body.reservationDate) {
            return res.status(400).json({
                success: false,
                message: 'Reservation date is required'
            });
        }
        req.body.user = req.user.id;

        const existedReservations = await Reservation.find({user:req.user.id});

        if(existedReservations.length >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: `The user with ID ${req.user.id} has already made 3 reservations`
            });
        }

        const reservation = await Reservation.create(req.body);
        res.status(200).json({
            success: true,
            data: reservation
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: 'Cannot create Reservation'
        });
    }
};

exports.updateReservation = async(req, res, next) => {
    try {
        let reservation = await Reservation.findById(req.params.id);

        if(!reservation) {
            return res.status(404).json({
                success: false,
                message: `No reservation with the id of ${req.params.id}`
            });
        }

        if(reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this reservation`
            });
        }

        reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: reservation
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: 'Cannot update Reservation'
        });
    }
};

exports.deleteReservation = async(req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if(!reservation) {
            return res.status(404).json({
                success: false,
                message: `No reservation with the id of ${req.params.id}`
            });
        }

        if(reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this reservation`
            });
        }

        await reservation.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            error: 'Cannot delete Reservation'
        });
    }
};