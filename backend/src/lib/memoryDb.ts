import crypto from 'crypto';
import type {
  User,
  Organization,
  Department,
  Project,
  ProjectAttribute,
  ApprovalType,
  ApplicabilityRule,
  ApprovalDependency,
  ProjectApproval,
  DocumentRequirement,
  Document,
  Application,
  ApplicationDocument,
  ApplicationEvent,
  Query,
  QueryResponse,
  Inspection,
  InspectionFinding,
  SLAPolicy,
  SLAInstance,
  IncentiveScheme,
  IncentiveMatch,
  ComplianceRequirement,
  AuditLog,
  Notification,
} from '../types/database';

type AnyRecord = Record<string, any>;

interface RelationDef {
  table: string;
  foreignKey: string;
  isMany: boolean;
  isParent?: boolean;
}

const RELATION_MAP: Record<string, Record<string, RelationDef>> = {
  User: {
    organization: { table: 'Organization', foreignKey: 'org_id', isMany: false, isParent: true },
    department: { table: 'Department', foreignKey: 'department_id', isMany: false, isParent: true },
  },
  Project: {
    organization: { table: 'Organization', foreignKey: 'org_id', isMany: false, isParent: true },
    attributes: { table: 'ProjectAttribute', foreignKey: 'project_id', isMany: true },
    project_approvals: { table: 'ProjectApproval', foreignKey: 'project_id', isMany: true },
    documents: { table: 'Document', foreignKey: 'project_id', isMany: true },
    incentive_matches: { table: 'IncentiveMatch', foreignKey: 'project_id', isMany: true },
    compliance_requirements: { table: 'ComplianceRequirement', foreignKey: 'project_id', isMany: true },
  },
  ProjectApproval: {
    project: { table: 'Project', foreignKey: 'project_id', isMany: false, isParent: true },
    approval_type: { table: 'ApprovalType', foreignKey: 'approval_type_id', isMany: false, isParent: true },
    application: { table: 'Application', foreignKey: 'project_approval_id', isMany: false },
  },
  ApprovalType: {
    applicability_rules: { table: 'ApplicabilityRule', foreignKey: 'approval_type_id', isMany: true },
    document_requirements: { table: 'DocumentRequirement', foreignKey: 'approval_type_id', isMany: true },
    project_approvals: { table: 'ProjectApproval', foreignKey: 'approval_type_id', isMany: true },
    sla_policies: { table: 'SLAPolicy', foreignKey: 'approval_type_id', isMany: true },
    prerequisite_for: { table: 'ApprovalDependency', foreignKey: 'prerequisite_approval_type_id', isMany: true },
    dependent_on: { table: 'ApprovalDependency', foreignKey: 'dependent_approval_type_id', isMany: true },
  },
  ApplicabilityRule: {
    approval_type: { table: 'ApprovalType', foreignKey: 'approval_type_id', isMany: false, isParent: true },
  },
  ApprovalDependency: {
    prerequisite_approval: { table: 'ApprovalType', foreignKey: 'prerequisite_approval_type_id', isMany: false, isParent: true },
    dependent_approval: { table: 'ApprovalType', foreignKey: 'dependent_approval_type_id', isMany: false, isParent: true },
    prerequisite_approval_type: { table: 'ApprovalType', foreignKey: 'prerequisite_approval_type_id', isMany: false, isParent: true },
    dependent_approval_type: { table: 'ApprovalType', foreignKey: 'dependent_approval_type_id', isMany: false, isParent: true },
  },
  Application: {
    project_approval: { table: 'ProjectApproval', foreignKey: 'project_approval_id', isMany: false, isParent: true },
    department: { table: 'Department', foreignKey: 'department_id', isMany: false, isParent: true },
    application_documents: { table: 'ApplicationDocument', foreignKey: 'application_id', isMany: true },
    events: { table: 'ApplicationEvent', foreignKey: 'application_id', isMany: true },
    queries: { table: 'Query', foreignKey: 'application_id', isMany: true },
    inspections: { table: 'Inspection', foreignKey: 'application_id', isMany: true },
    sla_instance: { table: 'SLAInstance', foreignKey: 'application_id', isMany: false },
  },
  ApplicationDocument: {
    application: { table: 'Application', foreignKey: 'application_id', isMany: false, isParent: true },
    document: { table: 'Document', foreignKey: 'document_id', isMany: false, isParent: true },
  },
  Document: {
    project: { table: 'Project', foreignKey: 'project_id', isMany: false, isParent: true },
    organization: { table: 'Organization', foreignKey: 'org_id', isMany: false, isParent: true },
    application_documents: { table: 'ApplicationDocument', foreignKey: 'document_id', isMany: true },
  },
  ApplicationEvent: {
    application: { table: 'Application', foreignKey: 'application_id', isMany: false, isParent: true },
    actor: { table: 'User', foreignKey: 'actor_id', isMany: false, isParent: true },
  },
  Query: {
    application: { table: 'Application', foreignKey: 'application_id', isMany: false, isParent: true },
    creator: { table: 'User', foreignKey: 'created_by', isMany: false, isParent: true },
    assignee: { table: 'User', foreignKey: 'assigned_to', isMany: false, isParent: true },
    responses: { table: 'QueryResponse', foreignKey: 'query_id', isMany: true },
  },
  QueryResponse: {
    query: { table: 'Query', foreignKey: 'query_id', isMany: false, isParent: true },
    author: { table: 'User', foreignKey: 'created_by', isMany: false, isParent: true },
  },
  Inspection: {
    application: { table: 'Application', foreignKey: 'application_id', isMany: false, isParent: true },
    department: { table: 'Department', foreignKey: 'department_id', isMany: false, isParent: true },
    inspector: { table: 'User', foreignKey: 'inspector_id', isMany: false, isParent: true },
    findings: { table: 'InspectionFinding', foreignKey: 'inspection_id', isMany: true },
  },
  InspectionFinding: {
    inspection: { table: 'Inspection', foreignKey: 'inspection_id', isMany: false, isParent: true },
  },
  SLAPolicy: {
    approval_type: { table: 'ApprovalType', foreignKey: 'approval_type_id', isMany: false, isParent: true },
  },
  SLAInstance: {
    application: { table: 'Application', foreignKey: 'application_id', isMany: false, isParent: true },
  },
  IncentiveMatch: {
    project: { table: 'Project', foreignKey: 'project_id', isMany: false, isParent: true },
    incentive_scheme: { table: 'IncentiveScheme', foreignKey: 'incentive_scheme_id', isMany: false, isParent: true },
  },
  ComplianceRequirement: {
    project: { table: 'Project', foreignKey: 'project_id', isMany: false, isParent: true },
  },
  AuditLog: {
    actor: { table: 'User', foreignKey: 'actor_id', isMany: false, isParent: true },
  },
  Notification: {
    user: { table: 'User', foreignKey: 'user_id', isMany: false, isParent: true },
  },
};

