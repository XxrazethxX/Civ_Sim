export const simulationSystem = {
  id: 'simulation',
  owns: ['pacing harness', 'population milestone smoke tests', 'balance reports'],
  qualityRule: 'Simulation tests should be deterministic enough to compare milestones before and after balance changes.'
};

export function createPacingHarness({ game, tick, snapshot, prepareMilestone }) {
  const milestones = [10, 50, 200, 500, 2000];
  return {
    milestones,
    run({ maxTicksPerMilestone = 20000 } = {}) {
      const results = [];
      for (const target of milestones) {
        if (prepareMilestone) prepareMilestone(target);
        let ticks = 0;
        while ((game.population || 0) < target && ticks < maxTicksPerMilestone) {
          tick();
          ticks++;
        }
        results.push({ target, reached: (game.population || 0) >= target, ticks, snapshot: snapshot ? snapshot() : null });
      }
      return results;
    }
  };
}
