import express from 'express';
import { SprintController } from '../controllers/sprintController';
import {
  validateGetSprints,
  validateGetSprintsByTeam,
  validateGetVelocityByTeam,
  validateCreateSprint,
  validateUpdateSprint,
  validateDeleteSprint,
} from '../validators/sprintValidator';

const router = express.Router();

export default function setupRoutes(sprintController: SprintController) {
  router.get('/sprints', validateGetSprints, sprintController.getSprints);
  router.get(
    '/team/:teamId/sprints',
    validateGetSprintsByTeam,
    sprintController.getSprintsByTeam
  );
  router.get(
    '/velocity/:teamId/:sampleSize',
    validateGetVelocityByTeam,
    sprintController.getVelocityByTeam
  );
  router.post('/sprints', validateCreateSprint, sprintController.createSprint);
  router.put(
    '/sprints/:id',
    validateUpdateSprint,
    sprintController.updateSprint
  );
  router.delete(
    '/sprints/:id',
    validateDeleteSprint,
    sprintController.deleteSprint
  );

  return router;
}
