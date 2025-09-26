import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import surveyRoutes from './routes/SurveyRoutes';
import localitiesRoutes from './routes/LocalityRoutes';
dotenv.config();
import { setupSwagger } from './swagger';

const app = express();

const allowedOrigins = ['https://tally-survey-app.netlify.app'];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'CORS policy does not allow access from this origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/surveys', surveyRoutes);
app.use('/api/localities', localitiesRoutes);

setupSwagger(app);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running`));
