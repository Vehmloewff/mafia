import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import sucrase from '@rollup/plugin-sucrase';
import run from '@rollup/plugin-run';
import json from '@rollup/plugin-json';
import globFiles from 'rollup-plugin-glob-files';
import command from 'rollup-plugin-command';
import svelte from 'rollup-plugin-svelte';
import livereload from 'rollup-plugin-livereload';
import svg from 'rollup-plugin-svg';

import pkg from './package.json';
import builtinModules from 'builtin-modules';

const building = process.env.NODE_ENV === 'production';
const testing = process.env.NODE_ENV === 'test';
const watching = process.env.ROLLUP_WATCH;
const plainTests = process.env.BLAND_TESTS;

const plugins = [
	json(),
	commonjs(),
	sucrase({
		transforms: ['typescript'],
	}),
];

const clientPlugins = [
	globFiles({
		key: `@routes`,
		include: `./src/client/routes/**/*.svelte`,
		importStar: true,
	}),
	svelte({
		emitCss: false,
		css: css => css.write('public/bundle.css'),
		dev: false,
	}),
	svg(),
	resolve({
		browser: !testing,
		dedupe: ['svelte'],
	}),
	...plugins,
];

const serverPlugins = [resolve(), ...plugins];

const watch = {
	clearScreen: false,
};

const build = () => [
	{
		input: `src/index.ts`,
		output: { file: pkg.main, format: 'cjs' },
		plugins: serverPlugins,
		watch,
		external: builtinModules,
	},
	{
		input: `src/client/index.ts`,
		output: { file: `public/bundle.js`, format: 'iife' },
		plugins: clientPlugins,
		watch,
	},
];

const dev = () => {
	const dev = build();
	dev[0].plugins = [...dev[0].plugins, run()];
	dev[1].plugins = [...dev[1].plugins, livereload()];

	return dev;
};

const test = () => ({
	input: `@tests`,
	output: { file: pkg.main, format: 'cjs' },
	external: builtinModules.concat('zip-tap'),
	plugins: [
		globFiles({
			key: `@tests`,
			include: `./tests/**/*.ts`,
			justImport: true,
		}),
		...plugins,
		command((plainTests ? `` : `zip-tap-reporter `) + `node ${pkg.main}`, {
			exitOnFail: !watching,
		}),
	],
	watch,
});

export default building ? build() : testing ? test() : dev();
