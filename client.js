document.addEventListener('DOMContentLoaded', function () {
    const triageForm = document.getElementById('triageForm');
    const waitlistContainer = document.getElementById('waitlist');

    triageForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const nameInput = document.getElementById('name');
        const codeInput = document.getElementById('code');
        const severityInput = document.getElementById('severity');
        const waitTimeInput = document.getElementById('waitTime');

        try {
            const response = await fetch('/addPatient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: nameInput.value,
                    code: codeInput.value,
                    severity: severityInput.value,
                    waitTime: parseInt(waitTimeInput.value),
                }),
            });

            const result = await response.json();

            if (result.success) {
                updateWaitlist();
            } else {
                console.error('Failed to add patient:', result);
                alert('Failed to add patient. Please try again.');
            }
        } catch (error) {
            console.error('Error on form submission:', error);
            alert('Internal Server Error. Please try again later.');
        }

        nameInput.value = '';
        codeInput.value = '';
        severityInput.value = 'low';
        waitTimeInput.value = '';
    });

    async function updateWaitlist() {
        try {
            const response = await fetch('/getTriageList');
            const triageList = await response.json();

            waitlistContainer.innerHTML = '';

            triageList.forEach(patient => {
                const patientElement = document.createElement('div');
                patientElement.classList.add('patient');
                patientElement.textContent = `Name: ${patient.name} | Code: ${patient.code} | Severity: ${patient.severity} | Wait Time: ${patient.waitTime} minutes`;

                waitlistContainer.appendChild(patientElement);
            });
        } catch (error) {
            console.error('Error updating waitlist:', error);
            alert('Error updating waitlist. Please try again later.');
        }
    }

    updateWaitlist();
});