// Global in-memory storage: Table Name -> Map<ID, Record>
const tables: Record<string, Map<string, AnyRecord>> = {};

export function getTable(tableName: string): Map<string, AnyRecord> {
  if (!tables[tableName]) {
    tables[tableName] = new Map();
  }
  return tables[tableName];
}

function matchesCondition(val: any, cond: any): boolean {
  if (cond === undefined) return true;
  if (cond === null) return val === null;

  if (typeof cond === 'object' && !(cond instanceof Date)) {
    if ('in' in cond && Array.isArray(cond.in)) {
      return cond.in.includes(val);
    }
    if ('not' in cond) {
      if (cond.not === null) return val !== null;
      return val !== cond.not;
    }
    if ('gte' in cond) {
      const c = cond.gte instanceof Date ? cond.gte.getTime() : cond.gte;
      const v =
        val instanceof Date
          ? val.getTime()
          : typeof val === 'string' && !isNaN(Date.parse(val))
          ? new Date(val).getTime()
          : val;
      return v >= c;
    }
    if ('lte' in cond) {
      const c = cond.lte instanceof Date ? cond.lte.getTime() : cond.lte;
      const v =
        val instanceof Date
          ? val.getTime()
          : typeof val === 'string' && !isNaN(Date.parse(val))
          ? new Date(val).getTime()
          : val;
      return v <= c;
    }
    if ('gt' in cond) {
      const c = cond.gt instanceof Date ? cond.gt.getTime() : cond.gt;
      const v =
        val instanceof Date
          ? val.getTime()
          : typeof val === 'string' && !isNaN(Date.parse(val))
          ? new Date(val).getTime()
          : val;
      return v > c;
    }
    if ('lt' in cond) {
      const c = cond.lt instanceof Date ? cond.lt.getTime() : cond.lt;
      const v =
        val instanceof Date
          ? val.getTime()
          : typeof val === 'string' && !isNaN(Date.parse(val))
          ? new Date(val).getTime()
          : val;
      return v < c;
    }
    if (!val || typeof val !== 'object') return false;
    for (const [k, v] of Object.entries(cond)) {
      if (!matchesCondition(val[k], v)) return false;
    }
    return true;
  }

  if (cond instanceof Date) {
    const vTime =
      val instanceof Date
        ? val.getTime()
        : typeof val === 'string'
        ? new Date(val).getTime()
        : val;
    return vTime === cond.getTime();
  }

  return val === cond;
}

