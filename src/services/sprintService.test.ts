import { SprintService } from './sprintService';
import { Sprint } from '../models/Sprint';
import { SprintRepository } from '../repositories/sprintRepository';
import { VelocityCalculator } from '../utils/velocityCalculator';
import { Database } from '../database/database';

jest.mock('../repositories/sprintRepository', () => {
  return {
    SprintRepository: jest.fn().mockImplementation(() => {
      return {
        getSprints: jest.fn(),
        getSprintsByTeam: jest.fn(),
        createSprint: jest.fn(),
        updateSprint: jest.fn(),
        deleteSprint: jest.fn(),
      }
    }),
  };
});

describe('SprintService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockDB = new Object() as Database;
  const mockSprintRepository = new SprintRepository(mockDB) as jest.Mocked<SprintRepository>;
  const velocityCalculator = new VelocityCalculator();
  const sprintService = new SprintService(mockSprintRepository, velocityCalculator);

  const mockSprintData: Sprint[] = [
    {
      id: 1,
      teamId: 1,
      effortCompleted: 10,
      milestoneTotalEffort: 20,
      sprintEndDate: new Date(),
      createdAt: new Date(),
    },
    {
      id: 2,
      teamId: 1,
      effortCompleted: 15,
      milestoneTotalEffort: 30,
      sprintEndDate: new Date(),
      createdAt: new Date(),
    },
  ];

  it('should getSprints', async () => {
    mockSprintRepository.getSprints.mockResolvedValue(mockSprintData);

    const sprints = await sprintService.getSprints();

    expect(sprints).toEqual(mockSprintData);
  });

  it('should getSprintsByTeam', async () => {
    mockSprintRepository.getSprintsByTeam.mockResolvedValue(mockSprintData);

    const teamId = 1;
    const sprints = await sprintService.getSprintsByTeam(teamId);

    expect(sprints).toEqual(mockSprintData);
  });

  it('should createSprint', async () => {
    const newSprint: Sprint = {
      id: 3,
      teamId: 1,
      effortCompleted: 12,
      milestoneTotalEffort: 25,
      sprintEndDate: new Date(),
      createdAt: new Date(),
    };

    mockSprintRepository.createSprint.mockResolvedValue(newSprint);

    const createdSprint = await sprintService.createSprint(
      newSprint.teamId,
      newSprint.effortCompleted,
      newSprint.milestoneTotalEffort,
      newSprint.sprintEndDate
    );

    expect(createdSprint).toEqual(newSprint);
  });

  it('should updateSprint', async () => {
    const updatedSprintData: Sprint = {
      id: 1,
      teamId: 1,
      effortCompleted: 20,
      milestoneTotalEffort: 40,
      sprintEndDate: new Date(),
      createdAt: new Date(),
    };

    mockSprintRepository.updateSprint.mockResolvedValue(updatedSprintData);

    const updatedSprint = await sprintService.updateSprint(
      updatedSprintData.id as number,
      updatedSprintData.teamId,
      updatedSprintData.effortCompleted,
      updatedSprintData.milestoneTotalEffort,
      updatedSprintData.sprintEndDate
    );

    expect(updatedSprint).toEqual(updatedSprintData);
  });

  it('should deleteSprint', async () => {
    const sprintId = 1;

    mockSprintRepository.deleteSprint.mockResolvedValue(undefined);

    await sprintService.deleteSprint(sprintId);

    expect(mockSprintRepository.deleteSprint).toHaveBeenCalledWith(sprintId);
  });

  it('should calculateVelocityForTeam', async () => {
    const teamId = 1;
    const sampleSize = 2;
    const expectedVelocityData = [mockSprintData, 10, 12.5, 15];

    mockSprintRepository.getSprintsByTeam.mockResolvedValue(mockSprintData);

    const velocityData = await sprintService.calculateVelocityForTeam(teamId, sampleSize);

    expect(velocityData).toEqual(expectedVelocityData);
  });
});
