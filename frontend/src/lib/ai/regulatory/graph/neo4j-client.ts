import neo4j, { Driver, Session } from 'neo4j-driver';

let driver: Driver | null = null;

export function getNeo4jDriver(): Driver {
  if (!driver) {
    // In a real app, these come from process.env
    const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
    const user = process.env.NEO4J_USER || 'neo4j';
    const password = process.env.NEO4J_PASSWORD || 'regulatoryos123';
    driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  }
  return driver;
}

export async function runQuery(query: string, params: Record<string, any> = {}) {
  const session = getNeo4jDriver().session();
  try {
    const result = await session.run(query, params);
    return result;
  } finally {
    await session.close();
  }
}
