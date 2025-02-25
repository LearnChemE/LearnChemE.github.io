const fs = require("node:fs");

// const a = [...]
// const b = [...]
// const c = [...]

let out = "";

for (let i = 0; i < a.length; i++) {
  out += `${a[i]},${b[i]},${c[i]}\n`;
}

// fs.truncate("data.csv", 0, function() {});

fs.writeFileSync('data.csv', out);