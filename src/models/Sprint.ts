export interface Sprint {
  id?: number;
  teamId: number;
  effortCompleted: number;
  milestoneTotalEffort: number;
  sprintEndDate: Date;
  createdAt?: Date;
}

export interface SprintData {
  id: number;
  team_id: number;
  effort_completed: number;
  milestone_total_effort: number;
  sprint_end_date: Date;
  created_at: Date;
}
