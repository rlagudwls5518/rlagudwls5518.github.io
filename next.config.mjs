/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // GitHub Pages 및 정적 배포 호환용
  images: {
    unoptimized: true,
  },
};

export default nextConfig;