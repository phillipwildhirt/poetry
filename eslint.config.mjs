import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import { defineConfig, globalIgnores } from 'eslint/config';
import ngParser from '@angular-eslint/template-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import perfectionist from 'eslint-plugin-perfectionist';
import localPlugins from './eslint-rules/index.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});


export default defineConfig([
  globalIgnores(['projects/**/*']), {
    languageOptions: {
      globals: {},
    },
  }, {
    files: ['**/*.ts'],

    extends: compat.extends(
      'plugin:@angular-eslint/recommended',
      'plugin:@angular-eslint/template/process-inline-templates',
      'plugin:@ngrx/store',
      'plugin:@ngrx/effects',
      'plugin:@ngrx/operators',
    ),

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',

      parserOptions: {
        project: ['./tsconfig.app.json'],
        createDefaultProgram: true
      },
    },

    rules: {
      semi: 'error',
      quotes: [2, 'single'],
      '@typescript-eslint/member-ordering': 'off',

      '@angular-eslint/directive-selector': [
        'error', {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        }
      ],

      '@angular-eslint/component-selector': [
        'error', {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        }
      ],

      '@angular-eslint/no-input-rename': [
        'error', {
          allowedNames: ['appSkeleton'],
        }
      ],

      '@angular-eslint/component-max-inline-declarations': [
        'error', {
          template: 51,
          styles: 15,
        }
      ],

      'no-restricted-syntax': [
        'error',
        {
          selector: 'ClassDeclaration[id.name=/[Rr]esponse/] TSTypeReference[typeName.name=/^(Map|Set|Date)$/], TSInterfaceDeclaration[id.name=/[Rr]esponse/] TSTypeReference[typeName.name=/^(Map|Set|Date)$/], TSTypeAliasDeclaration[id.name=/[Rr]esponse/] TSTypeReference[typeName.name=/^(Map|Set|Date)$/]',
          message: 'Raw backend maps are serialized as plain objects over the wire. Use \'Record\' instead of Map, \'Array\' instead of Set, and \'string\' instead of Date in Response models.'
        }
      ],

      '@ngrx/prefer-effect-callback-in-block-statement': 'off',
      '@ngrx/prefer-concat-latest-from': 'off',
      '@ngrx/no-store-subscription': 'off',
      '@ngrx/avoid-mapping-selectors': 'warn',
    },
  }, {
    files: ['**/*.html'],
    extends: compat.extends('plugin:@angular-eslint/template/recommended'),

    languageOptions: {
      parser: ngParser,
    },

    rules: {
      '@angular-eslint/template/prefer-self-closing-tags': ['error'],
      '@angular-eslint/template/prefer-control-flow': ['error'],

      '@angular-eslint/template/conditional-complexity': [
        'error', {
          maxComplexity: 20,
        }
      ],
    },
  }, {
    plugins: {
      perfectionist,
      '@local': localPlugins
    },
    files: ['**/*.component.ts', '**/*.directive.ts', '**/*.module.ts', '**/*.pipe.ts'],
    rules: {
      'perfectionist/sort-objects': [
        'error',
        {
          fallbackSort: { type: 'unsorted' },
          groups: [
            'declarations', 'selector', 'templateUrl',  'styleUrl',  'styleUrls', 'pure', 'standalone', 'imports', 'exports', 'providers', 'viewProviders', 'schemas', 'changeDetection', 'encapsulation', 'template', 'styles', 'host',
            'unknown'
          ],
          customGroups: [
            { groupName: 'declarations', elementNamePattern: '^declarations$' },
            { groupName: 'selector', elementNamePattern: '^selector$' },
            { groupName: 'templateUrl', elementNamePattern: '^templateUrl$' },
            { groupName: 'styleUrl', elementNamePattern: '^styleUrl$' },
            { groupName: 'styleUrls', elementNamePattern: '^styleUrls$' },
            { groupName: 'pure', elementNamePattern: '^pure$' },
            { groupName: 'standalone', elementNamePattern: '^standalone$' },
            { groupName: 'imports', elementNamePattern: '^imports$' },
            { groupName: 'exports', elementNamePattern: '^exports$' },
            { groupName: 'providers', elementNamePattern: '^providers$' },
            { groupName: 'viewProviders', elementNamePattern: '^viewProviders$' },
            { groupName: 'schemas', elementNamePattern: '^schemas$' },
            { groupName: 'changeDetection', elementNamePattern: '^changeDetection$' },
            { groupName: 'encapsulation', elementNamePattern: '^encapsulation$' },
            { groupName: 'template', elementNamePattern: '^template$' },
            { groupName: 'styles', elementNamePattern: '^styles$' },
            { groupName: 'host', elementNamePattern: '^host$' },
            { groupName: 'unknown', elementNamePattern: '.*|^name$', type: 'unsorted' }
          ]
        }
      ],
      '@local/sort-angular-imports': 'error'
    }
  },
  {
    plugins: {
      unicorn: eslintPluginUnicorn
    },
    files: ['src/**/*.{ts,tsx,js,jsx,mjs,ejs}'],
    rules: {
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true
          }
        }
      ],
      'unicorn/no-abusive-eslint-disable': 'error',
      'unicorn/no-for-loop': 'error',
      'unicorn/no-unused-properties': 'error',
      'unicorn/prefer-array-some': 'warn',
      'unicorn/no-useless-spread': 'error',
    },
  }
]);
