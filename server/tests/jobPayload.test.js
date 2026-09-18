import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeJobPayload } from '../src/services/jobPayload.js';

test('normalizeJobPayload parses comma-separated skills and valid deadline strings', () => {
  const payload = normalizeJobPayload({
    title: ' Frontend Engineer ',
    description: 'Build UI',
    skillsRequired: 'React, Node.js, SQL',
    package: ' 12 LPA ',
    location: ' Remote ',
    applicationDeadline: '2026-12-31',
  });

  assert.deepEqual(payload.skillsRequired, ['React', 'Node.js', 'SQL']);
  assert.equal(payload.title, 'Frontend Engineer');
  assert.equal(payload.package, '12 LPA');
  assert.equal(payload.location, 'Remote');
  assert.equal(payload.applicationDeadline, '2026-12-31T00:00:00.000Z');
});

test('normalizeJobPayload rejects invalid date values', () => {
  assert.throws(() => {
    normalizeJobPayload({
      title: 'Engineer',
      description: 'Work',
      skillsRequired: ['React'],
      package: '10 LPA',
      location: 'Remote',
      applicationDeadline: 'not-a-date',
    });
  }, /valid date/i);
});
