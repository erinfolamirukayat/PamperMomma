import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    ...compat.config({
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars-experimental": "off",
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/no-unused-vars": "off",
            '@typescript-eslint/no-unused-expressions': 'off',
            // "no-console": "false", // Allow console logs for development
            // "no-debugger": "warn",
            "react/react-in-jsx-scope": "off", // Next.js handles React import
            "react/jsx-uses-react": "off", // Next.js handles React usage
            "react/jsx-uses-vars": "off",
            "import/no-unresolved": "off", // Next.js handles module resolution
            "react/no-unescaped-entities": "off",
            "react-hooks/exhaustive-deps": "off", // Disable exhaustive-deps rule for hooks
            "react/jsx-key": "off", // Disable jsx-key rule for React components
        },
    }),
];

export default eslintConfig;