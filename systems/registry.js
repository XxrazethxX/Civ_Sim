import { stateSystem } from './state.js';
import { buildingsSystem } from './buildings.js';
import { populationSystem } from './population.js';
import { militarySystem } from './military.js';
import { tradeSystem } from './trade.js';
import { religionSystem } from './religion.js';
import { uiSystem } from './ui.js';
import { simulationSystem } from './simulation.js';

export const SYSTEM_MODULES = {
  state: stateSystem,
  buildings: buildingsSystem,
  population: populationSystem,
  military: militarySystem,
  trade: tradeSystem,
  religion: religionSystem,
  ui: uiSystem,
  simulation: simulationSystem
};
