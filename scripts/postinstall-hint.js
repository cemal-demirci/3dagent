#!/usr/bin/env node

/**
 * Post-install hint — reminds the user to run the setup wizard.
 */

const C = { cyan: "\x1b[36m", dim: "\x1b[2m", reset: "\x1b[0m" };

console.log(
  `\n  ${C.cyan}\u2192${C.reset} Kurulumu tamamlamak i\u00e7in: ${C.cyan}npm run setup${C.reset} ${C.dim}(cemal.cloud)${C.reset}\n`
);
