const express = require('express');
const router = express.Router({ mergeParams: true }); // ✅ สำคัญ

const {
  getReservations,
  getReservation,
  addReservation,
  updateReservation,
  deleteReservation
} = require('../controller/reservations');

const { protect, authorize } = require('../middleware/auth');

// GET ALL + CREATE
router
  .route('/')
  .get(protect, getReservations)
  .post(protect, authorize('admin', 'user'), addReservation);

// GET ONE / UPDATE / DELETE
router
  .route('/:id')
  .get(protect, getReservation)
  .put(protect, authorize('admin', 'user'), updateReservation)
  .delete(protect, authorize('admin', 'user'), deleteReservation);

module.exports = router;