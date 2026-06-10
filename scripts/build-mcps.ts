/**
 * Bundles every local MCP server to mcp/<name>/dist/server.js with esbuild.
 * Run: pnpm mcp:build
 */
import { build } from 'esbuild'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const MCP_DIR = join(process.cwd(), 'mcp')
const servers = readdirSync(MCP_DIR).filter(
  (d) => d.startsWith('specsnap-') && statSync(join(MCP_DIR, d)).isDirectory(),
)

for (const name of servers) {
  await build({
    entryPoints: [join(MCP_DIR, name, 'server.ts')],
    outfile: join(MCP_DIR, name, 'dist/server.js'),
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node20',
    // Keep the SDK external-free: bundle everything so `node dist/server.js`
    // works without a node_modules lookup from the dist folder.
    banner: {
      js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);",
    },
  })
  console.log(`bundled mcp/${name}/dist/server.js`)
}
console.log(`\n${servers.length} MCP servers bundled. Register with:\n`)
for (const name of servers) {
  console.log(`claude mcp add --transport stdio ${name} -- node mcp/${name}/dist/server.js`)
}
