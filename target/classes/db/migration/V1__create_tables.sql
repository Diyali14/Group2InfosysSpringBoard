-- ===========================================
-- USERS TABLE
-- ===========================================

CREATE TABLE users (
                       id BIGINT PRIMARY KEY AUTO_INCREMENT,

                       first_name VARCHAR(100) NOT NULL,
                       last_name VARCHAR(100),

                       username VARCHAR(100) NOT NULL UNIQUE,

                       email VARCHAR(150) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,

                       provider VARCHAR(20) DEFAULT 'LOCAL',

                       role VARCHAR(20) NOT NULL DEFAULT 'USER',

                       preferred_unit VARCHAR(20) DEFAULT 'kg',
                       goal_visibility BOOLEAN DEFAULT TRUE,
                       is_active BOOLEAN DEFAULT TRUE,

                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                           ON UPDATE CURRENT_TIMESTAMP
);

-- ===========================================
-- EMISSION FACTORS
-- ===========================================

CREATE TABLE emission_factors (
                                  id BIGINT PRIMARY KEY AUTO_INCREMENT,

                                  category VARCHAR(50) NOT NULL,
                                  activity_type VARCHAR(100) NOT NULL,
                                  unit VARCHAR(30) NOT NULL,

                                  factor DOUBLE NOT NULL,

                                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- ACTIVITY LOGS
-- ===========================================

CREATE TABLE activity_logs (
                               id BIGINT PRIMARY KEY AUTO_INCREMENT,

                               user_id BIGINT NOT NULL,

                               category VARCHAR(50) NOT NULL,
                               activity_type VARCHAR(100) NOT NULL,

                               quantity DOUBLE NOT NULL,
                               unit VARCHAR(30) NOT NULL,

                               log_date DATE NOT NULL,

                               co2e DOUBLE NOT NULL,

                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                               CONSTRAINT fk_activity_user
                                   FOREIGN KEY (user_id)
                                       REFERENCES users(id)
                                       ON DELETE CASCADE
);

-- ===========================================
-- GOALS
-- ===========================================

CREATE TABLE goals (
                       id BIGINT PRIMARY KEY AUTO_INCREMENT,

                       user_id BIGINT NOT NULL,

                       target_co2e DOUBLE NOT NULL,

                       start_date DATE NOT NULL,
                       end_date DATE NOT NULL,

                       status VARCHAR(30) DEFAULT 'ACTIVE',

                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                       CONSTRAINT fk_goal_user
                           FOREIGN KEY (user_id)
                               REFERENCES users(id)
                               ON DELETE CASCADE
);

-- ===========================================
-- BADGES
-- ===========================================

CREATE TABLE badges (
                        id BIGINT PRIMARY KEY AUTO_INCREMENT,

                        user_id BIGINT NOT NULL,

                        badge_name VARCHAR(100) NOT NULL,
                        description VARCHAR(255),

                        earned_date DATE,

                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                        CONSTRAINT fk_badge_user
                            FOREIGN KEY (user_id)
                                REFERENCES users(id)
                                ON DELETE CASCADE
);

-- ===========================================
-- INDEXES
-- ===========================================

CREATE INDEX idx_users_email
    ON users(email);

CREATE INDEX idx_activity_user
    ON activity_logs(user_id);

CREATE INDEX idx_goal_user
    ON goals(user_id);

CREATE INDEX idx_badge_user
    ON badges(user_id);

CREATE INDEX idx_emission_activity
    ON emission_factors(activity_type);