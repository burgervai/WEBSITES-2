// Simple login logic using localStorage
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const users = JSON.parse(localStorage.getItem('sneaker_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem('sneaker_user', JSON.stringify(user));
            document.getElementById('login-message').textContent = 'Login successful! Redirecting...';
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
        } else {
            document.getElementById('login-message').textContent = 'Invalid email or password.';
        }
    });
});
