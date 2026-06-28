export const stateSystem = {
  id: 'state',
  owns: ['saveable game state', 'balance constants', 'progression thresholds', 'debug snapshots'],
  boundary: 'Simulation state is serializable data. DOM nodes, timers, and browser-only objects stay outside saves.'
};

export function cloneForSimulation(value) {
  return JSON.parse(JSON.stringify(value));
}

export function makePacingSnapshot(game, helpers = {}) {
  const stage = helpers.getProgressionStage ? helpers.getProgressionStage() : { label: 'Unknown', key: 'unknown' };
  const metrics = helpers.getPopulationMetrics ? helpers.getPopulationMetrics() : null;
  const production = helpers.getJobProduction ? helpers.getJobProduction() : null;
  return {
    time: game.time,
    population: game.population,
    stage: stage.label || stage.key,
    food: Math.floor(game.resources?.food || 0),
    wood: Math.floor(game.resources?.wood || 0),
    stone: Math.floor(game.resources?.stone || 0),
    housing: game.housing || 0,
    stability: metrics?.needs?.overall ?? null,
    foodNet: production ? Number((production.food - (helpers.getFoodConsumption?.() || 0)).toFixed(2)) : null
  };
}
