const { randomUUID } = require('crypto');

const sessions = new Map();
const tourBookings = [];

function createSession() {
  const sessionId = randomUUID();
  const session = {
    id: sessionId,
    step: 'idle',
    data: {},
    createdAt: Date.now(),
  };
  sessions.set(sessionId, session);
  return session;
}

function getSession(sessionId) {
  if (!sessionId) return null;
  return sessions.get(sessionId) || null;
}

function saveTourBooking(payload) {
  const record = {
    id: randomUUID(),
    ...payload,
    createdAt: new Date().toISOString(),
  };
  tourBookings.push(record);
  console.log('[GUIDED_FLOW] Tour booking saved:', record);
  return record;
}

module.exports = {
  sessions,
  tourBookings,
  createSession,
  getSession,
  saveTourBooking,
};
