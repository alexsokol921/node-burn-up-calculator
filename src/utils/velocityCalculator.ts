import { Sprint } from '../models/Sprint';

export class VelocityCalculator {
  calculateVelocity(sprints: Sprint[], sampleSize: number): [number, number, number] {
    if (sprints.length === 0 || sampleSize <= 0) {
      return [0, 0, 0];
    }

    // Sort sprints by sprintEndDate for a teamId
    const sortedSprints = this.sortSprintsByEndDate(sprints);

    // Calculate sample start and end indices
    const startIndex = Math.max(0, sortedSprints.length - sampleSize);
    const endIndex = sortedSprints.length;

    // Get sampleSize sprints
    const sampleSizeSprints = sortedSprints.slice(startIndex, endIndex);

    // Sort sampleSizeSprints by effortCompleted
    const sortedSampleSizeSprints = this.sortSprintsByEffort(sampleSizeSprints);

    // Calculate low, average, and high velocity
    const [lowVelocity, highVelocity] = this.calculateLowHighVelocity(
      sortedSampleSizeSprints
    );

    const totalEffort = this.calculateTotalEffort(sampleSizeSprints);

    const averageVelocity = totalEffort / sampleSizeSprints.length;

    return [lowVelocity, averageVelocity, highVelocity];
  }

  private sortSprintsByEndDate(sprints: Sprint[]): Sprint[] {
    return sprints.slice().sort((a, b) => a.sprintEndDate.getTime() - b.sprintEndDate.getTime());
  }

  private sortSprintsByEffort(sprints: Sprint[]): Sprint[] {
    return sprints.slice().sort((a, b) => a.effortCompleted - b.effortCompleted);
  }

  private calculateLowHighVelocity(
    sortedSprints: Sprint[]
  ): [number, number] {
    const sprintCount = sortedSprints.length;
    let lowVelocity;
    let highVelocity;

    switch (sprintCount) {
      case 2:
        lowVelocity = sortedSprints[0].effortCompleted;
        highVelocity = sortedSprints[1].effortCompleted;
        break;

      default:
        const lowSprints = sortedSprints.slice(0, Math.floor(sprintCount / 2) + 1);
        const highSprints = sortedSprints.slice(
          sprintCount - Math.floor(sprintCount / 2) - 1,
          sprintCount
        );

        const lowSum = this.calculateEffortSum(lowSprints);
        const highSum = this.calculateEffortSum(highSprints);

        lowVelocity = lowSum / lowSprints.length;
        highVelocity = highSum / highSprints.length;
        break;
    }

    return [lowVelocity, highVelocity];
  }

  private calculateTotalEffort(sprints: Sprint[]): number {
    return sprints.reduce((sum, sprint) => sum + sprint.effortCompleted, 0);
  }

  private calculateEffortSum(sprints: Sprint[]): number {
    return sprints.reduce((sum, sprint) => sum + sprint.effortCompleted, 0);
  }
}