function recordMatchesWhere(record: AnyRecord, where?: Record<string, any>, tableName?: string): boolean {
  if (!where) return true;
  const tableRelations = tableName ? RELATION_MAP[tableName] || {} : {};

  for (const [key, cond] of Object.entries(where)) {
    if (cond === undefined || cond === 'undefined') continue;

    // Check if key is a relation on this table
    if (tableRelations[key]) {
      const rel = tableRelations[key];
      const targetTable = getTable(rel.table);
      if (rel.isParent) {
        const parentId = record[rel.foreignKey];
        const parent = parentId ? targetTable.get(parentId) : null;
        if (!parent) return false;
        if (!recordMatchesWhere(parent, cond, rel.table)) return false;
      } else if (rel.isMany) {
        const allTargets = Array.from(targetTable.values());
        const children = allTargets.filter((c) => c[rel.foreignKey] === record.id);
        if (cond && typeof cond === 'object') {
          if ('some' in cond) {
            if (!children.some((c) => recordMatchesWhere(c, cond.some, rel.table))) return false;
          } else if ('every' in cond) {
            if (!children.every((c) => recordMatchesWhere(c, cond.every, rel.table))) return false;
          } else {
            if (!children.some((c) => recordMatchesWhere(c, cond, rel.table))) return false;
          }
        }
      }
      continue;
    }

    // Check for composite unique keys (e.g. project_id_key: { project_id, key })
    if (
      typeof cond === 'object' &&
      cond !== null &&
      !(cond instanceof Date) &&
      !('in' in cond || 'not' in cond || 'gte' in cond || 'lte' in cond || 'gt' in cond || 'lt' in cond)
    ) {
      const subKeys = Object.keys(cond);
      const isComposite = subKeys.length > 0 && subKeys.every((sk) => sk in record);
      if (isComposite) {
        let allMatch = true;
        for (const sk of subKeys) {
          if (!matchesCondition(record[sk], cond[sk])) {
            allMatch = false;
            break;
          }
        }
        if (!allMatch) return false;
        continue;
      }
    }

    if (!matchesCondition(record[key], cond)) return false;
  }

  return true;
}

function selectToInclude(tableName: string, selectObj?: Record<string, any>): Record<string, any> | undefined {
  if (!selectObj) return undefined;
  const tableRelations = RELATION_MAP[tableName] || {};
  const include: Record<string, any> = {};
  let hasRelation = false;

  for (const [key, val] of Object.entries(selectObj)) {
    if (tableRelations[key] && typeof val === 'object') {
      hasRelation = true;
      const targetTable = tableRelations[key].table;
      if (val.select) {
        const nested = selectToInclude(targetTable, val.select);
        include[key] = nested ? { include: nested } : true;
      } else if (val.include) {
        include[key] = val;
      } else {
        include[key] = true;
      }
    }
  }

  return hasRelation ? include : undefined;
}

function mergeIncludes(incA?: Record<string, any>, incB?: Record<string, any>): Record<string, any> | undefined {
  if (!incA && !incB) return undefined;
  if (!incA) return incB;
  if (!incB) return incA;

  const result: Record<string, any> = { ...incA };
  for (const [k, v] of Object.entries(incB)) {
    if (!result[k]) {
      result[k] = v;
    } else if (typeof result[k] === 'object' && typeof v === 'object') {
      const nestedA = result[k].include || {};
      const nestedB = v.include || {};
      result[k] = {
        ...result[k],
        ...v,
        include: mergeIncludes(nestedA, nestedB),
      };
    }
  }
  return result;
}

