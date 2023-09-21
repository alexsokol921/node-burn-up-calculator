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
      sampleSizeSprints.length,
      sortedSampleSizeSprints,
      sampleSize
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
    sampleSize: number,
    sortedSampleSizeSprints: Sprint[],
    fullSampleSize: number
  ): [number, number] {
    let lowVelocity;
    let highVelocity;

    switch (sampleSize) {
      case 2:
        lowVelocity = sortedSampleSizeSprints[0].effortCompleted;
        highVelocity = sortedSampleSizeSprints[1].effortCompleted;
        break;

      default:
        const lowSprints = sortedSampleSizeSprints.slice(0, Math.floor(fullSampleSize / 2) + 1);
        const highSprints = sortedSampleSizeSprints.slice(
          fullSampleSize - Math.floor(fullSampleSize / 2) - 1,
          fullSampleSize
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
