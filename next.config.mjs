const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH
  ? process.env.NEXT_PUBLIC_BASE_PATH.replace(/\/$/, "")
  : undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: rawBasePath,
};

export default nextConfig;
