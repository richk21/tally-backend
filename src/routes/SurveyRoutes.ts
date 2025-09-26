import { Router } from 'express';
import {
  addSurvey,
  getRatingsOverTime,
  getSurveyStatsByLocality,
} from '../controllers/SurveyController';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Locality:
 *       type: object
 *       properties:
 *         state:
 *           type: string
 *         city:
 *           type: string
 *         area:
 *           type: string
 *         pincode:
 *           type: string
 *     Ratings:
 *       type: object
 *       properties:
 *         cleanliness:
 *           type: number
 *         waterQuality:
 *           type: number
 *         affordability:
 *           type: number
 *         safety:
 *           type: number
 *     Amenities:
 *       type: object
 *       properties:
 *         hospital:
 *           type: number
 *         groceryStore:
 *           type: number
 *         vegetableVendor:
 *           type: number
 *     Survey:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         age:
 *           type: number
 *         locality:
 *           $ref: '#/components/schemas/Locality'
 *         ratings:
 *           $ref: '#/components/schemas/Ratings'
 *         amenities:
 *           $ref: '#/components/schemas/Amenities'
 */

/**
 * @swagger
 * /surveys/add:
 *   post:
 *     summary: Add a new survey
 *     tags:
 *       - Surveys
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Survey'
 *     responses:
 *       201:
 *         description: Survey created successfully
 *       500:
 *         description: Server error
 */
router.post('/add', addSurvey);

/**
 * @swagger
 * /surveys/getData:
 *   get:
 *     summary: Get aggregated survey stats based on locality search
 *     description: Returns aggregated information such as average ratings, amenities, age groups, and occupation distributions for the specified locality. The locality should be passed as a query parameter.
 *     tags:
 *       - Surveys
 *     parameters:
 *       - name: locality
 *         in: query
 *         schema:
 *           type: string
 *         description: The name of the locality (state, city, area, or pincode) to get stats for
 *         example: California
 *     responses:
 *       200:
 *         description: Aggregated stats object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 stats:
 *                   type: object
 *                   properties:
 *                     ratingsAvg:
 *                       type: object
 *                       additionalProperties:
 *                         type: number
 *                       example:
 *                         cleanliness: 4.5
 *                         waterQuality: 4.0
 *                         affordability: 3.8
 *                         safety: 4.3
 *                     amenitiesAvg:
 *                       type: object
 *                       additionalProperties:
 *                         type: number
 *                       example:
 *                         hospital: 4.0
 *                         groceryStore: 4.2
 *                         recreation: 3.6
 *                     ageDistribution:
 *                       type: object
 *                       additionalProperties:
 *                         type: integer
 *                       example:
 *                         "18-25": 120
 *                         "26-35": 80
 *                     occupationDistribution:
 *                       type: object
 *                       additionalProperties:
 *                         type: integer
 *                       example:
 *                         teacher: 40
 *                         engineer: 100
 *       400:
 *         description: Bad request - locality parameter missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "locality query parameter is required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Server error message"
 */
router.get('/getData', getSurveyStatsByLocality);

/**
 * @swagger
 * /surveys/getRatingsOverTime:
 *   get:
 *     summary: Get average ratings over time for a given locality
 *     tags:
 *       - Ratings
 *     parameters:
 *       - in: query
 *         name: locality
 *         schema:
 *           type: string
 *         description: Locality name (state, city, area, or pincode) to filter ratings
 *     responses:
 *       200:
 *         description: Success - returns average ratings grouped by date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         example: '2025-09-25'
 *                         description: The date for which averages are calculated (yyyy-mm-dd)
 *                       cleanliness:
 *                         type: number
 *                         example: 3.7
 *                         description: Average cleanliness rating
 *                       airQuality:
 *                         type: number
 *                         example: 4.2
 *                         description: Average air quality rating
 *                       waterQuality:
 *                         type: number
 *                         example: 4.1
 *                         description: Average water quality rating
 *                       noiseLevel:
 *                         type: number
 *                         example: 3.0
 *                         description: Average noise level rating
 *       400:
 *         description: Bad Request - missing locality parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "locality query parameter is required"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/getRatingsOverTime', getRatingsOverTime);

export default router;
