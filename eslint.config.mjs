import nextConfig from 'eslint-config-next'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextConfig,
  ...nextCoreWebVitals,
  ...nextTypeScript,
]

export default eslintConfig
