// Simple registration logic using localStorage
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        let users = JSON.parse(localStorage.getItem('sneaker_users') || '[]');
        if (users.find(u => u.email === email)) {
            document.getElementById('register-message').textContent = 'Email already registered.';
            return;
        }
        const user = { email, password };
        users.push(user);
        localStorage.setItem('sneaker_users', JSON.stringify(users));
        document.getElementById('register-message').textContent = 'Registration successful! Redirecting to login...';
        setTimeout(() => { window.location.href = 'login.html'; }, 1000);
    });
});
