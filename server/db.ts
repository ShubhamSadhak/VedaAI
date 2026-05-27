import fs from 'fs';
import path from 'path';
import { Assignment } from '../src/types';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'assignments.json');

// Ensure directory exists
function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

export function readAssignments(): Assignment[] {
  try {
    ensureDb();
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content) as Assignment[];
  } catch (err) {
    console.error('Error reading assignments DB:', err);
    return [];
  }
}

export function writeAssignments(assignments: Assignment[]): void {
  try {
    ensureDb();
    fs.writeFileSync(DB_FILE, JSON.stringify(assignments, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing assignments DB:', err);
  }
}

export function getAssignment(id: string): Assignment | undefined {
  const list = readAssignments();
  return list.find((a) => a.id === id);
}

export function addAssignment(assignment: Assignment): void {
  const list = readAssignments();
  list.unshift(assignment); // Add to top/front of list
  writeAssignments(list);
}

export function updateAssignment(id: string, changes: Partial<Assignment>): Assignment | undefined {
  const list = readAssignments();
  const idx = list.findIndex((a) => a.id === id);
  if (idx === -1) return undefined;
  
  list[idx] = { ...list[idx], ...changes };
  writeAssignments(list);
  return list[idx];
}

export function deleteAssignment(id: string): boolean {
  const list = readAssignments();
  const filtered = list.filter((a) => a.id !== id);
  if (filtered.length === list.length) return false;
  writeAssignments(filtered);
  return true;
}
