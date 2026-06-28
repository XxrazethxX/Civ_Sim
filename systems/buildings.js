export const buildingsSystem = {
  id: 'buildings',
  owns: ['building definitions', 'prerequisites', 'land use', 'conversions', 'build queue'],
  renderSurface: 'Buildings tab and Land Use modal',
  qualityRule: 'Construction should move through the queue; definitions should not mutate during render.'
};

export function summarizeBuildQueue(game) {
  const queue = Array.isArray(game.buildQueue) ? game.buildQueue : [];
  return {
    queued: queue.length,
    activeLimit: Math.max(1, game.modifiers?.buildParallelProjects || 1),
    resources: queue.reduce((totals, project) => {
      Object.entries(project.cost || {}).forEach(([resource, required]) => {
        const paid = project.paid?.[resource] || 0;
        totals[resource] = totals[resource] || { paid: 0, remaining: 0 };
        totals[resource].paid += Math.min(required, paid);
        totals[resource].remaining += Math.max(0, required - paid);
      });
      return totals;
    }, {})
  };
}
