import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  canImportVocabulary,
  canManageExploreLinks,
  canReadExplore,
  canReadVocabulary,
  canReviewExplore,
  canReviewVocabulary,
  canWriteExplore,
  canWriteVocabulary,
} from '../src/utils/permissions/contentAccess.js';

test('administrator can read and review but cannot edit Vocabulary or Explore', () => {
  const administrator = { roles: ['ADMIN'], permissions: [] };
  assert.equal(canReadVocabulary(administrator), true);
  assert.equal(canWriteVocabulary(administrator), false);
  assert.equal(canImportVocabulary(administrator), false);
  assert.equal(canReviewVocabulary(administrator), true);
  assert.equal(canReadExplore(administrator), true);
  assert.equal(canWriteExplore(administrator), false);
  assert.equal(canManageExploreLinks(administrator), false);
  assert.equal(canReviewExplore(administrator), true);
});

test('content manager receives the module management baseline', () => {
  const manager = { roles: ['CONTENT_MANAGER'], permissions: [] };
  assert.equal(canReadVocabulary(manager), true);
  assert.equal(canWriteVocabulary(manager), true);
  assert.equal(canImportVocabulary(manager), true);
  assert.equal(canReadExplore(manager), true);
  assert.equal(canWriteExplore(manager), true);
  assert.equal(canManageExploreLinks(manager), true);
});

test('an administrator can receive a narrowly scoped content permission', () => {
  const vocabularyReader = { roles: ['ADMIN'], permissions: ['VOCABULARY_READ'] };
  const exploreLinkManager = { roles: ['ADMIN'], permissions: ['EXPLORE_LINK_WRITE'] };
  assert.equal(canReadVocabulary(vocabularyReader), true);
  assert.equal(canWriteVocabulary(vocabularyReader), false);
  assert.equal(canReadExplore(exploreLinkManager), true);
  assert.equal(canManageExploreLinks(exploreLinkManager), true);
  assert.equal(canWriteExplore(exploreLinkManager), false);
});

test('content managers can view Vocabulary import history without requesting Admin-only course imports', () => {
  const page = readFileSync(new URL('../src/pages/admin/AdminImportHistoryPage.jsx', import.meta.url), 'utf8');
  const route = readFileSync(new URL('../src/components/common/AdminRoute.jsx', import.meta.url), 'utf8');

  assert.match(route, /importPath \? canImportVocabulary\(user\)/);
  assert.match(page, /mayViewWebsiteImports \? websiteImportService\.history/);
  assert.match(page, /mayViewWebsiteImports && <ResourceState resource=\{websiteResource\}>/);
});
