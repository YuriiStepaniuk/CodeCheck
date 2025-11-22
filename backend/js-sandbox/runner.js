const vm = require('vm');

let code = '';
process.stdin.on('data', (chunk) => {
  code += chunk;
});

process.stdin.on('end', async () => {
  let output = [];
  const sandbox = {
    console: {
      log: (...args) => output.push(args.join(' ')),
    },
    setTimeout,
    setInterval,
    Promise,
  };

  try {
    const asyncCode = `(async () => { ${code} })()`;
    const result = await vm.runInNewContext(asyncCode, sandbox);

    console.log(
      JSON.stringify({ result: result ?? null, error: null, logs: output }),
    );
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    console.log(JSON.stringify({ result: null, error, logs: output }));
  }
});
