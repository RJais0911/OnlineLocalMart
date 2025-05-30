// product-info.js

class ProductPage {
    constructor() {
        this.productDetailsElement = document.getElementById('productDetails');
        this.relatedProductsElement = document.getElementById('relatedProducts');
        this.loadingElement = this.createLoadingElement();
        this.init();
    }

    init() {
        this.loadProductData();
        this.setupEventListeners();
    }

    createLoadingElement() {
        const loading = document.createElement('div');
        loading.className = 'loading';
        loading.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Loading...';
        return loading;
    }

    createErrorMessage(message) {
        return `
            <div class="error">
                <i class="fa fa-exclamation-circle"></i>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn btn-outline-danger">Try Again</button>
            </div>
        `;
    }

    createProductView(product) {
        return `
            <div class="product-view">
                <div class="product-image">
                    <img src="${product.image_url}" alt="${product.name}" 
                         onerror="this.src='placeholder-image.jpg'">
                </div>
                <div class="product-info">
                    <h1>${product.name}</h1>
                    <div class="price">₹${product.price.toLocaleString()}</div>
                    <div class="description">${product.description}</div>
                    <div class="vendor-info">
                        <a href="vendor-info.html?id=${product.vendor_id}" class="vendor-link">
                            <i class="fa fa-store"></i> View Vendor
                        </a>
                    </div>
                    <div class="product-meta">
                        <div class="stock-status">
                            <i class="fa fa-check-circle"></i> In Stock
                        </div>
                        <div class="delivery-info">
                            <i class="fa fa-truck"></i> Free Delivery
                        </div>
                    </div>
                    <div class="quantity-selector">
                        <label for="quantity">Quantity:</label>
                        <select id="quantity" class="form-select">
                            ${this.generateQuantityOptions()}
                        </select>
                    </div>
                    <div class="actions">
                        <button class="add-to-cart-btn" onclick="productPage.addToCart('${product._id}')">
                            <i class="fa fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="buy-now-btn" onclick="productPage.buyNow('${product._id}')">
                            <i class="fa fa-bolt"></i> Buy Now
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateQuantityOptions() {
        let options = '';
        for (let i = 1; i <= 10; i++) {
            options += `<option value="${i}">${i}</option>`;
        }
        return options;
    }

    async loadProductData() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (!productId) {
            this.productDetailsElement.innerHTML = this.createErrorMessage('No product ID provided.');
            return;
        }

        try {
            this.productDetailsElement.appendChild(this.loadingElement);

            const response = await fetch(`/api/products/${productId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const product = await response.json();
            this.productDetailsElement.innerHTML = this.createProductView(product);
            
            // Load related products
            this.loadRelatedProducts(product.vendor_id);

        } catch (error) {
            console.error('Error loading product data:', error);
            this.productDetailsElement.innerHTML = this.createErrorMessage(
                'Failed to load product information. Please try again later.'
            );
        }
    }

    async loadRelatedProducts(vendorId) {
        try {
            // Show loading state in related products section
            this.relatedProductsElement.innerHTML = `
                <h2>More Products from this Vendor</h2>
                <div class="related-products-grid">
                    <div class="loading">
                        <i class="fa fa-spinner fa-spin"></i> Loading related products...
                    </div>
                </div>
            `;

            const response = await fetch(`/vendor/${vendorId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const vendor = await response.json();

            // Get current product ID to exclude from related products
            const currentProductId = new URLSearchParams(window.location.search).get('id');

            // Filter out current product and get up to 4 related items
            const relatedItems = vendor.items
                .filter(item => item._id !== currentProductId)
                .slice(0, 4);

            if (!relatedItems || relatedItems.length === 0) {
                this.relatedProductsElement.innerHTML = `
                    <h2>More Products from this Vendor</h2>
                    <div class="related-products-grid">
                        <div class="no-related-products">
                            <i class="fa fa-info-circle"></i>
                            <p>No other products available from this vendor.</p>
                        </div>
                    </div>
                `;
                return;
            }

            const relatedProductsHTML = relatedItems
                .map(item => this.createRelatedProductCard(item))
                .join('');

            this.relatedProductsElement.innerHTML = `
                <h2>More Products from this Vendor</h2>
                <div class="related-products-grid">
                    ${relatedProductsHTML}
                </div>
            `;

            // Add animation to cards
            const cards = document.querySelectorAll('.related-product-card');
            cards.forEach((card, index) => {
                card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
            });

        } catch (error) {
            console.error('Error loading related products:', error);
            this.relatedProductsElement.innerHTML = `
                <h2>More Products from this Vendor</h2>
                <div class="related-products-grid">
                    <div class="error">
                        <i class="fa fa-exclamation-circle"></i>
                        <p>Failed to load related products.</p>
                    </div>
                </div>
            `;
        }
    }

    createRelatedProductCard(item) {
        return `
            <div class="related-product-card">
                <div class="product-image" onclick="window.location.href='product-info.html?id=${item._id}'" style="cursor: pointer;">
                    <img src="${item.image_url}" alt="${item.name}" 
                         onerror="this.src='placeholder-image.jpg'">
                </div>
                <div class="product-details">
                    <h3 class="product-title">${item.name}</h3>
                    <p class="product-price">₹${item.price.toLocaleString()}</p>
                    <button class="view-details-btn" onclick="window.location.href='product-info.html?id=${item._id}'">
                        <i class="fa fa-eye"></i> View Details
                    </button>
                </div>
            </div>
        `;
    }

    addToCart(productId) {
        const quantity = document.getElementById('quantity').value;
        // Implement cart functionality
        console.log(`Adding ${quantity} of product ${productId} to cart`);
        this.showNotification('Product added to cart successfully!');
    }

    buyNow(productId) {
        const quantity = document.getElementById('quantity').value;
        // Implement buy now functionality
        console.log(`Buying ${quantity} of product ${productId}`);
        window.location.href = `checkout.html?product=${productId}&quantity=${quantity}`;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fa fa-check-circle"></i>
            <p>${message}</p>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    setupEventListeners() {
        // Add any additional event listeners here
        window.addEventListener('load', () => {
            // Initialize any third-party components or plugins
        });
    }
}

// Initialize the product page
const productPage = new ProductPage();