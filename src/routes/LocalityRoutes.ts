import { Router } from 'express';
import {
  getStates,
  getCities,
  getAreas,
  getPincodes,
} from '../controllers/LocalitiesController';

const router = Router();

/**
 * @swagger
 * /localities/states:
 *   get:
 *     summary: Get all known states
 *     responses:
 *       200:
 *         description: List of all states
 *       500:
 *         description: Server error
 */
router.get('/states', getStates);

/**
 * @swagger
 * /localities/cities:
 *   get:
 *     summary: Get all known cities
 *     responses:
 *       200:
 *         description: List of all cities
 *       500:
 *         description: Server error
 */
router.get('/cities', getCities);

/**
 * @swagger
 * /localities/areas:
 *   get:
 *     summary: Get all known areas
 *     responses:
 *       200:
 *         description: List of all areas
 *       500:
 *         description: Server error
 */
router.get('/areas', getAreas);

/**
 * @swagger
 * /localities/pincodes:
 *   get:
 *     summary: Get all known pincodes
 *     responses:
 *       200:
 *         description: List of all pincodes
 *       500:
 *         description: Server error
 */
router.get('/pincodes', getPincodes);

export default router;
