import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const baseline = JSON.parse(await readFile(new URL('docs/approved-baseline.json', root), 'utf8'));

test('a versão aprovada permanece íntegra, arquivo por arquivo', async () => {
  const differences = [];
  for (const { path, sha } of baseline.files) {
    try {
      const bytes = await readFile(new URL(path, root));
      const hash = createHash('sha1').update('blob ' + bytes.length + '\0').update(bytes).digest('hex');
      if (hash !== sha) differences.push(path + ': conteúdo alterado');
    } catch (error) {
      differences.push(path + ': ' + error.message);
    }
  }
  assert.deepEqual(differences, [], 'Mudança em arquivos da versão aprovada. Revise antes de atualizar a referência.');
});
