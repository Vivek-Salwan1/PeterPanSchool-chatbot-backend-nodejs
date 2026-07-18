# Peter Pan Schools Chatbot API

Express API for the Peter Pan Schools chatbot and guided admissions flow.

## Setup

1. Copy `.env.example` to `.env` and supply Azure OpenAI credentials.
2. Run `npm install`.
3. Run `npm start`.

## Endpoints

- `GET /` — service status
- `POST /api/chat/hello` — chatbot greeting
- `POST /api/chat` — AI-backed school question (`{ "message": "..." }`)
- `POST /api/guided-flow` — guided admissions flow

## Structure

- `src/config` — environment configuration
- `src/constants` — domain constants and prompts
- `src/controllers` — HTTP request/response handling
- `src/middleware` — request logging and centralized errors
- `src/routes` — endpoint registration
- `src/services` — AI orchestration and website-context retrieval
- `services/guidedFlow` — guided-flow domain engine, validation, and session store

Guided-flow sessions and tour bookings are currently in memory. For multi-instance production deployments, replace that store with a shared persistent repository (for example Redis plus a database) before deploying.
