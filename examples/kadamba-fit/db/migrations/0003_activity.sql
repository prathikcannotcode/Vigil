CREATE TABLE workouts (
  id BIGSERIAL PRIMARY KEY,
  member_id BIGINT NOT NULL REFERENCES members(id),
  kind TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  duration_seconds INTEGER NOT NULL
);

CREATE TABLE route_tracks (
  id BIGSERIAL PRIMARY KEY,
  member_id BIGINT NOT NULL REFERENCES members(id),
  workout_id BIGINT NOT NULL REFERENCES workouts(id),
  points JSONB NOT NULL
);

CREATE TABLE bookings (
  id BIGSERIAL PRIMARY KEY,
  member_id BIGINT NOT NULL REFERENCES members(id),
  coach_id BIGINT NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL
);
