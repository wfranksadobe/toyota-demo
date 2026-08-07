/**
 * Get Full Name
 * @name getFullName Concats first name and last name
 * @param {string} firstname in Stringformat
 * @param {string} lastname in Stringformat
 * @return {string}
 */
function getFullName(firstname, lastname) {
  return `${firstname} ${lastname}`.trim();
}

/**
 * Custom submit function
 * @param {scope} globals
 */
function submitFormArrayToString(globals) {
  const data = globals.functions.exportData();
  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      data[key] = data[key].join(',');
    }
  });
  globals.functions.submitForm(data, true, 'application/json');
}

/**
 * Calculate the number of days between two dates.
 * @param {*} endDate
 * @param {*} startDate
 * @returns {number} returns the number of days between two dates
 */
function days(endDate, startDate) {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  // return zero if dates are valid
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const diffInMs = Math.abs(end.getTime() - start.getTime());
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

/**
 * Calculate approximate monthly loan repayment.
 * @param {number} loanAmount total loan amount
 * @param {string} loanTerm loan term in months, e.g. "36"
 * @param {string} interestRate annual interest rate, e.g. "6.5" for 6.5%
 * @returns {number} approximate monthly repayment
 */
function calculateMonthlyRepayment(loanAmount, loanTerm, interestRate) {
  const principal = Number(loanAmount);
  const months = Number(loanTerm);
  const annualRate = Number(interestRate);

  if (
    Number.isNaN(principal)
    || Number.isNaN(months)
    || Number.isNaN(annualRate)
    || principal <= 0
    || months <= 0
    || annualRate < 0
  ) {
    return 0;
  }

  // Handle 0% interest separately
  if (annualRate === 0) {
    return principal / months;
  }

  const monthlyRate = annualRate / 100 / 12;

  return (
    (principal * monthlyRate)
    / (1 - ((1 + monthlyRate) ** -months))
  );
}

/**
 * Calculate estimated balloon payment based on loan term.
 * @param {number|string} loanAmount total loan amount
 * @param {string} loanTerm loan term in months, e.g. "36"
 * @returns {number} estimated balloon payment
 */
function calculateBalloonPayment(loanAmount, loanTerm) {
  const principal = Number(loanAmount);
  const months = Number(loanTerm);

  if (
    Number.isNaN(principal)
    || Number.isNaN(months)
    || principal <= 0
    || months <= 0
  ) {
    return 0;
  }

  const balloonPercentages = {
    12: 20,
    24: 15,
    36: 10,
    48: 7.5,
    60: 5,
  };

  const balloonPercentage = balloonPercentages[months];

  if (balloonPercentage === undefined) {
    return 0;
  }

  return principal * (balloonPercentage / 100);
}


// eslint-disable-next-line import/prefer-default-export
export { getFullName, days, submitFormArrayToString, calculateMonthlyRepayment, calculateBalloonPayment };
