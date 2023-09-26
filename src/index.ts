import express from 'express';
import cors from 'cors';
import { globalErrorHandler } from './middleware/errorMiddleware';
import { SprintRepository } from './repositories/sprintRepository';
import { SprintService } from './services/sprintService';
import { SprintController } from './controllers/sprintController';
import { VelocityCalculator } from './utils/velocityCalculator';
import db from './database/databaseConfig';
import setupRoutes from './routes/routes'; 

const app = express();
const PORT = 3000;

const sprintRepository = new SprintRepository(db);
const velocityCalculator = new VelocityCalculator();
const sprintService = new SprintService(sprintRepository, velocityCalculator);
const sprintController = new SprintController(sprintService);

app.use(cors());
app.use(express.json());

app.use('/api', setupRoutes(sprintController));
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
