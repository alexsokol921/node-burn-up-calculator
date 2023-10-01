import { VelocityCalculator } from './velocityCalculator';
import { Sprint } from '../models/Sprint';

describe('VelocityCalculator', () => {
  const velocityCalculator = new VelocityCalculator();

  it('calculates velocities correctly', () => {
    const sprints: Sprint[] = [
      {
        teamId: 1,
        effortCompleted: 5,
        milestoneTotalEffort: 140,
        sprintEndDate: new Date('2023-08-5'),
      },
      {
        teamId: 1,
        effortCompleted: 8,
        milestoneTotalEffort: 140,
        sprintEndDate: new Date('2023-08-12'),
      },
      {
        teamId: 1,
        effortCompleted: 3,
        milestoneTotalEffort: 140,
        sprintEndDate: new Date('2023-08-19'),
      },
      {
        teamId: 1,
        effortCompleted: 12,
        milestoneTotalEffort: 140,
        sprintEndDate: new Date('2023-08-26'),
      },
    ];
    const sampleSize = 3;

    const [low, average, high] = velocityCalculator.calculateVelocity(
      sprints,
      sampleSize
    );

    expect(low).toBe(5.5);
    expect(average).toBeCloseTo(7.67);
    expect(high).toBe(10);
  });

  it('handles empty sprints', () => {
    const sprints: Sprint[] = [];
    const sampleSize = 3;

    const [low, average, high] = velocityCalculator.calculateVelocity(
      sprints,
      sampleSize
    );

    expect(low).toBe(0);
    expect(average).toBe(0);
    expect(high).toBe(0);
  });

  it('handles sampleSize of 2', () => {
    const sprints: Sprint[] = [
      {
        teamId: 1,
        effortCompleted: 6,
        milestoneTotalEffort: 140,
        sprintEndDate: new Date('2023-08-5'),
      },
      {
        teamId: 1,
        effortCompleted: 8,
        milestoneTotalEffort: 140,
        sprintEndDate: new Date('2023-08-12'),
      },
    ];
    const sampleSize = 2;

    const [low, average, high] = velocityCalculator.calculateVelocity(
      sprints,
      sampleSize
    );

    expect(low).toBe(6);
    expect(average).toBeCloseTo(7);
    expect(high).toBe(8);
  });

  it('handles sampleSize greater than sprints length', () => {
    const sprints: Sprint[] = [
      {
        teamId: 1,
        effortCompleted: 5,
        milestoneTotalEffort: 140,
        sprintEndDate: new Date('2023-08-5'),
      },
    ];
    const sampleSize = 3;

    const [low, average, high] = velocityCalculator.calculateVelocity(
      sprints,
      sampleSize
    );

    expect(low).toBe(5);
    expect(average).toBe(5);
    expect(high).toBe(5);
  });
});
