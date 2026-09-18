export const normalizeJobPayload = (payload = {}) => {
  const rawSkills = Array.isArray(payload.skillsRequired)
    ? payload.skillsRequired
    : typeof payload.skillsRequired === 'string'
      ? payload.skillsRequired.split(',')
      : [];

  const normalized = {
    title: String(payload.title || '').trim(),
    description: String(payload.description || '').trim(),
    skillsRequired: rawSkills
      .map((skill) => String(skill).trim())
      .filter(Boolean),
    experienceRequired: String(payload.experienceRequired || 'Entry level').trim() || 'Entry level',
    package: String(payload.package || '').trim(),
    location: String(payload.location || '').trim(),
    applicationDeadline: payload.applicationDeadline,
  };

  if (!normalized.title || !normalized.description || !normalized.package || !normalized.location) {
    throw new Error('Job title, description, package, and location are required.');
  }

  if (!normalized.skillsRequired.length) {
    throw new Error('Please add at least one skill requirement.');
  }

  if (!normalized.applicationDeadline) {
    throw new Error('Application deadline is required.');
  }

  const date = new Date(normalized.applicationDeadline);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Application deadline must be a valid date.');
  }

  normalized.applicationDeadline = new Date(date).toISOString();

  return normalized;
};

export default normalizeJobPayload;
