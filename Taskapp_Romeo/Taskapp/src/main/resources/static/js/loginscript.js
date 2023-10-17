function login() {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Create a FormData object to send the data to the server
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    // Make an AJAX request to the server
    fetch('/login', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(result => {
        if (result === 'success') {
            // Redirect to the teamview page on successful login
            window.location.href = '/teamview';
        } else {
            // Display an error message on failed login
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Invalid username or password. Please try again.';
            errorMessage.style.color = 'red';
            document.querySelector('.login-container').appendChild(errorMessage);
        }
    })
    .catch(error => console.error('Login error:', error));
}


