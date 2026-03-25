const express = require('express');
const { getSpaces, getSpace, createSpace, updateSpace, deleteSpace } = require('../controller/spaces');


const reservationRouter = require('./reservations');
router.use('/:spaceId/reservations', reservationRouter);

/**
 * @swagger
 * components:
 *   schemas:
 *       CoworkingSpace:
 *           type: object
 *           required:
 *             - name
 *             - address
 *             - tel
 *             - openTime
 *             - closeTime
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             address:
 *               type: string
 *             tel:
 *               type: string
 *             openTime:
 *               type: string
 *             closeTime:
 *               type: string
 */

/**
 * @swagger
 * tags:
 *    name: Spaces
 *    description: API for managing co-working spaces
 */


/**
* @swagger
* /spaces:
*   get:
*      summary: Returns the list of all the spaces
*      tags: [Spaces]
*      responses:
*        200:
*          description: The list of the spaces
*          content:
*            application/json:
*              schema:
*                type: array
*                items:
*                  $ref: '#/components/schemas/CoworkingSpace'
*/

/**
* @swagger
* /spaces/{id}:
*   get:
*     summary: Get the space by id
*     tags: [Spaces]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*           required: true
*           description: The space id
*     responses:
*       200:
*         description: The space description by id
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/CoworkingSpace'
*       404:
*         description: The space was not found
*/

/**
* @swagger
* /spaces:
*   post:
*     summary: Create a new space
*     tags: [Spaces]
*     requestBody:
*       required: true
*       content:
*         application/json:
*          schema:
*            $ref: '#/components/schemas/CoworkingSpace'
*     responses:
*       201:
*         description: The space was successfully created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/CoworkingSpace'
*       500:
*         description: Some server error
*/

/**
* @swagger
* /spaces/{id}:
*   put:
*     summary: The space was updated
*     tags: [Spaces]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*           required: true
*           description: The space id
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CoworkingSpace'
*     responses:
*       200:
*         description: The space was updated
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/CoworkingSpace'
*       404:
*         description: The space was not found
*       500:
*         description: Some error happened
*/

/**
 * @swagger
 * /spaces/{id}:
 *   delete:
 *     summary: Remove the space by id
 *     tags: [Spaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The space id
 *     responses:
 *       200:
 *         description: The space was deleted
 *       404:
 *         description: The space was not found
 */

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getSpaces).post(protect,authorize('admin'),createSpace);
router.route('/:id').get(getSpace).put(protect, authorize('admin'), updateSpace).delete(protect, authorize('admin'), deleteSpace);


module.exports = router;