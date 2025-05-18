import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'app')],
  },
  // ...other config options if needed
}

export default nextConfig
