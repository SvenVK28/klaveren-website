// Validates public/admin/config.yml against the official Sveltia CMS JSON schema.
// Usage: npm run check:cms
import { readFile } from 'node:fs/promises';
import Ajv from 'ajv';
import { parse } from 'yaml';

const SCHEMA_URL = 'https://unpkg.com/@sveltia/cms@0.229.0/schema/sveltia-cms.json';

const config = parse(await readFile(new URL('../public/admin/config.yml', import.meta.url), 'utf8'));
const schema = await (await fetch(SCHEMA_URL)).json();

const ajv = new Ajv({ strict: false, allErrors: true, logger: false });
const validate = ajv.compile(schema);

if (validate(config)) {
  console.log('public/admin/config.yml is valid.');
} else {
  // anyOf branches produce many errors; the deepest paths are the useful ones.
  const errors = [...validate.errors].sort((a, b) => b.instancePath.length - a.instancePath.length);
  for (const error of errors.slice(0, 15)) {
    console.error(`${error.instancePath || '/'} ${error.message}`, error.params);
  }
  process.exitCode = 1;
}
