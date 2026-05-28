const base = require("../../.eslintrc.base.js");

// [FIX 6] Allow @repo/config in backend only
module.exports = {
  ...base,
  rules: {
    ...base.rules,
    "no-restricted-imports": "off",
  },
};
