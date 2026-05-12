module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  rules: {
    // [FIX 6] Block @repo/config from frontend — override in backend/.eslintrc.js and worker/.eslintrc.js
    "no-restricted-imports": [
      "error",
      {
        "patterns": ["@repo/config"]
      }
    ]
  }
};
