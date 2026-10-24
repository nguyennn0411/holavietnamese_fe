import test from 'node:test';
import assert from 'node:assert/strict';
import { Enrollment } from '../src/models/Enrollment.js';

test('all active learning states count as enrolled', () => {
  for (const status of ['ACTIVE', 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']) {
    assert.equal(new Enrollment({ status }).isEnrolled, true, status);
  }
});

test('cancelled, dropped and missing states do not count as enrolled', () => {
  for (const status of ['CANCELLED', 'DROPPED', undefined, null]) {
    assert.equal(new Enrollment({ status }).isEnrolled, false, String(status));
  }
});
