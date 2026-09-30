-- Regulatory Intelligence schema initialization

CREATE TABLE IF NOT EXISTS regulatory_sources (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url TEXT,
    authority VARCHAR(255),
    source_type VARCHAR(50),
    retrieved_at TIMESTAMP,
    publication_date DATE,
    effective_date DATE,
    version VARCHAR(50),
    hash VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS regulatory_departments (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    level VARCHAR(50),
    state VARCHAR(100),
    portal TEXT
);

CREATE TABLE IF NOT EXISTS regulatory_approvals (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    authority VARCHAR(255),
    department_id VARCHAR(50) REFERENCES regulatory_departments(id),
    jurisdiction VARCHAR(100),
    stage VARCHAR(50),
    source_id VARCHAR(50) REFERENCES regulatory_sources(id),
    effective_from DATE,
    effective_to DATE,
    status VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS approval_recommendations (
    id SERIAL PRIMARY KEY,
    project_id UUID REFERENCES project_sites(id),
    approval_id VARCHAR(50) REFERENCES regulatory_approvals(id),
    status VARCHAR(50),
    reason TEXT,
    confidence NUMERIC,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_regulatory_approvals_jurisdiction ON regulatory_approvals(jurisdiction);
CREATE INDEX idx_approval_recommendations_project ON approval_recommendations(project_id);
