import readline from 'readline';

export const run = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  while (true) {
    await new Promise(resolve => {
      rl.question('Cliente: ', (answer) => {
        resolve(answer);
      });
    });
  }
};
