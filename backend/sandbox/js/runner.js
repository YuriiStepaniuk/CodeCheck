// runner.js
const vm = require('vm');

let code = '';
process.stdin.on('data', (chunk) => {
  code += chunk;
});

process.stdin.on('end', async () => {
  // 1. Pass the REAL console, do not intercept logs.
  // The code coming from NestJS will handle its own logging and result printing.
  const sandbox = {
    console: console,
    setTimeout,
    setInterval,
    Promise,
    Buffer,
    // Add other globals if needed
  };

  try {
    // 2. Just run the code.
    // We don't need to wrap it in async here because JavascriptRunner
    // already wraps the user code in an async IIFE.
    vm.runInNewContext(code, sandbox);
  } catch (e) {
    // This catch block only triggers if the script ITSELF fails to compile/start.
    // Runtime errors inside the script are already caught by JavascriptRunner.
    console.error(
      JSON.stringify({
        result: null,
        error: e instanceof Error ? e.message : String(e),
        logs: [],
      }),
    );
  }
});
