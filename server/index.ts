import { createReadStream, existsSync, mkdirSync, statSync } from 'node:fs'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { dirname, extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { toCsv, validateSubmission } from '../src/lib/leaderboard.ts'
import { openScoreDb } from './db.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = Number(process.env.PORT ?? 3001)
const DB_PATH = process.env.DB_PATH ?? join(root, 'data', 'arcade.db')
const ADMIN_KEY = process.env.ADMIN_KEY
const DIST = join(root, 'dist')
const MAX_BODY = 4096

mkdirSync(dirname(DB_PATH), { recursive: true })
const db = openScoreDb(DB_PATH)

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.json': 'application/json',
}

function send(res: ServerResponse, status: number, body: unknown, type = 'application/json') {
  res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store' })
  res.end(type === 'application/json' ? JSON.stringify(body) : String(body))
}

function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolveBody, reject) => {
    let size = 0
    const chunks: Buffer[] = []
    req.on('data', (c: Buffer) => {
      size += c.length
      if (size > MAX_BODY) {
        reject(new Error('too large'))
        req.destroy()
      } else chunks.push(c)
    })
    req.on('end', () => {
      try {
        resolveBody(JSON.parse(Buffer.concat(chunks).toString() || 'null'))
      } catch {
        reject(new Error('bad json'))
      }
    })
    req.on('error', reject)
  })
}

/**
 * Clearing is an organizer action: needs ADMIN_KEY if set, otherwise only a direct request from the
 * server machine itself. Requests relayed by a reverse proxy (forwarding headers) never count as local.
 */
function isAdmin(req: IncomingMessage): boolean {
  if (ADMIN_KEY) return req.headers['x-admin-key'] === ADMIN_KEY
  if (req.headers['x-forwarded-for'] || req.headers['forwarded'] || req.headers['x-real-ip']) return false
  const addr = req.socket.remoteAddress ?? ''
  return addr === '127.0.0.1' || addr === '::1' || addr === '::ffff:127.0.0.1'
}

function serveStatic(req: IncomingMessage, res: ServerResponse) {
  const path = normalize(decodeURIComponent((req.url ?? '/').split('?')[0])).replace(/^(\.\.[/\\])+/, '')
  let file = join(DIST, path)
  if (!file.startsWith(DIST) || !existsSync(file) || statSync(file).isDirectory()) file = join(DIST, 'index.html')
  if (!existsSync(file)) return send(res, 404, 'Not built yet. Run "npm run build" first.', 'text/plain')
  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' })
  createReadStream(file).pipe(res)
}

const server = createServer(async (req, res) => {
  const url = (req.url ?? '/').split('?')[0]
  try {
    if (url === '/api/scores' && req.method === 'GET') return send(res, 200, db.top())
    if (url === '/api/scores.csv' && req.method === 'GET') {
      if (!isAdmin(req)) return send(res, 403, { error: 'Organizer key required' })
      res.setHeader('content-disposition', 'attachment; filename="vienna-arcade-scores.csv"')
      return send(res, 200, toCsv(db.topWithEmail()), 'text/csv')
    }
    if (url === '/api/scores' && req.method === 'POST') {
      const submission = validateSubmission(await readBody(req))
      if (!submission) return send(res, 400, { error: 'Invalid score' })
      return send(res, 201, db.add(submission))
    }
    if (url === '/api/scores' && req.method === 'DELETE') {
      if (!isAdmin(req)) return send(res, 403, { error: 'Organizer key required' })
      db.clear()
      return send(res, 200, { ok: true })
    }
    if (url.startsWith('/api/')) return send(res, 404, { error: 'Not found' })
    serveStatic(req, res)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'error'
    send(res, message === 'too large' ? 413 : 400, { error: message })
  }
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Vienna Arcade on http://localhost:${PORT} (scores: ${DB_PATH})`)
})

for (const sig of ['SIGINT', 'SIGTERM'] as const) {
  process.on(sig, () => {
    server.close()
    db.close()
    process.exit(0)
  })
}
