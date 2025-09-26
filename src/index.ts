import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import surveyRoutes from './routes/SurveyRoutes';
import localitiesRoutes from './routes/LocalityRoutes';
dotenv.config();
import { setupSwagger } from './swagger';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/surveys', surveyRoutes);
app.use('/api/localities', localitiesRoutes);

setupSwagger(app);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
