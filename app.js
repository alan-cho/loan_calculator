const HTTP = require("http");
const URL = require("url").URL;
const PORT = 3000;

function getParams(path) {
  const myURL = new URL(path, `http://localhost:${PORT}`);
  return myURL.searchParams;
}

function calculateLoan(amount, duration, apr) {
  let annualInterestRate = apr / 100;
  let monthlyInterestRate = annualInterestRate / 12;
  let months = Number(duration) * 12;
  let payment =
    amount *
    (monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -months)));

  return payment.toFixed(2);
}

function createLoanOffer(params) {
  const APR = 5;
  let amount = Number(params.get("amount"));
  let duration = Number(params.get("duration"));
  let payment = calculateLoan(amount, duration, APR);

  return `Amount: $${amount}\nDuration: ${duration} years\nAPR: ${APR}%\nMonthly payment: $${payment}\n`;
}

const SERVER = HTTP.createServer((req, res) => {
  let method = req.method;
  let path = req.url;

  if (path === "/favicon.ico") {
    res.statusCode = 404;
    res.end();
  } else {
    let content = createLoanOffer(getParams(path));

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.write(`${content}\n`);
    res.end();
  }
});

SERVER.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
