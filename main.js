// Main JS for homepage and navigation
window.addEventListener('DOMContentLoaded', () => {
    // Example: Hide login/register if user is logged in (demo)
    const user = localStorage.getItem('sneaker_user');
    if (user) {
        document.getElementById('login-link').style.display = 'none';
        document.getElementById('register-link').style.display = 'none';
    }
});
