-- 🏗️ AuraHR Enterprise PostgreSQL Schema
-- Generated for High-Fidelity HR Management Platform

-- 1. Create Schemas
CREATE SCHEMA IF NOT EXISTS employee_data;
CREATE SCHEMA IF NOT EXISTS tech_leads_data;
CREATE SCHEMA IF NOT EXISTS common_data;

-- 2. ENUMS & Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. employee_data.employees
CREATE TABLE employee_data.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(50) CHECK (role IN ('employee', 'tech_lead', 'hr', 'manager')),
    department VARCHAR(100),
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_leaves INT DEFAULT 20,
    leaves_taken INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. employee_data.leaves
CREATE TABLE employee_data.leaves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employee_data.employees(id) ON DELETE CASCADE,
    leave_type VARCHAR(50) CHECK (leave_type IN ('sick', 'casual', 'emergency', 'uninformed')),
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    hr_reason TEXT,
    is_uninformed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. common_data.files
CREATE TABLE common_data.files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employee_data.employees(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) CHECK (file_type IN ('image', 'video', 'document', 'zip')),
    file_path TEXT NOT NULL,
    file_size BIGINT, -- in bytes
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. employee_data.leave_documents
CREATE TABLE employee_data.leave_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leave_id UUID REFERENCES employee_data.leaves(id) ON DELETE CASCADE,
    file_id UUID REFERENCES common_data.files(id) ON DELETE CASCADE,
    verified_by_hr BOOLEAN DEFAULT FALSE,
    remarks TEXT
);

-- 7. tech_leads_data.tech_leads
CREATE TABLE tech_leads_data.tech_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID UNIQUE REFERENCES employee_data.employees(id),
    name VARCHAR(255) NOT NULL,
    team_name VARCHAR(100),
    assigned_employees UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. common_data.login_logs
CREATE TABLE common_data.login_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employee_data.employees(id) ON DELETE CASCADE,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP WITH TIME ZONE,
    ip_address VARCHAR(45),
    device_info TEXT
);

-- 9. common_data.chat_messages
CREATE TABLE common_data.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES employee_data.employees(id),
    receiver_id UUID REFERENCES employee_data.employees(id),
    message TEXT,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image', 'video')),
    file_url TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. common_data.emails
CREATE TABLE common_data.emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES employee_data.employees(id),
    receiver_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    body TEXT,
    attachments_url TEXT[],
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. common_data.employee_stats
CREATE TABLE common_data.employee_stats (
    employee_id UUID PRIMARY KEY REFERENCES employee_data.employees(id) ON DELETE CASCADE,
    total_logins INT DEFAULT 0,
    total_leaves_taken INT DEFAULT 0,
    total_uninformed_leaves INT DEFAULT 0,
    last_login TIMESTAMP WITH TIME ZONE
);

-- 🤖 AUTOMATION LOGIC (Triggers)

-- A. Update Leave Balances on Approval
CREATE OR REPLACE FUNCTION employee_data.fn_on_leave_approval()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.status = 'approved' AND OLD.status != 'approved') THEN
        -- Update Employee Table
        UPDATE employee_data.employees 
        SET leaves_taken = leaves_taken + (NEW.to_date - NEW.from_date + 1)
        WHERE id = NEW.employee_id;
        
        -- Update Stats Table
        UPDATE common_data.employee_stats
        SET total_leaves_taken = total_leaves_taken + (NEW.to_date - NEW.from_date + 1)
        WHERE employee_id = NEW.employee_id;

        IF (NEW.is_uninformed) THEN
            UPDATE common_data.employee_stats
            SET total_uninformed_leaves = total_uninformed_leaves + 1
            WHERE employee_id = NEW.employee_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_leave_approval
AFTER UPDATE ON employee_data.leaves
FOR EACH ROW
EXECUTE FUNCTION employee_data.fn_on_leave_approval();

-- B. Update Login Stats on Login
CREATE OR REPLACE FUNCTION common_data.fn_on_login()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO common_data.employee_stats (employee_id, total_logins, last_login)
    VALUES (NEW.employee_id, 1, NEW.login_time)
    ON CONFLICT (employee_id) DO UPDATE 
    SET total_logins = common_data.employee_stats.total_logins + 1,
        last_login = NEW.login_time;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_login_stat
AFTER INSERT ON common_data.login_logs
FOR EACH ROW
EXECUTE FUNCTION common_data.fn_on_login();

-- C. Auto-init stats for new employees
CREATE OR REPLACE FUNCTION employee_data.fn_init_stats()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO common_data.employee_stats (employee_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_init_employee_stats
AFTER INSERT ON employee_data.employees
FOR EACH ROW
EXECUTE FUNCTION employee_data.fn_init_stats();

-- 📊 SEED DATA
INSERT INTO employee_data.employees (name, email, password, role, department)
VALUES 
('Aarav Mehta', 'ceo@aurahr.com', '$2b$10$xyz...', 'hr', 'Executive'),
('Nisha Kapoor', 'hr@aurahr.com', '$2b$10$xyz...', 'hr', 'People Ops'),
('Rohit Sen', 'manager@aurahr.com', '$2b$10$xyz...', 'manager', 'Engineering'),
('Kabir Rao', 'employee@aurahr.com', '$2b$10$xyz...', 'employee', 'Engineering');

-- 12. PROJECT MANAGEMENT TABLES (Enterprise Upgrade)

-- A. projects
CREATE TABLE common_data.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'In Progress' CHECK (status IN ('In Progress', 'On Hold', 'Completed')),
    progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- B. project_employees (Junction Table)
CREATE TABLE common_data.project_employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES common_data.projects(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employee_data.employees(id) ON DELETE CASCADE,
    UNIQUE(project_id, employee_id)
);

-- C. project_files
CREATE TABLE common_data.project_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES common_data.projects(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_path TEXT NOT NULL,
    uploaded_by UUID REFERENCES employee_data.employees(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- D. Initial Project Seed
INSERT INTO common_data.projects (name, description, status, progress, start_date)
VALUES 
('ALPHA DEPLOYMENT', 'Main infrastructure rollout for the new cloud region.', 'In Progress', 65, '2026-04-01'),
('SECURITY AUDIT V4', 'Quarterly compliance and penetration testing.', 'In Progress', 40, '2026-04-15'),
('UI/UX OVERHAUL', 'Revamping the employee hub for better accessibility.', 'On Hold', 15, '2026-05-01');