function sortRecords(records: AnyRecord[], orderBy: any): AnyRecord[] {
  if (!orderBy) return records;
  const list = [...records];
  const orderList = Array.isArray(orderBy) ? orderBy : [orderBy];

  list.sort((a, b) => {
    for (const rule of orderList) {
      for (const [col, dir] of Object.entries(rule)) {
        const valA = a[col];
        const valB = b[col];
        if (valA === valB) continue;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;
        const comp = valA < valB ? -1 : 1;
        return dir === 'asc' ? comp : -comp;
      }
    }
    return 0;
  });
  return list;
}

function parseDates(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return obj;
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = parseDates(obj[i]);
    }
    return obj;
  }
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') {
      if (
        (k.endsWith('_at') || k.endsWith('_date') || k === 'timestamp' || k === 'valid_until') &&
        !isNaN(Date.parse(v))
      ) {
        obj[k] = new Date(v);
      }
    } else if (v && typeof v === 'object') {
      obj[k] = parseDates(v);
    }
  }
  return obj;
}

function hydrateRelations(
  sourceTable: string,
  records: AnyRecord[],
  include?: Record<string, any>
) {
  if (!include || records.length === 0) return;
  const tableRelations = RELATION_MAP[sourceTable] || {};

  for (const [relationName, relationInclude] of Object.entries(include)) {
    if (!relationInclude) continue;
    const rel = tableRelations[relationName];
    if (!rel) continue;

    const targetTable = getTable(rel.table);
    const nestedInclude =
      typeof relationInclude === 'object' && relationInclude.include ? relationInclude.include : undefined;
    const nestedWhere =
      typeof relationInclude === 'object' && relationInclude.where ? relationInclude.where : undefined;
    const nestedOrderBy =
      typeof relationInclude === 'object' && relationInclude.orderBy ? relationInclude.orderBy : undefined;

    if (rel.isParent) {
      for (const r of records) {
        const foreignId = r[rel.foreignKey];
        const target = foreignId ? targetTable.get(foreignId) : null;
        if (target && nestedWhere && !recordMatchesWhere(target, nestedWhere, rel.table)) {
          r[relationName] = null;
        } else {
          r[relationName] = target ? { ...target } : null;
        }
      }
      if (nestedInclude) {
        const targets = records.map((r) => r[relationName]).filter(Boolean);
        if (targets.length > 0) {
          hydrateRelations(rel.table, targets, nestedInclude);
        }
      }
    } else if (rel.isMany) {
      const allTargets = Array.from(targetTable.values());
      for (const r of records) {
        let matching = allTargets.filter((t) => t[rel.foreignKey] === r.id);
        if (nestedWhere) {
          matching = matching.filter((t) => recordMatchesWhere(t, nestedWhere, rel.table));
        }
        if (nestedOrderBy) {
          matching = sortRecords(matching, nestedOrderBy);
        }
        r[relationName] = matching.map((t) => ({ ...t }));
      }
      if (nestedInclude) {
        const targets = records.flatMap((r) => r[relationName] || []);
        if (targets.length > 0) {
          hydrateRelations(rel.table, targets, nestedInclude);
        }
      }
    } else {
      const allTargets = Array.from(targetTable.values());
      for (const r of records) {
        const found = allTargets.find((t) => t[rel.foreignKey] === r.id);
        if (found && nestedWhere && !recordMatchesWhere(found, nestedWhere, rel.table)) {
          r[relationName] = null;
        } else {
          r[relationName] = found ? { ...found } : null;
        }
      }
      if (nestedInclude) {
        const targets = records.map((r) => r[relationName]).filter(Boolean);
        if (targets.length > 0) {
          hydrateRelations(rel.table, targets, nestedInclude);
        }
      }
    }
  }
}

let seedPromise: Promise<void> | null = null;
let isSeeded = false;

export async function ensureSeeded(): Promise<void> {
  if (isSeeded) return;
  if (!seedPromise) {
    seedPromise = (async () => {
      try {
        const { seedDatabase } = await import('../seed');
        await seedDatabase(memoryDb);
        isSeeded = true;
      } catch (err) {
        console.error('Failed to auto-seed memory database:', err);
        seedPromise = null;
        throw err;
      }
    })();
  }
  return seedPromise;
}

export class MemoryModelClient<T = any> {
  constructor(public readonly tableName: string) {}

