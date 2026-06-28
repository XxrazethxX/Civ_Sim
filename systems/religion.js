export const religionSystem = {
  id: 'religion',
  owns: ['religious law', 'deities', 'faith spending', 'rituals', 'doctrine', 'favor'],
  qualityRule: 'Religion should stay wizard-like: choose law first, deity only when the law requires one.'
};

export function religionSummary(game) {
  return {
    law: game.policies?.religion || game.religiousLaw || 'neutral',
    deity: game.deity || null,
    faith: Math.floor(game.resources?.faith || 0)
  };
}
