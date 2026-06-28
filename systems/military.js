export const militarySystem = {
  id: 'military',
  owns: ['raid threat', 'raid battles', 'unit matchups', 'conquest map', 'scouting'],
  qualityRule: 'Combat should expose readable tactical causes and never require a full tab rerender while a modal battle is active.'
};

export function summarizeForces(jobs = {}) {
  return {
    frontline: (jobs.guard || 0) + (jobs.soldier || 0) + (jobs.grunt || 0),
    ranged: jobs.archer || 0,
    support: (jobs.scout || 0) + (jobs.medic || 0),
    siege: jobs.sapper || 0
  };
}
