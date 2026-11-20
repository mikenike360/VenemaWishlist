import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'models');

function loadEnv() {
  if (process.env.POLY_PIZZA_API_KEY) return;
  const text = readFileSync(join(root, '.env'), 'utf8');
  for (const line of text.split('\n')) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
  }
}

const picks = [
  {
    file: 'gnome.glb',
    id: 'Yy3yuQ4l6r',
    query: 'gnome',
    note: 'Stand-in for the elves. No CC0 elf is listed; this gnome is tagged elf.',
  },
  {
    file: 'santa.glb',
    id: 'KtbHdsr07s',
    query: 'santa',
    note: 'CC0 Santa.',
  },
  {
    file: 'snowman.glb',
    id: 'UBldLFdI7l',
    query: 'snowman',
    note: 'CC0 snowman.',
  },
  {
    file: 'pine.glb',
    id: 'gX8WmgkeEm',
    query: 'pine',
    note: 'CC0 pine, used as a forest prop when needed.',
  },
  {
    file: 'lamp.glb',
    id: 'vPFSLYh6sg',
    query: 'streetlight',
    note: 'Streetlight. The CC0 model titled Lamp is a table lamp and does not read as a post.',
  },
  {
    file: 'car.glb',
    id: 'unqqkULtRU',
    query: 'car',
    note: 'CC0 car, scaled down to toy size in the scene.',
  },
  {
    file: 'gazebo.glb',
    id: 'xYZB1TmGMv',
    query: 'gazebo',
    note: 'Open timber shelter around the center tree. Closed cottages are a single mesh and would hide the tree.',
  },
  {
    file: 'pine-snow.glb',
    id: '17vQv2X5rh',
    query: 'snow',
    note: 'Snowy pine, kept as an alternate outdoor tree.',
  },
  {
    file: 'fireplace.glb',
    id: 'nzxZYIOCIr',
    query: 'fireplace',
    note: 'Living-room fireplace on the back wall.',
  },
  {
    file: 'couch.glb',
    id: 'mWgQ94zhDZ',
    query: 'couch',
    note: 'Medium couch along the left wall.',
  },
  {
    file: 'rug.glb',
    id: 'ZYBzMHnSbM',
    query: 'rug',
    note: 'Round rug under the tree and gift ring.',
  },
  {
    file: 'floor-lamp.glb',
    id: 'eBQtooeh43',
    query: 'lamp',
    note: 'Floor lamp beside the couch.',
  },
  {
    file: 'window.glb',
    id: 'EipzkrS9nG',
    query: 'window',
    note: 'Large window in the right-wall opening.',
  },
  {
    file: 'christmas-tree.glb',
    id: 'bmiq-VrAaCF',
    query: 'christmas',
    note: 'Indoor Christmas tree with star. Living-room centerpiece.',
  },
  {
    file: 'train-loco.glb',
    id: 'WY84FHug9s',
    query: 'locomotive',
    note: 'Miniature steam engine on the living-room floor oval.',
  },
  {
    file: 'train-wagon.glb',
    id: 'JCwr52pnuO',
    query: 'locomotive',
    note: 'Coal/tender wagon behind the miniature loco.',
  },
  {
    file: 'train-carriage.glb',
    id: 'woQPFlzPHM',
    query: 'locomotive',
    note: 'Passenger carriage completing the miniature consist.',
  },
];

async function withRetry(label, run, tries = 4) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      return await run();
    } catch (error) {
      last = error;
      await new Promise((resolve) => setTimeout(resolve, 700 * (i + 1)));
    }
  }
  throw new Error(`${label}: ${last?.message || last}`);
}

async function api(path) {
  const key = process.env.POLY_PIZZA_API_KEY;
  if (!key) throw new Error('POLY_PIZZA_API_KEY is missing');
  return withRetry(path, async () => {
    const response = await fetch(`https://api.poly.pizza/v1${path}`, {
      headers: { 'X-Auth-Token': key, Accept: 'application/json' },
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`${response.status} ${path}: ${body.slice(0, 180)}`);
    }
    return response.json();
  });
}

