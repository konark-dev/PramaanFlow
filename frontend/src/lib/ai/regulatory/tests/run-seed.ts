import { buildRegulatoryGraph } from '../graph/graph-builder';

async function main() {
    try {
        await buildRegulatoryGraph();
        console.log("Seed successful");
        process.exit(0);
    } catch (e) {
        console.error("Seed failed", e);
        process.exit(1);
    }
}

main();