  async findMany(args?: {
    where?: Record<string, any>;
    include?: Record<string, any>;
    orderBy?: any;
    take?: number;
    skip?: number;
    select?: any;
  }): Promise<T[]> {
    await ensureSeeded();
    const table = getTable(this.tableName);
    let list: AnyRecord[] = Array.from(table.values()).map((r) => ({ ...r }));

    if (args?.where) {
      list = list.filter((r) => recordMatchesWhere(r, args.where, this.tableName));
    }

    if (args?.orderBy) {
      list = sortRecords(list, args.orderBy);
    }

    if (args?.skip !== undefined || args?.take !== undefined) {
      const start = args.skip || 0;
      const end = args.take !== undefined ? start + args.take : undefined;
      list = list.slice(start, end);
    }

    const selectInclude = selectToInclude(this.tableName, args?.select);
    const combinedInclude = mergeIncludes(args?.include, selectInclude);

    if (combinedInclude && list.length > 0) {
      hydrateRelations(this.tableName, list, combinedInclude);
    }

    parseDates(list);
    return list as T[];
  }

  async findUnique(args: {
    where: Record<string, any>;
    include?: Record<string, any>;
    select?: any;
  }): Promise<T | null> {
    await ensureSeeded();
    if (!args.where || Object.keys(args.where).length === 0) return null;
    const hasValidKey = Object.values(args.where).some((v) => v !== undefined && v !== 'undefined');
    if (!hasValidKey) return null;

    const table = getTable(this.tableName);
    if (args.where.id && Object.keys(args.where).length === 1 && typeof args.where.id === 'string') {
      const raw = table.get(args.where.id);
      if (!raw) return null;
      const item = { ...raw };
      const selectInclude = selectToInclude(this.tableName, args.select);
      const combinedInclude = mergeIncludes(args.include, selectInclude);
      if (combinedInclude) {
        hydrateRelations(this.tableName, [item], combinedInclude);
      }
      parseDates(item);
      return item as T;
    }

    return this.findFirst(args);
  }

  async findFirst(args?: {
    where?: Record<string, any>;
    include?: Record<string, any>;
    orderBy?: any;
    select?: any;
  }): Promise<T | null> {
    const results = await this.findMany({
      where: args?.where,
      include: args?.include,
      orderBy: args?.orderBy,
      select: args?.select,
      take: 1,
    });
    return results[0] ?? null;
  }

  async count(args?: { where?: Record<string, any> }): Promise<number> {
    await ensureSeeded();
    const table = getTable(this.tableName);
    if (!args?.where) return table.size;
    const items = await this.findMany({ where: args.where });
    return items.length;
  }

  async create(args: { data: Record<string, any>; include?: Record<string, any> }): Promise<T> {
    await ensureSeeded();
    const table = getTable(this.tableName);
    const row = { ...args.data };
    if (!row.id) {
      row.id = crypto.randomUUID();
    }
    if (!row.created_at) row.created_at = new Date();
    if (!row.updated_at) row.updated_at = new Date();
    table.set(row.id, row);

    const result = { ...row };
    if (args.include) {
      hydrateRelations(this.tableName, [result], args.include);
    }
    parseDates(result);
    return result as T;
  }

  async createMany(args: { data: Record<string, any>[] }): Promise<{ count: number }> {
    for (const item of args.data) {
      await this.create({ data: item });
    }
    return { count: args.data.length };
  }

  async update(args: {
    where: Record<string, any>;
    data: Record<string, any>;
    include?: Record<string, any>;
  }): Promise<T> {
    const existing = await this.findFirst({ where: args.where });
    if (!existing) {
      throw new Error(`Record to update not found in table ${this.tableName}`);
    }
    const table = getTable(this.tableName);
    const current = table.get((existing as any).id) || {};
    const updated: AnyRecord = { ...current, ...args.data, updated_at: new Date() };
    const recordId = (updated.id || (existing as any).id) as string;
    table.set(recordId, updated);

    const result = { ...updated };
    if (args.include) {
      hydrateRelations(this.tableName, [result], args.include);
    }
    parseDates(result);
    return result as T;
  }

  async updateMany(args: { where: Record<string, any>; data: Record<string, any> }): Promise<{ count: number }> {
    const matches = await this.findMany({ where: args.where });
    const table = getTable(this.tableName);
    for (const m of matches) {
      const cur = table.get((m as any).id);
      if (cur) {
        const updatedRecord: AnyRecord = { ...cur, ...args.data, updated_at: new Date() };
        table.set((m as any).id, updatedRecord);
      }
    }
    return { count: matches.length };
  }

