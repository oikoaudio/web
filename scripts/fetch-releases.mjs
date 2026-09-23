// Download the newest published release of each plugin into public/downloads/<product>/latest/.
// Every archive must match both the release's checksums.txt and its release.json.
import { createHash } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const repository = 'oikoaudio/oikoaudio';
const products = ['weft', 'wow', 'inton'];
const root = path.resolve(import.meta.dirname, '..');
const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;

async function request(url, accept) {
  const headers = { Accept: accept, 'User-Agent': 'oikoaudio-web' };
  // Only send the token to the API; asset downloads redirect to other hosts.
  if (token && url.startsWith('https://api.github.com/')) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`${url}: ${response.status} ${response.statusText}`);
  return response;
}

async function publishedReleases() {
  const releases = [];
  for (let page = 1; ; page += 1) {
    const response = await request(`https://api.github.com/repos/${repository}/releases?per_page=100&page=${page}`, 'application/vnd.github+json');
    const batch = await response.json();
    releases.push(...batch);
    if (batch.length < 100) return releases.filter((release) => !release.draft);
  }
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function parseChecksums(text) {
  return Object.fromEntries(text.trim().split(/\r?\n/).map((line) => {
    const [hash, name] = line.trim().split(/\s+/);
    return [name.replace(/^\*/, ''), hash];
  }));
}

async function fetchProduct(product, releases) {
  const prefix = `${product}/v`;
  const release = releases
    .filter((candidate) => candidate.tag_name.startsWith(prefix))
    .sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at))[0];
  if (!release) throw new Error(`No published ${product} release in ${repository}`);

  const files = new Map();
  for (const asset of release.assets) {
    const response = await request(asset.browser_download_url, 'application/octet-stream');
    files.set(asset.name, Buffer.from(await response.arrayBuffer()));
  }
  for (const required of ['release.json', 'checksums.txt']) {
    if (!files.has(required)) throw new Error(`${release.tag_name} has no ${required}`);
  }

  const metadata = JSON.parse(files.get('release.json').toString('utf8'));
  const version = release.tag_name.slice(prefix.length);
  if (metadata.version !== version) throw new Error(`${release.tag_name}: release.json declares version ${metadata.version}`);
  const checksums = parseChecksums(files.get('checksums.txt').toString('utf8'));
  const archives = metadata.files.map((file) => file.name);
  if (archives.length === 0 || [...archives].sort().join() !== Object.keys(checksums).sort().join()) {
    throw new Error(`${release.tag_name}: release.json and checksums.txt list different archives`);
  }
  for (const entry of metadata.files) {
    const bytes = files.get(entry.name);
    if (!bytes) throw new Error(`${release.tag_name}: missing ${entry.name}`);
    const digest = sha256(bytes);
    if (digest !== checksums[entry.name] || digest !== entry.sha256 || bytes.length !== entry.size) {
      throw new Error(`${release.tag_name}: ${entry.name} does not match its published checksum or size`);
    }
  }

  const directory = path.join(root, 'public/downloads', product, 'latest');
  await rm(directory, { recursive: true, force: true });
  await mkdir(directory, { recursive: true });
  for (const name of ['release.json', 'checksums.txt', ...archives]) {
    await writeFile(path.join(directory, name), files.get(name));
  }
  console.log(`${product}: ${release.tag_name} (${archives.length} archives verified)`);
}

const releases = await publishedReleases();
for (const product of products) await fetchProduct(product, releases);
