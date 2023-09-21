import { Request, Response } from 'express';
import { SprintController } from './sprintController';
import { SprintService } from '../services/sprintService';
import { Sprint } from '../models/Sprint';
import { SprintRepository } from '../repositories/sprintRepository';
import { VelocityCalculator } from '../utils/velocityCalculator';

jest.mock('../services/sprintService', () => {
  return {
    SprintService: jest.fn().mockImplementation(() => {
      return {
        getSprints: jest.fn(),
        getSprintsByTeam: jest.fn(),
        calculateVelocityForTeam: jest.fn(),
        createSprint: jest.fn(),
        updateSprint: jest.fn(),
        deleteSprint: jest.fn(),
      }
    }),
  };
});

describe('SprintController', () => {
  const mockSprintRepository = new SprintRepository();
  const mockVelocityCalculator = new VelocityCalculator();
  const mockSprintService = new SprintService(mockSprintRepository, mockVelocityCalculator) as jest.Mocked<SprintService>;
  const sprintController = new SprintController(mockSprintService);

  describe('getSprints', () => {
    it('should get a list of sprints', async () => {
      const mockSprints: Sprint[] = [
        { id: 1, teamId: 1, effortCompleted: 10, milestoneTotalEffort: 20, sprintEndDate: new Date() },
        { id: 2, teamId: 1, effortCompleted: 15, milestoneTotalEffort: 30, sprintEndDate: new Date() },
      ];

      mockSprintService.getSprints.mockResolvedValue(mockSprints);

      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await sprintController.getSprints(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSprints);
    });

    it('should handle database errors', async () => {
      mockSprintService.getSprints.mockRejectedValue(new Error('Service error'));

      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await sprintController.getSprints(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'An error occurred while fetching sprints.',
      });
    });
  });

  describe('getSprintsByTeam', () => {
    it('should get a list of sprints for a team', async () => {
      const mockSprints: Sprint[] = [
        { id: 1, teamId: 1, effortCompleted: 10, milestoneTotalEffort: 20, sprintEndDate: new Date() },
        { id: 2, teamId: 1, effortCompleted: 15, milestoneTotalEffort: 30, sprintEndDate: new Date() },
      ];

      mockSprintService.getSprintsByTeam.mockResolvedValue(mockSprints);

      const req = {
        params: {
          teamId: '1',
        },
      } as Request<any, any, any, any, any>;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await sprintController.getSprintsByTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSprints);
    });

    it('should handle database errors', async () => {
      mockSprintService.getSprintsByTeam.mockRejectedValue(new Error('Service error'));

      const req = {
        params: {
          teamId: '1',
        },
      } as Request<any, any, any, any, any>;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await sprintController.getSprintsByTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'An error occurred while fetching sprints by team.',
      });
    });
  });

  describe('getVelocityByTeam', () => {
    it('should get a list of sprints and velocity for a team', async () => {
      const mockResults: [Sprint[], number, number, number] = [[
        { id: 1, teamId: 1, effortCompleted: 10, milestoneTotalEffort: 20, sprintEndDate: new Date('2023-08-27') },
        { id: 2, teamId: 1, effortCompleted: 15, milestoneTotalEffort: 30, sprintEndDate: new Date('2023-08-28') },
      ], 5, 10, 15];

      const mockResponse = {
        lowVelocity: 5,
        averageVelocity: 10,
        highVelocity: 15,
        sprints: [
          { id: 1, teamId: 1, effortCompleted: 10, milestoneTotalEffort: 20, sprintEndDate: new Date('2023-08-27') },
          { id: 2, teamId: 1, effortCompleted: 15, milestoneTotalEffort: 30, sprintEndDate: new Date('2023-08-28') },
        ],
      };

      mockSprintService.calculateVelocityForTeam.mockResolvedValue(mockResults);

      const req = {
        params: {
          teamId: '1',
          sampleSize: '3'
        },
      } as Request<any, any, any, any, any>;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await sprintController.getVelocityByTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
    });

    it('should handle database errors', async () => {
      mockSprintService.calculateVelocityForTeam.mockRejectedValue(new Error('Service error'));

      const req = {
        params: {
          teamId: '1',
          sampleSize: '3'
        },
      } as Request<any, any, any, any, any>;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await sprintController.getVelocityByTeam(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'An error occured while calculating velocity by team.',
      });
    });
  });

  describe('createSprint', () => {
    it('should create a new sprint', async () => {
      const sprintEndDate: Date = new Date('2023-08-28');
      const mockSprint: Sprint = { id: 1, teamId: 1, effortCompleted: 10, milestoneTotalEffort: 20, sprintEndDate: sprintEndDate };

      mockSprintService.createSprint.mockResolvedValue(mockSprint);

      const req = {
        body: {
          teamId: 1,
          effortCompleted: 10,
          milestoneTotalEffort: 20,
          sprintEndDate: '2023-08-28',
        },
      } as Request<any, any, any, any, any>;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await sprintController.createSprint(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockSprint);
    });

    it('should handle errors while creating a sprint', async () => {
      mockSprintService.createSprint.mockRejectedValue(new Error('Service error'));

      const req = {
        body: {
          teamId: 1,
          effortCompleted: 10,
          milestoneTotalEffort: 20,
          sprintEndDate: '2023-08-28',
        },
      } as Request<any, any, any, any, any>;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await sprintController.createSprint(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'An error occurred while creating a sprint.',
      });
    });
  });

  describe('updateSprint', () => {
    it('should update a sprint', async () => {
      const mockSprint = { id: 1, teamId: 1, effortCompleted: 15, milestoneTotalEffort: 30, sprintEndDate: new Date('2023-08-30') };

      mockSprintService.updateSprint.mockResolvedValue(mockSprint);

      const req = {
        params: { id: '1' },
        body: {
          teamId: 1,
          effortCompleted: 15,
          milestoneTotalEffort: 30,
          sprintEndDate: '2023-08-30',
        },
      } as Request<any, any, any, any, any>;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await sprintController.updateSprint(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSprint);
    });

    it('should handle database errors', async () => {
      mockSprintService.updateSprint.mockRejectedValue(new Error('Service error'));

      const req = {
        params: { id: '1' },
        body: {
          teamId: 1,
          effortCompleted: 15,
          milestoneTotalEffort: 30,
          sprintEndDate: '2023-08-30',
        },
      } as Request<any, any, any, any, any>;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await sprintController.updateSprint(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'An error occurred while updating the sprint.',
      });
    });
  });

  describe('deleteSprint', () => {
    it('should delete a sprint', async () => {
      mockSprintService.deleteSprint.mockResolvedValue(undefined);

      const req = {
        params: { id: '1' },
      } as Request<any, any, any, any, any>;

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await sprintController.deleteSprint(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should handle database errors', async () => {
      mockSprintService.deleteSprint.mockRejectedValue(new Error('Service error'));

      const req = {
        params: { id: '1' },
      } as Request<any, any, any, any, any>;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await sprintController.deleteSprint(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'An error occurred while deleting the sprint.',
      });
    });
  });
});
