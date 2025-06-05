// Dashboard logic
document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('sneaker_user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    document.getElementById('user-email').textContent = user.email;
    // Demo: Show last order from cart
    const orders = JSON.parse(localStorage.getItem('sneaker_orders') || '[]');
    let html = '';
    if (orders.length === 0) {
        html = '<p>No orders yet.</p>';
    } else {
        html = '<ul>';
        orders.forEach((order, idx) => {
            html += `<li>Order #${idx + 1}: ${order.items.length} item(s), Total: $${order.total}, Date: ${order.date}</li>`;
        });
        html += '</ul>';
    }
    document.getElementById('order-history').innerHTML = html;
    document.getElementById('logout-link').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('sneaker_user');
        window.location.href = 'index.html';
    });
});
