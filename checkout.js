// Checkout logic
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        // For demo: clear cart and show message
        localStorage.removeItem('sneaker_cart');
        document.getElementById('checkout-message').innerHTML = '<p>Thank you for your order! (Demo: No real payment processed.)</p>';
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    });
});
