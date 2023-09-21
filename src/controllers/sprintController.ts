import { Request, Response } from 'express';
import { SprintService } from '../services/sprintService';
import { Sprint } from '../models/Sprint';

export class SprintController {
  private sprintService: SprintService;

  constructor(sprintService: SprintService) {
    this.sprintService = sprintService;
  }

  getSprints = async (req: Request, res: Response): Promise<void> => {
    try {
      const sprints: Sprint[] = await this.sprintService.getSprints();
      res.status(200).json(sprints);
    } catch (error) {
      this.handleServerError(res, 'An error occurred while fetching sprints.');
    }
  }

  getSprintsByTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      const { teamId } = req.params;
      const parsedTeamId = parseInt(teamId, 10);

      const teamSprints: Sprint[] = await this.sprintService.getSprintsByTeam(parsedTeamId);
      res.status(200).json(teamSprints);
    } catch (error) {
      this.handleServerError(res, 'An error occurred while fetching sprints by team.');
    }
  }

  getVelocityByTeam = async (req: Request, res: Response): Promise<void> => {
    try {
      const { teamId, sampleSize } = req.params;
      const parsedTeamId = parseInt(teamId, 10);
      const parsedSampleSize = parseInt(sampleSize, 10);

      const [sprints, lowVelocity, averageVelocity, highVelocity]: [Sprint[], number, number, number] = await this.sprintService.calculateVelocityForTeam(parsedTeamId, parsedSampleSize);
      res.status(200).json({ sprints, lowVelocity, averageVelocity, highVelocity });
    } catch (error) {
      this.handleServerError(res, 'An error occured while calculating velocity by team.');
    }
  }

  createSprint = async (req: Request, res: Response): Promise<void> => {
    try {
      const { teamId, effortCompleted, milestoneTotalEffort, sprintEndDate } = req.body;

      const newSprint: Sprint = await this.sprintService.createSprint(teamId, effortCompleted, milestoneTotalEffort, sprintEndDate);
      res.status(201).json(newSprint);
    } catch (error) {
      this.handleServerError(res, 'An error occurred while creating a sprint.');
    }
  }

  updateSprint = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const parsedId = parseInt(id, 10);

      const { teamId, effortCompleted, milestoneTotalEffort, sprintEndDate } = req.body;

      const updatedSprint: Sprint = await this.sprintService.updateSprint(parsedId, teamId, effortCompleted, milestoneTotalEffort, sprintEndDate);
      res.status(200).json(updatedSprint);
    } catch (error) {
      this.handleServerError(res, 'An error occurred while updating the sprint.');
    }
  }

  deleteSprint = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const parsedId = parseInt(id, 10);

      await this.sprintService.deleteSprint(parsedId);
      res.status(204).send();
    } catch (error) {
      this.handleServerError(res, 'An error occurred while deleting the sprint.');
    }
  }

  private handleServerError = (res: Response, errorMessage: string): void => {
    res.status(500).json({ error: errorMessage });
  }
}
