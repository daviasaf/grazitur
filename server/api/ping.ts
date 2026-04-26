// server/api/ping.ts
export default defineEventHandler(() => {
  return { status: 'Acordado!', time: new Date() }
})