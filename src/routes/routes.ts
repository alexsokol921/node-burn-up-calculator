import express from 'express';
import { SprintRepository } from '../repositories/sprintRepository';
import { SprintService } from '../services/sprintService';
import { SprintController } from '../controllers/sprintController';
import { VelocityCalculator } from '../utils/velocityCalculator';
import { validateGetSprintsByTeam, validateGetVelocityByTeam, validateCreateSprint, validateUpdateSprint, validateDeleteSprint } from '../validators/sprintValidator';

const router = express.Router();
const sprintRepository = new SprintRepository();
const velocityCalculator = new VelocityCalculator();
const sprintService = new SprintService(sprintRepository, velocityCalculator);
const sprintController = new SprintController(sprintService);

router.get('/sprints', sprintController.getSprints);
router.get('/team/:teamId/sprints', validateGetSprintsByTeam, sprintController.getSprintsByTeam);
router.get('/velocity/:teamId/:sampleSize', validateGetVelocityByTeam, sprintController.getVelocityByTeam);
router.post('/sprints', validateCreateSprint, sprintController.createSprint);
router.put('/sprints/:id', validateUpdateSprint, sprintController.updateSprint);
router.delete('/sprints/:id', validateDeleteSprint, sprintController.deleteSprint);

export default router;
