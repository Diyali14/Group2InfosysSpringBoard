ALTER TABLE goals
    ADD COLUMN target_reduction_percentage DOUBLE DEFAULT NULL;

ALTER TABLE goals
    ADD COLUMN current_progress DOUBLE DEFAULT 0;

ALTER TABLE goals
    ADD COLUMN on_track BOOLEAN DEFAULT TRUE;