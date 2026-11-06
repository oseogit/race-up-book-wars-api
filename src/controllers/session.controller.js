const { matchedData } = require('express-validator');
const sessionService = require('../services/session.service');

function toJson(session) {
  return {
    session_id: session.session_id,
    host_user_id: session.host_user_id,
    set_id: session.set_id,
    join_code: session.join_code,
    status: session.status,
    time_limit_sec: session.time_limit_sec,
    created_at: session.created_at,
    started_at: session.started_at,
    ended_at: session.ended_at,
  };
}

async function createSession(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const session = await sessionService.createSession(data, req.user);

  res.status(201).json({ session: toJson(session) });
}

async function getSession(req, res) {
  const { code } = matchedData(req, { locations: ['params'] });
  const session = await sessionService.findSession(code);

  res.status(200).json({ session: toJson(session) });
}

async function updateSession(req, res) {
  const { code } = matchedData(req, { locations: ['params'] });
  const changes = matchedData(req, { locations: ['body'] });

  const session = await sessionService.updateSession(code, changes, req.user);

  res.status(200).json({ session: toJson(session) });
}

module.exports = {
  createSession,
  getSession,
  updateSession,
};