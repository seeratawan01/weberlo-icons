import fs from 'fs'
import { getRollupPlugins } from './.build/build-icons.mjs'

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'))

const packageName = '@weberlo/icons-react';
const outputFileName = 'weberlo-icons-react';
const outputDir = 'dist';
const inputs = ['./src/weberlo-icons-react.js'];
const bundles = [
  {
    format: 'umd',
    inputs,
    outputDir,
    minify: true,
  },
  {
    format: 'umd',
    inputs,
    outputDir,
  },
  {
    format: 'cjs',
    inputs,
    outputDir,
  },
  {
    format: 'es',
    inputs,
    outputDir,
  },
  {
    format: 'esm',
    inputs,
    outputDir,
    preserveModules: true,
  },
];

const configs = bundles
    .map(({ inputs, outputDir, format, minify, preserveModules }) =>
        inputs.map(input => ({
          input,
          plugins: getRollupPlugins(pkg, minify),
          external: ['react', 'prop-types'],
          output: {
            name: packageName,
            ...(preserveModules
                ? {
                  dir: `${outputDir}/${format}`,
                }
                : {
                  file: `${outputDir}/${format}/${outputFileName}${minify ? '.min' : ''}.js`,
                }),
            format,
            sourcemap: true,
            preserveModules,
            globals: {
              react: 'react',
              'prop-types': 'PropTypes'
            },
          },
        })),
    )
    .flat();

export default configs;
