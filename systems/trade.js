export const tradeSystem = {
  id: 'trade',
  owns: ['market unlocks', 'exchange prices', 'trade routes', 'caravans', 'mercenaries'],
  qualityRule: 'Prices and caravan timers should update smoothly and be inspectable without forcing a tab rebuild.'
};

export function marketUnlocked(game) {
  return !!game.hasMarket;
}
