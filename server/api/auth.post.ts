export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  if (body.password === config.adminPassword) {
    return { success: true };
  }

  throw createError({ statusCode: 401, message: "Senha incorreta!" });
});
