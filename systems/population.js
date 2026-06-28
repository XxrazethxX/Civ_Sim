export const populationSystem = {
  id: 'population',
  owns: ['worker records', 'ages', 'classes', 'jobs', 'births', 'deaths', 'migration', 'social pressure'],
  canonical: 'workers[] records are the source of truth; aggregate age/class/job objects are derived compatibility views.'
};

const AGE_KEYS = ['children', 'adults', 'elders'];
const CLASS_KEYS = ['peasants', 'skilled', 'elites'];

function nextWorkerId(game) {
  game.workerSeq = Math.max(0, Number(game.workerSeq) || 0) + 1;
  return `w${game.workerSeq}`;
}

function normalizeAge(age) {
  return AGE_KEYS.includes(age) ? age : 'adults';
}

function normalizeClass(classType) {
  return CLASS_KEYS.includes(classType) ? classType : 'peasants';
}

function normalizeJob(game, job) {
  return game.jobs && Object.prototype.hasOwnProperty.call(game.jobs, job) ? job : 'idle';
}

export function createWorker(game, { age = 'adults', classType = 'peasants', job = 'idle', injured = 0 } = {}) {
  return {
    id: nextWorkerId(game),
    age: normalizeAge(age),
    classType: normalizeClass(classType),
    job: normalizeJob(game, job),
    injured: Math.max(0, Math.floor(Number(injured) || 0))
  };
}

function pushWorkers(game, count, template) {
  const n = Math.max(0, Math.floor(Number(count) || 0));
  for (let i = 0; i < n; i++) game.workers.push(createWorker(game, template));
}

export function migrateAggregatesToWorkers(game) {
  game.workers = [];
  game.workerSeq = 0;
  const jobs = Object.keys(game.jobs || { idle: 0 });
  const jobAges = game.jobAges || {};
  const classJobs = game.classJobs || {};
  for (const job of jobs) {
    const total = Math.max(0, Math.floor(game.jobs[job] || 0));
    if (!total) continue;
    const ages = jobAges[job] || { adults: total };
    const classes = classJobs[job] || { peasants: total };
    const agePool = [];
    AGE_KEYS.forEach(age => pushWorkers({ workers: agePool, jobs: game.jobs, workerSeq: game.workerSeq }, 0));
    AGE_KEYS.forEach(age => {
      for (let i = 0; i < Math.max(0, Math.floor(ages[age] || 0)); i++) agePool.push(age);
    });
    while (agePool.length < total) agePool.push('adults');
    const classPool = [];
    CLASS_KEYS.forEach(classType => {
      for (let i = 0; i < Math.max(0, Math.floor(classes[classType] || 0)); i++) classPool.push(classType);
    });
    while (classPool.length < total) classPool.push('peasants');
    for (let i = 0; i < total; i++) pushWorkers(game, 1, { age: agePool[i], classType: classPool[i], job });
  }
  const tracked = game.workers.length;
  const population = Math.max(0, Math.floor(game.population || 0));
  if (tracked < population) pushWorkers(game, population - tracked, { age: 'adults', classType: 'peasants', job: 'idle' });
  return game.workers;
}

export function ensureWorkerRecords(game) {
  if (!Array.isArray(game.workers) || !game.workers.length) migrateAggregatesToWorkers(game);
  game.workers = game.workers.filter(Boolean).map(worker => ({
    id: worker.id || nextWorkerId(game),
    age: normalizeAge(worker.age),
    classType: normalizeClass(worker.classType),
    job: normalizeJob(game, worker.job),
    injured: Math.max(0, Math.floor(Number(worker.injured) || 0))
  }));
  return game.workers;
}

export function applyWorkerRecordsToGame(game) {
  ensureWorkerRecords(game);
  const jobs = Object.keys(game.jobs || { idle: 0 });
  const ages = { children: 0, adults: 0, elders: 0 };
  const classes = { peasants: 0, skilled: 0, elites: 0 };
  const jobTotals = Object.fromEntries(jobs.map(job => [job, 0]));
  const jobAges = Object.fromEntries(jobs.map(job => [job, { adults: 0, children: 0, elders: 0 }]));
  const classJobs = Object.fromEntries(jobs.map(job => [job, { peasants: 0, skilled: 0, elites: 0 }]));
  for (const worker of game.workers) {
    const job = normalizeJob(game, worker.job);
    const age = normalizeAge(worker.age);
    const classType = normalizeClass(worker.classType);
    ages[age]++;
    classes[classType]++;
    jobTotals[job] = (jobTotals[job] || 0) + 1;
    jobAges[job] = jobAges[job] || { adults: 0, children: 0, elders: 0 };
    jobAges[job][age]++;
    classJobs[job] = classJobs[job] || { peasants: 0, skilled: 0, elites: 0 };
    classJobs[job][classType]++;
  }
  game.population = game.workers.length;
  game.ages = Object.assign(game.ages || {}, ages);
  game.classes = Object.assign(game.classes || {}, classes);
  Object.assign(game.jobs, jobTotals);
  game.jobAges = jobAges;
  game.classJobs = classJobs;
  return game;
}

export function addWorkerRecord(game, template) {
  ensureWorkerRecords(game);
  game.workers.push(createWorker(game, template));
  applyWorkerRecordsToGame(game);
  return game.workers[game.workers.length - 1];
}

export function removeWorkerRecords(game, { age, classType, job, count = 1 } = {}) {
  ensureWorkerRecords(game);
  let left = Math.max(0, Math.floor(Number(count) || 0));
  const removed = [];
  game.workers = game.workers.filter(worker => {
    if (left <= 0) return true;
    if (age && worker.age !== age) return true;
    if (classType && worker.classType !== classType) return true;
    if (job && worker.job !== job) return true;
    removed.push(worker);
    left--;
    return false;
  });
  applyWorkerRecordsToGame(game);
  return removed;
}

export function assignWorkerRecords(game, { from = 'idle', to = 'idle', age, classType, count = 1 } = {}) {
  ensureWorkerRecords(game);
  let left = Math.max(0, Math.floor(Number(count) || 0));
  let moved = 0;
  for (const worker of game.workers) {
    if (left <= 0) break;
    if (from && worker.job !== from) continue;
    if (age && worker.age !== age) continue;
    if (classType && worker.classType !== classType) continue;
    worker.job = normalizeJob(game, to);
    left--;
    moved++;
  }
  applyWorkerRecordsToGame(game);
  return moved;
}

export function ageWorkerRecords(game, { from = 'children', to = 'adults', job, count = 1 } = {}) {
  ensureWorkerRecords(game);
  let left = Math.max(0, Math.floor(Number(count) || 0));
  let changed = 0;
  for (const worker of game.workers) {
    if (left <= 0) break;
    if (worker.age !== from) continue;
    worker.age = normalizeAge(to);
    worker.job = job ? normalizeJob(game, job) : normalizeJob(game, worker.job);
    left--;
    changed++;
  }
  applyWorkerRecordsToGame(game);
  return changed;
}
