import { query } from './db_config';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

export const pgService = {
  // --- 👤 EMPLOYEE CRUD ---
  async createEmployee(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const sql = `
      INSERT INTO employee_data.employees (name, email, password, role, department, joining_date)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role;
    `;
    const res = await query(sql, [data.name, data.email, hashedPassword, data.role, data.department, data.joiningDate]);
    return res.rows[0];
  },

  async getEmployeeById(id: string) {
    const sql = `SELECT id, name, email, role, department, total_leaves, leaves_taken FROM employee_data.employees WHERE id = $1`;
    const res = await query(sql, [id]);
    return res.rows[0];
  },

  // --- 🌴 LEAVE MANAGEMENT ---
  async applyLeave(data: any) {
    const sql = `
      INSERT INTO employee_data.leaves (employee_id, leave_type, from_date, to_date, reason, status)
      VALUES ($1, $2, $3, $4, $5, 'PENDING') RETURNING *;
    `;
    const res = await query(sql, [data.employeeId, data.type, data.from, data.to, data.reason]);
    return res.rows[0];
  },

  async getMyRequests(employeeId: string) {
    const sql = `SELECT * FROM employee_data.leaves WHERE employee_id = $1 ORDER BY created_at DESC`;
    const res = await query(sql, [employeeId]);
    return res.rows;
  },

  async getAllRequests() {
    const sql = `
      SELECT l.*, e.name as employee_name, e.email as employee_email 
      FROM employee_data.leaves l 
      JOIN employee_data.employees e ON l.employee_id = e.id 
      ORDER BY l.created_at DESC
    `;
    const res = await query(sql);
    return res.rows;
  },

  async updateLeaveStatus(id: string, status: string, hrReason: string) {
    const sql = `UPDATE employee_data.leaves SET status = $1, hr_reason = $2 WHERE id = $3 RETURNING *`;
    const res = await query(sql, [status, hrReason, id]);
    return res.rows[0];
  },

  // --- 🔐 LOGIN TRACKING ---
  async logLogin(employeeId: string, ip: string, device: string) {
    const sql = `INSERT INTO common_data.login_logs (employee_id, ip_address, device_info) VALUES ($1, $2, $3) RETURNING id`;
    const res = await query(sql, [employeeId, ip, device]);
    return res.rows[0];
  },

  // --- 💬 CHAT SYSTEM ---
  async saveChatMessage(data: any) {
    const sql = `
      INSERT INTO common_data.chat_messages (sender_id, receiver_id, message, message_type, file_url)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const res = await query(sql, [data.senderId, data.receiverId, data.message, data.type || 'text', data.fileUrl]);
    return res.rows[0];
  },

  // --- 📧 EMAIL SYSTEM ---
  async saveEmail(data: any) {
    const sql = `
      INSERT INTO common_data.emails (sender_id, receiver_email, subject, body, attachments_url)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const res = await query(sql, [data.senderId, data.receiverEmail, data.subject, data.body, data.attachments]);
    return res.rows[0];
  },

  // --- 📁 FILE STORAGE ---
  async registerFile(data: any) {
    const sql = `
      INSERT INTO common_data.files (employee_id, file_name, file_type, file_path, file_size)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const res = await query(sql, [data.employeeId, data.fileName, data.fileType, data.filePath, data.fileSize]);
    return res.rows[0];
  },

  // --- 🧠 TECH LEADS ---
  async getTechLeadTeam(leadId: string) {
    const sql = `SELECT * FROM tech_leads_data.tech_leads WHERE employee_id = $1`;
    const res = await query(sql, [leadId]);
    return res.rows[0];
  },

  // --- 📊 ANALYTICS ---
  async getEmployeeStats(id: string) {
    const sql = `SELECT * FROM common_data.employee_stats WHERE employee_id = $1`;
    const res = await query(sql, [id]);
    return res.rows[0];
  },

  // --- 🏗️ PROJECT MANAGEMENT (Enterprise Upgrade) ---
  async getProjects() {
    const sql = `
      SELECT p.*, COUNT(pe.employee_id) as member_count 
      FROM common_data.projects p 
      LEFT JOIN common_data.project_employees pe ON p.id = pe.project_id 
      GROUP BY p.id ORDER BY p.created_at DESC
    `;
    const res = await query(sql);
    return res.rows;
  },

  async getProjectById(id: string) {
    const sql = `SELECT * FROM common_data.projects WHERE id = $1`;
    const res = await query(sql, [id]);
    return res.rows[0];
  },

  async getProjectEmployees(projectId: string) {
    const sql = `
      SELECT e.id, e.name, e.role 
      FROM employee_data.employees e 
      JOIN common_data.project_employees pe ON e.id = pe.employee_id 
      WHERE pe.project_id = $1
    `;
    const res = await query(sql, [projectId]);
    return res.rows;
  },

  async getProjectFiles(projectId: string) {
    const sql = `SELECT * FROM common_data.project_files WHERE project_id = $1 ORDER BY uploaded_at DESC`;
    const res = await query(sql, [projectId]);
    return res.rows;
  },

  async assignEmployeeToProject(projectId: string, employeeId: string) {
    const sql = `INSERT INTO common_data.project_employees (project_id, employee_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *`;
    const res = await query(sql, [projectId, employeeId]);
    return res.rows[0];
  },

  async uploadProjectFile(data: any) {
    const sql = `
      INSERT INTO common_data.project_files (project_id, file_name, file_type, file_path, uploaded_by)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const res = await query(sql, [data.projectId, data.fileName, data.fileType, data.filePath, data.uploadedBy]);
    return res.rows[0];
  }
};
