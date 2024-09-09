document.getElementById('credit-score-estimator').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const borrowerName = document.getElementById('borrower-name').value;
    const borrowerPhone = document.getElementById('borrower-phone').value;
    const borrowerAddress = document.getElementById('borrower-address').value;
    const borrowerEmail = document.getElementById('borrower-email').value;
    const paymentHistory = parseFloat(document.getElementById('payment-history').value);
    const creditUtilization = parseFloat(document.getElementById('credit-utilization').value);
    const creditHistory = parseFloat(document.getElementById('credit-history').value);
    const creditTypes = parseFloat(document.getElementById('credit-types').value);
    const newCredit = parseFloat(document.getElementById('new-credit').value);
    const consent = document.getElementById('consent').checked;

    // Ensure the user has given consent
    if (!consent) {
        alert('You must give consent to proceed.');
        return;
    }

    // Calculate credit score (approximation)
    const estimatedScore = (paymentHistory * 0.35 + 
                            creditUtilization * 0.30 + 
                            creditHistory * 0.15 + 
                            creditTypes * 0.10 + 
                            newCredit * 0.10) * 850;

    const scoreDisplay = document.getElementById('score-result');
    const scoreTips = document.getElementById('score-tips');

    // Display result with color coding and match tips color
    if (estimatedScore >= 750) {
        scoreDisplay.style.color = 'green';
        scoreDisplay.innerText = `Your estimated credit score is: ${Math.round(estimatedScore)} (Very Good)`;
        scoreTips.style.color = 'green'; // Match color with result
        scoreTips.innerHTML = `
            <p>Tips to Maintain a Good Score:</p>
            <ul>
                <li>Continue making timely payments.</li>
                <li>Keep credit utilization below 30%.</li>
                <li>Avoid applying for unnecessary new credit.</li>
            </ul>`;
    } else if (estimatedScore >= 650 && estimatedScore < 750) {
        scoreDisplay.style.color = 'orange';
        scoreDisplay.innerText = `Your estimated credit score is: ${Math.round(estimatedScore)} (Needs Improvement)`;
        scoreTips.style.color = 'orange'; // Match color with result
        scoreTips.innerHTML = `
            <p>Tips to Improve Your Score:</p>
            <ul>
                <li>Reduce your credit utilization to below 30%.</li>
                <li>Ensure no missed payments going forward.</li>
                <li>Avoid frequent credit inquiries.</li>
            </ul>`;
    } else {
        scoreDisplay.style.color = 'red';
        scoreDisplay.innerText = `Your estimated credit score is: ${Math.round(estimatedScore)} (Poor)`;
        scoreTips.style.color = 'red'; // Match color with result
        scoreTips.innerHTML = `
            <p>Tips to Improve Your Score:</p>
            <ul>
                <li>Focus on paying off outstanding debts.</li>
                <li>Make sure all payments are made on time.</li>
                <li>Avoid applying for new credit until your score improves.</li>
            </ul>`;
    }

    // Submit data to Google Sheets via POST request
    const url = "https://script.google.com/macros/s/AKfycbzTcNuawGsXVtEvnCZ1GNY-Bo77a6Q_BEvVvlPln5ZrkCcyyd1jykiyvHNt3N_FfyG-Hw/exec"; // Replace with your Google Apps Script Web App URL
    const data = {
        borrowerName: borrowerName,
        borrowerPhone: borrowerPhone,
        borrowerAddress: borrowerAddress,
        borrowerEmail: borrowerEmail,
        estimatedScore: Math.round(estimatedScore)
    };

    fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data).toString()
    })
    .then(() => {
        alert('Your information has been submitted and your estimated credit score is displayed.');
    })
    .catch(err => {
        alert('Error submitting data: ' + err);
    });
});
