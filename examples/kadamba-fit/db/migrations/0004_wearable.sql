CREATE TABLE health_samples (
  member_ref UUID NOT NULL,
  device_serial TEXT NOT NULL,
  taken_at TIMESTAMPTZ NOT NULL,
  heart_rate SMALLINT,
  spo2 SMALLINT,
  sleep_minutes SMALLINT,
  steps INTEGER
) PARTITION BY RANGE (taken_at);

CREATE TABLE weekly_summaries (
  member_ref UUID NOT NULL,
  week_start DATE NOT NULL,
  step_total INTEGER NOT NULL,
  resting_hr_avg SMALLINT,
  sleep_minutes_avg SMALLINT,
  activity_tier TEXT NOT NULL CHECK (activity_tier IN ('low', 'medium', 'high')),
  PRIMARY KEY (member_ref, week_start)
);

CREATE TABLE cycle_logs (
  member_ref UUID NOT NULL,
  start_date DATE NOT NULL,
  symptoms TEXT[],
  notes TEXT,
  PRIMARY KEY (member_ref, start_date)
);
