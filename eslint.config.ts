import path from "node:path"
import { fileURLToPath } from "node:url"

import js from "@eslint/js"
import globals from "globals"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import jsxA11y from "eslint-plugin-jsx-a11y"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import unusedImports from "eslint-plugin-unused-imports"
import tseslint from "typescript-eslint"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default tseslint.config(
    {
        ignores: [
            "dist",
            "build",
            "coverage",
            "node_modules",
            "eslint.config.ts",
            "vite.config.ts",
            "components.json",
        ],
    },

    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    react.configs.flat.recommended,

    {
        files: ["src/**/*.{ts,tsx}"],

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2024,
            },
            parserOptions: {
                projectService: true,
                tsconfigRootDir: __dirname,
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            "jsx-a11y": jsxA11y,
            "simple-import-sort": simpleImportSort,
            "unused-imports": unusedImports,
        },

        settings: {
            react: {
                version: "detect",
            },
        },

        rules: {
            /**
             * React 17+ JSX Transform
             */
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off",
            "react/prop-types": "off",

            /**
             * React Hooks
             */
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",

            /**
             * Vite Fast Refresh
             */
            "react-refresh/only-export-components": [
                "warn",
                {
                    allowConstantExport: true,
                },
            ],

            /**
             * TypeScript
             */
            "@typescript-eslint/consistent-type-imports": [
                "error",
                {
                    prefer: "type-imports",
                    fixStyle: "inline-type-imports",
                },
            ],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/no-misused-promises": [
                "error",
                {
                    checksVoidReturn: {
                        attributes: false,
                    },
                },
            ],
            "@typescript-eslint/no-unnecessary-condition": "warn",
            "@typescript-eslint/switch-exhaustiveness-check": "error",

            /**
             * Unused imports / vars
             */
            "@typescript-eslint/no-unused-vars": "off",
            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": [
                "warn",
                {
                    vars: "all",
                    varsIgnorePattern: "^_",
                    args: "after-used",
                    argsIgnorePattern: "^_",
                },
            ],

            /**
             * Imports order
             */
            "simple-import-sort/imports": [
                "error",
                {
                    groups: [
                        ["^react$", "^react-dom", "^@?\\w"],
                        ["^@app", "^@pages", "^@widgets", "^@features", "^@entities", "^@shared"],
                        ["^\\u0000"],
                        ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
                        ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
                        ["^.+\\.s?css$"],
                    ],
                },
            ],
            "simple-import-sort/exports": "error",

            /**
             * Base code quality
             */
            "no-console": [
                "warn",
                {
                    allow: ["warn", "error"],
                },
            ],
            "prefer-const": "error",
            "no-var": "error",
            eqeqeq: ["error", "always"],
            curly: ["error", "all"],
            "object-shorthand": "error",

            /**
             * Accessibility
             */
            "jsx-a11y/alt-text": "warn",
            "jsx-a11y/anchor-is-valid": "warn",
            "jsx-a11y/no-autofocus": "warn",
            "jsx-a11y/click-events-have-key-events": "warn",
            "jsx-a11y/no-static-element-interactions": "warn",
        },
    },

    /**
     * shadcn/ui
     *
     */
    {
        files: ["src/shared/ui/**/*.{ts,tsx}"],
        rules: {
            "react-refresh/only-export-components": "off",
        },
    },

    /**
     * FSD layer rules
     */

    {
        files: ["src/shared/**/*.{ts,tsx}"],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: [
                                "@app/**",
                                "@pages/**",
                                "@widgets/**",
                                "@features/**",
                                "@entities/**",
                            ],
                            message: "shared не должен импортировать верхние FSD-слои.",
                        },
                    ],
                },
            ],
        },
    },

    {
        files: ["src/entities/**/*.{ts,tsx}"],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["@app/**", "@pages/**", "@widgets/**", "@features/**"],
                            message: "entities может импортировать только shared.",
                        },
                    ],
                },
            ],
        },
    },

    {
        files: ["src/features/**/*.{ts,tsx}"],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["@app/**", "@pages/**", "@widgets/**"],
                            message: "features может импортировать только entities и shared.",
                        },
                    ],
                },
            ],
        },
    },

    {
        files: ["src/widgets/**/*.{ts,tsx}"],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["@app/**", "@pages/**"],
                            message:
                                "widgets может импортировать только features, entities и shared.",
                        },
                    ],
                },
            ],
        },
    },

    {
        files: ["src/pages/**/*.{ts,tsx}"],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["@app/**"],
                            message: "pages не должен импортировать app-слой.",
                        },
                    ],
                },
            ],
        },
    },
)
