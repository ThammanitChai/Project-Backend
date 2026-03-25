const express = require('express');
const router = express.Router(); // ✅ ต้องประกาศก่อนใช้

const {
  getSpaces,
  getSpace,
  createSpace,
  updateSpace,
  deleteSpace
} = require('../controller/spaces');

const reservationRouter = require('./reservations');
const { protect, authorize } = require('../middleware/auth');

// ✅ NESTED ROUTE (สำคัญมาก)
router.use('/:spaceId/reservations', reservationRouter);

/**
 * @swagger
 * components:
 *   schemas:
 *     CoworkingSpace:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - tel
 *         - openTime
 *         - closeTime
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         tel:
 *           type: string
 *         openTime:
 *           type: string
 *         closeTime:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Spaces
 *   description: API for managing co-working spaces
 */

/**
 * @swagger
 * /spaces:
 *   get:
 *     summary: Returns all spaces
 *     tags: [Spaces]
 *     responses:
 *       200:
 *         description: List of spaces
 */
router
  .route('/')
  .get(getSpaces)
  .post(protect, authorize('admin'), createSpace);

/**
 * @swagger
 * /spaces/{id}:
 *   get:
 *     summary: Get space by ID
 */
router
  .route('/:id')
  .get(getSpace)
  .put(protect, authorize('admin'), updateSpace)
  .delete(protect, authorize('admin'), deleteSpace);

module.exports = router;