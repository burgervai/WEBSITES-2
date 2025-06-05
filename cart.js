// Shopping cart logic
document.addEventListener('DOMContentLoaded', function() {
    const CART_KEY = 'sneaker_cart';

    // Format price to 2 decimal places
    function formatPrice(price) {
        return parseFloat(price).toFixed(2);
    }

    // Get style display name
    function getStyleName(style) {
        const styles = {
            'classic': 'Classic White',
            'runner': 'Sport Runner',
            'hightop': 'Urban High-Top',
            'retro': 'Retro Runner',
            'minimal': 'Minimalist'
        };
        return styles[style] || style;
    }

    // Render cart items
    function renderCartItems() {
        const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        const cartItemsEl = document.getElementById('cart-items');
        const emptyCartEl = document.getElementById('empty-cart');
        const cartSummaryEl = document.getElementById('cart-summary');
        
        if (cart.length === 0) {
            cartItemsEl.innerHTML = '';
            emptyCartEl.style.display = 'block';
            cartSummaryEl.style.display = 'none';
            return;
        }
        
        emptyCartEl.style.display = 'none';
        cartSummaryEl.style.display = 'block';
        
        let subtotal = 0;
        let html = '';
        
        cart.forEach((item, index) => {
            const itemTotal = item.quantity * item.price;
            subtotal += itemTotal;
            
            html += `
                <div class="cart-item" data-index="${index}">
                    <img src="${item.image || 'assets/sneaker-classic.png'}" alt="${item.style}" class="item-image" style="background-color: ${item.colorCode || '#f5f5f5'}">
                    <div class="item-details">
                        <h4>${getStyleName(item.style)}</h4>
                        <div class="item-options">
                            <div><strong>Color:</strong> ${item.color || 'White'}</div>
                            <div><strong>Size:</strong> ${item.size || '8'}</div>
                            ${item.extras && item.extras.length > 0 ? 
                                `<div><strong>Extras:</strong> ${item.extras.map(extra => 
                                    extra.split('_').map(word => 
                                        word.charAt(0).toUpperCase() + word.slice(1)
                                    ).join(' ')
                                ).join(', ')}</div>` : ''
                            }
                        </div>
                    </div>
                    <div class="item-price">$${formatPrice(item.price)}</div>
                    <div class="item-quantity">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity || 1}" min="1" data-index="${index}">
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                    <div class="remove-item" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
            `;
        });
        
        cartItemsEl.innerHTML = html;
        updateCartSummary(subtotal);
        
        // Add event listeners
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', handleQuantityChange);
        });
        
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', handleQuantityInput);
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', removeItem);
        });
        
        // Update cart count in header
        updateCartCount();
    }

    // Update cart summary
    function updateCartSummary(subtotal) {
        const subtotalEl = document.getElementById('subtotal');
        const totalEl = document.getElementById('total');
        
        subtotalEl.textContent = `$${formatPrice(subtotal)}`;
        totalEl.textContent = `$${formatPrice(subtotal)}`; // In a real app, add shipping and tax
    }

    // Handle quantity button clicks
    function handleQuantityChange(e) {
        const index = parseInt(e.target.dataset.index);
        const isPlus = e.target.classList.contains('plus');
        const input = document.querySelector(`.quantity-input[data-index="${index}"]`);
        let quantity = parseInt(input.value) || 1;
        
        if (isPlus) {
            quantity++;
        } else {
            quantity = Math.max(1, quantity - 1);
        }
        
        updateCartItemQuantity(index, quantity);
    }

    // Handle direct quantity input
    function handleQuantityInput(e) {
        const index = parseInt(e.target.dataset.index);
        let quantity = parseInt(e.target.value) || 1;
        
        if (quantity < 1) {
            quantity = 1;
            e.target.value = 1;
        }
        
        updateCartItemQuantity(index, quantity);
    }

    // Update item quantity in cart
    function updateCartItemQuantity(index, quantity) {
        const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        if (cart[index]) {
            cart[index].quantity = quantity;
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
            renderCartItems();
        }
    }

    // Remove item from cart
    function removeItem(e) {
        const index = parseInt(e.currentTarget.dataset.index);
        const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        
        // Show confirmation dialog
        if (confirm('Are you sure you want to remove this item from your cart?')) {
            cart.splice(index, 1);
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
            renderCartItems();
            
            // Show removed notification
            showNotification('Item removed from cart');
        }
    }

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Add styles if not already added
        if (!document.getElementById('notification-style')) {
            const style = document.createElement('style');
            style.id = 'notification-style';
            style.textContent = `
                .notification {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #333;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 4px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 1000;
                    opacity: 0;
                    transition: opacity 0.3s, transform 0.3s;
                }
                .notification.show {
                    opacity: 1;
                    transform: translateX(-50%) translateY(-10px);
                }
            `;
            document.head.appendChild(style);
        }
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Update cart count in header
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        const cartCount = document.getElementById('cart-count');
        const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        
        if (totalItems > 0) {
            cartCount.textContent = totalItems;
            cartCount.style.display = 'inline-block';
        } else {
            cartCount.style.display = 'none';
        }
    }

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem('sneaker_user'));
        if (!user) {
            // Redirect to login if not logged in
            window.location.href = 'login.html?redirect=cart.html';
            return;
        }
        
        // Initialize cart
        renderCartItems();
        
        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', (e) => {
                const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
                if (cart.length === 0) {
                    e.preventDefault();
                    alert('Your cart is empty. Please add items before checking out.');
                }
                // Otherwise, the link will proceed to checkout.html
            });
        }
        
        // Update cart count on page load
        updateCartCount();
    });
});
