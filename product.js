// Product customization logic
const basePrices = {
    classic: 50,
    runner: 65,
    hightop: 70,
    retro: 75,
    minimal: 60
};

const extrasPrices = {
    custom_laces: 5,
    engraving: 10,
    waterproof: 8,
    premium_box: 15,
    fast_shipping: 12
};

// Color mapping for preview
const colorMap = {
    '#ffffff': 'white',
    '#000000': 'black',
    '#e74c3c': 'red',
    '#3498db': 'blue',
    '#2ecc71': 'green',
    '#f1c40f': 'yellow',
    '#9b59b6': 'purple',
    '#e67e22': 'orange'
};

// Current selection state
let currentSelection = {
    style: 'classic',
    color: '#ffffff',
    size: '8',
    extras: []
};

// DOM Elements
const sneakerPreview = document.getElementById('sneaker-preview');
const colorOverlay = document.getElementById('color-overlay');
const sneakerTitle = document.getElementById('sneaker-title');
const totalPriceElement = document.getElementById('total-price');
const dynamicPriceElement = document.getElementById('dynamic-price');
const styleOptions = document.querySelectorAll('.style-option');
const colorOptions = document.querySelectorAll('.color-option');
const sizeOptions = document.querySelectorAll('.size-option');
const extraOptions = document.querySelectorAll('.extra-option input[type="checkbox"]');
const customizeForm = document.getElementById('customize-form');

// Update sneaker preview
function updateSneakerPreview() {
    // Update main preview image based on style
    sneakerPreview.src = `assets/sneaker-${currentSelection.style}.png`;
    
    // Update color overlay
    colorOverlay.style.backgroundColor = currentSelection.color;
    
    // Update sneaker title
    const styleName = {
        classic: 'Classic White',
        runner: 'Sport Runner',
        hightop: 'Urban High-Top',
        retro: 'Retro Runner',
        minimal: 'Minimalist'
    }[currentSelection.style];
    
    sneakerTitle.textContent = styleName;
    
    // Add animation
    sneakerPreview.style.animation = 'none';
    sneakerPreview.offsetHeight; // Trigger reflow
    sneakerPreview.style.animation = 'fadeIn 0.5s ease-in-out';
}

// Calculate total price
function calculateTotalPrice() {
    let total = basePrices[currentSelection.style] || 0;
    
    // Add extras prices
    currentSelection.extras.forEach(extra => {
        total += extrasPrices[extra] || 0;
    });
    
    // Update price displays
    totalPriceElement.textContent = `$${total}`;
    dynamicPriceElement.textContent = total;
    
    return total;
}

// Update active states
function updateActiveStates() {
    // Style options
    styleOptions.forEach(option => {
        if (option.dataset.style === currentSelection.style) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // Color options
    colorOptions.forEach(option => {
        if (option.dataset.color === currentSelection.color) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // Size options
    sizeOptions.forEach(option => {
        if (option.textContent === currentSelection.size) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // Extra options
    extraOptions.forEach(option => {
        option.checked = currentSelection.extras.includes(option.value);
    });
}

// Initialize the page
function init() {
    // Style option click handler
    styleOptions.forEach(option => {
        option.addEventListener('click', () => {
            currentSelection.style = option.dataset.style;
            updateSneakerPreview();
            updateActiveStates();
            calculateTotalPrice();
        });
    });
    
    // Color option click handler
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            currentSelection.color = option.dataset.color;
            updateSneakerPreview();
            updateActiveStates();
        });
    });
    
    // Size option click handler
    sizeOptions.forEach(option => {
        option.addEventListener('click', () => {
            currentSelection.size = option.textContent;
            updateActiveStates();
        });
    });
    
    // Extra options change handler
    extraOptions.forEach(option => {
        option.addEventListener('change', () => {
            if (option.checked) {
                if (!currentSelection.extras.includes(option.value)) {
                    currentSelection.extras.push(option.value);
                }
            } else {
                currentSelection.extras = currentSelection.extras.filter(item => item !== option.value);
            }
            calculateTotalPrice();
        });
    });
    
    // Form submission
    customizeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get current user
        const user = JSON.parse(localStorage.getItem('sneaker_user'));
        if (!user) {
            alert('Please log in to add items to cart');
            window.location.href = 'login.html';
            return;
        }
        
        // Create cart item
        const cartItem = {
            id: Date.now().toString(),
            style: currentSelection.style,
            color: colorMap[currentSelection.color] || currentSelection.color,
            size: currentSelection.size,
            extras: currentSelection.extras,
            price: calculateTotalPrice(),
            image: `assets/sneaker-${currentSelection.style}.png`,
            colorCode: currentSelection.color,
            createdAt: new Date().toISOString()
        };
        
        // Add to cart
        const cart = JSON.parse(localStorage.getItem('sneaker_cart') || '[]');
        cart.push(cartItem);
        localStorage.setItem('sneaker_cart', JSON.stringify(cart));
        
        // Show success message
        const addToCartBtn = document.querySelector('.btn-add-to-cart');
        const originalText = addToCartBtn.innerHTML;
        addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
        addToCartBtn.style.backgroundColor = '#28a745';
        
        // Reset button after delay
        setTimeout(() => {
            addToCartBtn.innerHTML = originalText;
            addToCartBtn.style.backgroundColor = '';
            window.location.href = 'cart.html';
        }, 1500);
    });
    
    // Wishlist button
    document.querySelector('.btn-wishlist').addEventListener('click', () => {
        const user = JSON.parse(localStorage.getItem('sneaker_user'));
        if (!user) {
            alert('Please log in to add items to your wishlist');
            window.location.href = 'login.html';
            return;
        }
        
        const wishlistItem = {
            id: Date.now().toString(),
            style: currentSelection.style,
            color: currentSelection.color,
            size: currentSelection.size,
            image: `assets/sneaker-${currentSelection.style}.png`,
            price: basePrices[currentSelection.style] || 0,
            createdAt: new Date().toISOString()
        };
        
        const wishlist = JSON.parse(localStorage.getItem('sneaker_wishlist') || '[]');
        wishlist.push(wishlistItem);
        localStorage.setItem('sneaker_wishlist', JSON.stringify(wishlist));
        
        const wishlistBtn = document.querySelector('.btn-wishlist');
        wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> Added to Wishlist';
        wishlistBtn.style.color = '#e74c3c';
        
        setTimeout(() => {
            wishlistBtn.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
            wishlistBtn.style.color = '';
        }, 2000);
    });
    
    // Initialize the view
    updateSneakerPreview();
    updateActiveStates();
    calculateTotalPrice();
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0.5; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
