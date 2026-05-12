// Build guard: throw if service role key is accidentally bundled into frontend
if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY must NOT be present in the frontend environment. Remove it from .env.local immediately."
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/types", "@repo/utils"],
};

module.exports = nextConfig;
