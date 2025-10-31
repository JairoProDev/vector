const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH
  ? process.env.NEXT_PUBLIC_BASE_PATH.replace(/\/$/, "")
  : undefined;

const basePath = rawBasePath && rawBasePath.length > 0 ? rawBasePath : undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath,
};

export default nextConfig;
