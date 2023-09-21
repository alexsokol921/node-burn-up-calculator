import { SprintRepository } from './sprintRepository';
import { SprintData, Sprint } from '../models/Sprint';
import db from '../database';

const mockSprintData: SprintData[] = [
  {
    id: 1,
    team_id: 1,
    effort_completed: 10,
    milestone_total_effort: 20,
    sprint_end_date: new Date('2023-08-05'),
    created_at: new Date('2023-08-06'),
  },
  {
    id: 2,
    team_id: 1,
    effort_completed: 15,
    milestone_total_effort: 30,
    sprint_end_date: new Date('2023-08-12'),
    created_at: new Date('2023-08-13'),
  },
];

const mockSprints: Sprint[] = [
  {
    id: 1,
    teamId: 1,
    effortCompleted: 10,
    milestoneTotalEffort: 20,
    sprintEndDate: new Date('2023-08-05'),
    createdAt: new Date('2023-08-06'),
  },
  {
    id: 2,
    teamId: 1,
    effortCompleted: 15,
    milestoneTotalEffort: 30,
    sprintEndDate: new Date('2023-08-12'),
    createdAt: new Date('2023-08-13'),
  },
]

jest.mock('../database', () => {
  return {
    any: jest.fn(() => mockSprintData),
    none: jest.fn(),
  };
});

describe('sprintRepository', () => {
  let sprintRepository: SprintRepository;

  beforeEach(() => {
    sprintRepository = new SprintRepository();
  });

  describe('getSprints', () => {
    it('should fetch sprints', async () => {
      const sprints = await sprintRepository.getSprints();

      expect(sprints).toEqual(mockSprints);
    });
  });

  describe('getSprintsByTeam', () => {
    it('should fetch sprints by team', async () => {
      const teamId = 1;
      const expectedSprints = mockSprints.filter((sprint) => sprint.teamId === teamId);
      const sprints = await sprintRepository.getSprintsByTeam(teamId);

      expect(sprints).toEqual(expectedSprints);
    });
  });

  describe('createSprint', () => {
    it('should create a sprint', async () => {
      const teamId = 1;
      const effortCompleted = 10;
      const milestoneTotalEffort = 20;
      const sprintEndDate = new Date('2023-08-05');
      const sprint = await sprintRepository.createSprint(teamId, effortCompleted, milestoneTotalEffort, sprintEndDate);

      expect(sprint).toEqual({
        id: expect.any(Number),
        teamId,
        effortCompleted,
        milestoneTotalEffort,
        sprintEndDate,
        createdAt: expect.any(Date),
      });
    });
  });

  describe('updateSprint', () => {
    it('should update a sprint', async () => {
      const id = 1;
      const teamId = 2;
      const effortCompleted = 15;
      const milestoneTotalEffort = 30;
      const sprintEndDate = new Date();

      (db.any as jest.Mock).mockResolvedValue([
        {
          id: id,
          team_id: teamId,
          effort_completed: effortCompleted,
          milestone_total_effort: milestoneTotalEffort,
          sprint_end_date: sprintEndDate,
          created_at: new Date(),
        }
      ]);

      const sprint = await sprintRepository.updateSprint(id, teamId, effortCompleted, milestoneTotalEffort, sprintEndDate);

      expect(db.any).toHaveBeenCalledWith(
      'UPDATE sprints SET team_id = $1, effort_completed = $2, milestone_total_effort = $3, sprint_end_date = $4 WHERE id = $5 RETURNING *',
      [teamId, effortCompleted, milestoneTotalEffort, sprintEndDate, id]
    );

      expect(sprint).toEqual({
        id,
        teamId,
        effortCompleted,
        milestoneTotalEffort,
        sprintEndDate,
        createdAt: expect.any(Date),
      });
    });
  });

  describe('deleteSprint', () => {
    it('should delete a sprint', async () => {
      const id = 1;

      (db.none as jest.Mock).mockResolvedValue(undefined);

      await sprintRepository.deleteSprint(id);

      expect(db.none).toHaveBeenCalledWith('DELETE FROM sprints WHERE id = $1', [id]);
    });
  });
});