  async delete(args: { where: Record<string, any> }): Promise<T | null> {
    const existing = await this.findFirst({ where: args.where });
    if (!existing) return null;
    const table = getTable(this.tableName);
    table.delete((existing as any).id);
    return existing as T;
  }

  async deleteMany(args?: { where?: Record<string, any> }): Promise<{ count: number }> {
    const matches = await this.findMany({ where: args?.where });
    const table = getTable(this.tableName);
    for (const m of matches) {
      table.delete((m as any).id);
    }
    return { count: matches.length };
  }

  async upsert(args: {
    where: Record<string, any>;
    create: Record<string, any>;
    update: Record<string, any>;
    include?: Record<string, any>;
  }): Promise<T> {
    const existing = await this.findFirst({ where: args.where });
    if (existing) {
      if (Object.keys(args.update).length === 0) {
        const item = { ...(existing as any) };
        if (args.include) {
          hydrateRelations(this.tableName, [item], args.include);
        }
        return item as T;
      }
      return this.update({ where: { id: (existing as any).id }, data: args.update, include: args.include });
    } else {
      const createData = { ...args.create, ...args.update };
      if (!createData.id) {
        createData.id = crypto.randomUUID();
      }
      return this.create({ data: createData, include: args.include });
    }
  }

  async groupBy(args: {
    by: string[];
    where?: Record<string, any>;
    _count?: Record<string, boolean>;
  }): Promise<any[]> {
    const items = await this.findMany({ where: args.where });
    const groupKey = args.by[0];
    const counts = new Map<any, number>();

    for (const item of items) {
      const val = (item as any)[groupKey];
      counts.set(val, (counts.get(val) || 0) + 1);
    }

    return Array.from(counts.entries()).map(([k, count]) => ({
      [groupKey]: k,
      _count: { _all: count, [groupKey]: count },
    }));
  }
}

export const memoryDb = {
  user: new MemoryModelClient<User>('User'),
  organization: new MemoryModelClient<Organization>('Organization'),
  department: new MemoryModelClient<Department>('Department'),
  project: new MemoryModelClient<Project>('Project'),
  projectAttribute: new MemoryModelClient<ProjectAttribute>('ProjectAttribute'),
  approvalType: new MemoryModelClient<ApprovalType>('ApprovalType'),
  applicabilityRule: new MemoryModelClient<ApplicabilityRule>('ApplicabilityRule'),
  approvalDependency: new MemoryModelClient<ApprovalDependency>('ApprovalDependency'),
  projectApproval: new MemoryModelClient<ProjectApproval>('ProjectApproval'),
  documentRequirement: new MemoryModelClient<DocumentRequirement>('DocumentRequirement'),
  document: new MemoryModelClient<Document>('Document'),
  application: new MemoryModelClient<Application>('Application'),
  applicationDocument: new MemoryModelClient<ApplicationDocument>('ApplicationDocument'),
  applicationEvent: new MemoryModelClient<ApplicationEvent>('ApplicationEvent'),
  query: new MemoryModelClient<Query>('Query'),
  queryResponse: new MemoryModelClient<QueryResponse>('QueryResponse'),
  inspection: new MemoryModelClient<Inspection>('Inspection'),
  inspectionFinding: new MemoryModelClient<InspectionFinding>('InspectionFinding'),
  sLAPolicy: new MemoryModelClient<SLAPolicy>('SLAPolicy'),
  sLAInstance: new MemoryModelClient<SLAInstance>('SLAInstance'),
  incentiveScheme: new MemoryModelClient<IncentiveScheme>('IncentiveScheme'),
  incentiveMatch: new MemoryModelClient<IncentiveMatch>('IncentiveMatch'),
  complianceRequirement: new MemoryModelClient<ComplianceRequirement>('ComplianceRequirement'),
  auditLog: new MemoryModelClient<AuditLog>('AuditLog'),
  notification: new MemoryModelClient<Notification>('Notification'),

  async $disconnect(): Promise<void> {},

  async $transaction<T>(arg: Promise<T>[] | ((tx: typeof memoryDb) => Promise<T>)): Promise<T | T[]> {
    if (Array.isArray(arg)) {
      return Promise.all(arg);
    }
    return arg(memoryDb);
  },
};
