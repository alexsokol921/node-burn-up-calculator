import { Sprint } from '../models/Sprint';
import { SprintRepository } from '../repositories/sprintRepository';
import { VelocityCalculator } from '../utils/velocityCalculator';

export class SprintService {
  private sprintRepository: SprintRepository;
  private velocityCalculator: VelocityCalculator;

  constructor(
    sprintRepository: SprintRepository,
    velocityCalculator: VelocityCalculator
  ) {
    this.sprintRepository = sprintRepository;
    this.velocityCalculator = velocityCalculator;
  }

  async getSprints(page: number = 1, pageSize: number = 10): Promise<Sprint[]> {
    return await this.sprintRepository.getSprints(page, pageSize);
  }

  async getSprintsByTeam(
    teamId: number,
    page: number = 1,
    pageSize: number = 10
  ): Promise<Sprint[]> {
    return await this.sprintRepository.getSprintsByTeam(teamId, page, pageSize);
  }

  async createSprint(
    teamId: number,
    effortCompleted: number,
    milestoneTotalEffort: number,
    sprintEndDate: Date
  ): Promise<Sprint> {
    return await this.sprintRepository.createSprint(
      teamId,
      effortCompleted,
      milestoneTotalEffort,
      sprintEndDate
    );
  }

  async updateSprint(
    id: number,
    teamId: number,
    effortCompleted: number,
    milestoneTotalEffort: number,
    sprintEndDate: Date
  ): Promise<Sprint> {
    return await this.sprintRepository.updateSprint(
      id,
      teamId,
      effortCompleted,
      milestoneTotalEffort,
      sprintEndDate
    );
  }

  async deleteSprint(id: number): Promise<void> {
    await this.sprintRepository.deleteSprint(id);
  }

  async calculateVelocityForTeam(
    teamId: number,
    sampleSize: number
  ): Promise<[Sprint[], number, number, number]> {
    const sprints = await this.getSprintsByTeam(teamId);
    const [lowVelocity, averageVelocity, highVelocity] =
      this.velocityCalculator.calculateVelocity(sprints, sampleSize);

    return [sprints, lowVelocity, averageVelocity, highVelocity];
  }
}
