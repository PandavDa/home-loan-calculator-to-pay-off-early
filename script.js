function calculatePayoff() {
  const loanAmount = parseFloat(document.getElementById('loan-amount').value);
  const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;
  const loanTerm = parseFloat(document.getElementById('loan-term').value);
  const currentMonthlyPayment = parseFloat(document.getElementById('current-monthly-payment').value);
  const payoffGoal = parseFloat(document.getElementById('payoff-goal').value);
  const extraPayment = parseFloat(document.getElementById('extra-payment-amount').value);

  const totalInterestPaid = loanAmount * interestRate * loanTerm;
  const payoffDate = loanTerm - payoffGoal;
  const extraPaymentAmount = (totalInterestPaid / payoffDate) - currentMonthlyPayment;
  const newMonthlyPayment = currentMonthlyPayment + extraPaymentAmount;

  document.getElementById('result-summary').innerHTML = `
    <h3>Results</h3>
    <p>Original Payoff Date: ${loanTerm} years</p>
    <p>New Payoff Date: ${payoffGoal} years</p>
    <p>Total Interest Saved: $${(totalInterestPaid - (newMonthlyPayment * payoffGoal * 12)).toFixed(2)}</p>
    <p>Total Amount Paid: $${(newMonthlyPayment * payoffGoal * 12).toFixed(2)}</p>
  `;

  generateAmortizationSchedule(loanAmount, interestRate, loanTerm, currentMonthlyPayment);
  generateChart(newMonthlyPayment, currentMonthlyPayment, loanTerm);
}

function generateAmortizationSchedule(loanAmount, interestRate, loanTerm, monthlyPayment) {
  let balance = loanAmount;
  let tbody = document.getElementById('schedule-body');
  tbody.innerHTML = '';

  for (let i = 1; i <= loanTerm; i++) {
    const interestPaid = balance * interestRate;
    const principalPaid = monthlyPayment * 12 - interestPaid;
    balance -= principalPaid;

    tbody.innerHTML += `
      <tr>
        <td>${i}</td>
        <td>$${principalPaid.toFixed(2)}</td>
        <td>$${interestPaid.toFixed(2)}</td>
        <td>$${(principalPaid + interestPaid).toFixed(2)}</td>
        <td>$${balance.toFixed(2)}</td>
      </tr>
    `;
  }
}

function generateChart(newMonthlyPayment, currentMonthlyPayment, loanTerm) {
  const ctx = document.getElementById('payoff-chart').getContext('2d');
  const data = {
    labels: ['Original Payment', 'New Payment'],
    datasets: [{
      label: 'Monthly Payments',
      data: [currentMonthlyPayment, newMonthlyPayment],
      backgroundColor: ['#4ECDC4', '#00203FFF'],
      hoverOffset: 4
    }]
  };
  const config = {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        }
      }
    }
  };
  new Chart(ctx, config);
}

function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const loanAmount = document.getElementById('loan-amount').value;
  const interestRate = document.getElementById('interest-rate').value;
  const loanTerm = document.getElementById('loan-term').value;

  doc.text("Loan Payoff Summary", 10, 10);
  doc.text(`Loan Amount: ${loanAmount}`, 10, 20);
  doc.text(`Interest Rate: ${interestRate}%`, 10, 30);
  doc.text(`Loan Term: ${loanTerm} years`, 10, 40);

  doc.save("payoff-summary.pdf");
}