function isAllowedLicence(licence) {
  if (typeof licence !== 'string') return false;
  const upper = licence.toUpperCase();
  if (upper.includes('CC0')) return true;
  if (upper.includes('CC-BY') || upper.includes('CC BY')) return true;
  return false;
}

function isCcBy(licence) {
  if (typeof licence !== 'string') return false;
  const upper = licence.toUpperCase();
  return upper.includes('CC-BY') || upper.includes('CC BY');
}

async function searchHas(query, id) {
  try {
    const data = await api(`/search/${encodeURIComponent(query)}?limit=32`);
    const hit = (data.results || []).find((model) => model.ID === id);
    return hit ? hit.Licence || hit.License || 'listed' : 'not-in-page';
  } catch (error) {
    return `search-skipped (${error.message})`;
  }
}

loadEnv();
mkdirSync(outDir, { recursive: true });

const credits = [];

for (const pick of picks) {
  const listing = await searchHas(pick.query, pick.id);
  const model = await api(`/model/${pick.id}`);
  const licence = model.Licence || model.License || '';
  if (!isAllowedLicence(licence)) {
    throw new Error(`${pick.id} ${model.Title} is ${licence}, not CC0 or CC-BY`);
  }
  const downloadUrl = model.Download;
  if (!downloadUrl || !downloadUrl.startsWith('https://static.poly.pizza/')) {
    throw new Error(`${pick.id} has no Poly Pizza download URL`);
  }
  const bytes = await withRetry(`download ${pick.id}`, async () => {
    const fileResponse = await fetch(downloadUrl, { signal: AbortSignal.timeout(45000) });
    if (!fileResponse.ok) throw new Error(`download ${fileResponse.status} for ${pick.id}`);
    const buffer = Buffer.from(await fileResponse.arrayBuffer());
    if (buffer.subarray(0, 4).toString('utf8') !== 'glTF') {
      throw new Error(`${pick.id} download is not a GLB`);
    }
    return buffer;
  });
  writeFileSync(join(outDir, pick.file), bytes);
  const creator = model.Creator?.Username || 'unknown';
  credits.push({
    file: pick.file,
    title: model.Title,
    creator,
    id: model.ID,
    licence,
    triangles: model['Tri Count'],
    note: pick.note,
    search: listing,
    requiresAttribution: isCcBy(licence),
  });
  console.log(`${pick.file}  ${model.Title}  ${licence}  ${bytes.length} bytes  search=${listing}`);
}

const required = credits.filter((credit) => credit.requiresAttribution);
const free = credits.filter((credit) => !credit.requiresAttribution);

const lines = [
  '# Model credits',
  '',
  'These files were downloaded from Poly Pizza.',
  '',
];

if (required.length === 0) {
  lines.push('Attribution required: none.', '');
} else {
  lines.push('## Attribution required (CC-BY)', '');
  for (const credit of required) {
    lines.push(
      `- "${credit.title}" by ${credit.creator} (https://poly.pizza/m/${credit.id}) ${credit.licence}`,
    );
  }
  lines.push('');
}

lines.push('## Provenance', '');
for (const credit of credits) {
  lines.push(
    `- \`${credit.file}\` — "${credit.title}" by ${credit.creator} (https://poly.pizza/m/${credit.id}) ${credit.licence}. ${credit.triangles} triangles. ${credit.note}`,
  );
}
lines.push('');

writeFileSync(join(outDir, 'CREDITS.md'), lines.join('\n'));

const jsonCredits = credits.map((credit) => ({
  file: credit.file,
  title: credit.title,
  creator: credit.creator,
  id: credit.id,
  licence: credit.licence,
  url: `https://poly.pizza/m/${credit.id}`,
  requiresAttribution: credit.requiresAttribution,
  note: credit.note,
}));
writeFileSync(join(outDir, 'credits.json'), `${JSON.stringify(jsonCredits, null, 2)}\n`);

console.log(`wrote ${credits.length} models (${required.length} CC-BY)`);
