import fs from "fs-extra";
import path from "path";
import { PACKAGES_DIR, readSvgs } from "./helpers.mjs";
import { stringify } from "svgson";
import prettier from "prettier";

import bundleSize from "@atomico/rollup-plugin-sizes";
import { visualizer } from "rollup-plugin-visualizer";
import license from "rollup-plugin-license";
import esbuild from "rollup-plugin-esbuild";

/**
 * Build icons
 *
 * @param name
 * @param componentTemplate
 * @param indexIconTemplate
 * @param typeDefinitionsTemplate
 * @param indexTypeTemplate
 * @param extension
 * @param pretty
 */
export const buildIcons = ({
  name,
  componentTemplate,
  indexItemTemplate,
  typeDefinitionsTemplate,
  indexTypeTemplate,
  extension = "js",
  pretty = true,
  key = true,
  pascalCase = false,
}) => {
  const DIST_DIR = path.resolve(PACKAGES_DIR);
  const svgFiles = readSvgs();

  console.log("DIST_DIR", DIST_DIR);

  let index = [];
  let typings = [];

  const collectNestedElements = (node, index = 0) => {
    if (!node.children) return [];

    return node.children.map(({ name, attributes }, i) => {
      if (key) {
        attributes.key = `svg-${index}-${i}`;
      }

      if (pascalCase) {
        attributes.strokeWidth = attributes["stroke-width"];
        delete attributes["stroke-width"];
      }

      return [
        name,
        attributes,
        collectNestedElements(node.children[i], index + 1),
      ];
    });
  };

  svgFiles.forEach((svgFile, i) => {
    const children = collectNestedElements(svgFile.obj);

    // process.stdout.write(`Building ${i}/${svgFiles.length}: ${svgFile.name.padEnd(42)}\r`);

    let component = componentTemplate({
      name: svgFile.name,
      namePascal: svgFile.namePascal,
      children,
      stringify,
      svg: svgFile,
    });

    const output = pretty
      ? prettier.format(component, {
          singleQuote: true,
          trailingComma: "all",
          parser: "babel",
        })
      : component;

    let filePath = path.resolve(
      DIST_DIR,
      "src/icons",
      `${svgFile.namePascal}.${extension}`
    );
    fs.writeFileSync(filePath, output, "utf-8");

    index.push(
      indexItemTemplate({
        name: svgFile.name,
        namePascal: svgFile.namePascal,
      })
    );

    typings.push(
      indexTypeTemplate({
        name: svgFile.name,
        namePascal: svgFile.namePascal,
      })
    );
  });

  fs.writeFileSync(
    path.resolve(DIST_DIR, `./src/icons.js`),
    index.join("\n"),
    "utf-8"
  );

  fs.ensureDirSync(path.resolve(DIST_DIR, `./dist/`));
  fs.writeFileSync(
    path.resolve(DIST_DIR, `./dist/weberlo-${name}.d.ts`),
    typeDefinitionsTemplate() + "\n" + typings.join("\n"),
    "utf-8"
  );
};

export const getRollupPlugins = (pkg, minify) => {
  return [
    esbuild({
      minify,
    }),
    license({
      banner: `${pkg.name} v${pkg.version} - ${pkg.license}`,
    }),
    bundleSize(),
    visualizer({
      sourcemap: false,
      filename: `stats/${pkg.name}${minify ? "-min" : ""}.html`,
    }),
  ].filter(Boolean);
};
