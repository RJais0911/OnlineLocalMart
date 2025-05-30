// vendor-info.js

// DOM Elements
const vendorNameElement = document.getElementById("vendorName");
const vendorInfoElement = document.getElementById("vendorInfo");
const itemsContainer = document.getElementById("row");
const loadingElement = document.createElement("div");
loadingElement.className = "loading";
loadingElement.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Loading...';

// Create error message element
const createErrorMessage = (message) => {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error";
  errorDiv.innerHTML = `
        <i class="fa fa-exclamation-circle"></i>
        <p>${message}</p>
        <button onclick="location.reload()" class="btn btn-outline-danger">Try Again</button>
    `;
  return errorDiv;
};

const createItemCard = (item) => {
  const itemCard = document.createElement("div");
  itemCard.classList.add("card-wrapper");

  itemCard.innerHTML = `
      <div class="col1 card">
          <div class="prodimg" onclick="window.location.href='product-info.html?id=${item._id}'" style="cursor: pointer;">
              <img src="${item.image_url}" alt="${item.name}" 
                   onerror="this.src='placeholder-image.jpg'">
          </div>
          <div class="card-body">
              <h3 class="card-title">${item.name}</h3>
              <h5 class="price">₹${item.price}</h5>
              <p class="card-text">${item.description}</p>
              <button class="add-to-cart">
                  <i class="fa fa-shopping-cart"></i> Add to Cart
              </button>
          </div>
      </div>
  `;
  return itemCard;
};

// Add to cart function (placeholder)
const addToCart = (itemId) => {
  console.log(`Adding item ${itemId} to cart`);
  // Implement cart functionality
};

// Load vendor data
const loadVendorData = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const vendorId = urlParams.get("id");

  if (!vendorId) {
    itemsContainer.appendChild(
      createErrorMessage("No vendor ID provided. Please try again.")
    );
    return;
  }

  try {
    // Show loading state
    itemsContainer.appendChild(loadingElement);

    const response = await fetch(`/vendor/${vendorId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const vendor = await response.json();

    // Update vendor information
    vendorNameElement.textContent = vendor.name;
    vendorInfoElement.textContent = vendor.information;

    // Clear loading state
    itemsContainer.innerHTML = "";

    // Check if vendor has items
    if (!vendor.items || vendor.items.length === 0) {
      itemsContainer.innerHTML = `
                <div class="no-items">
                    <i class="fa fa-info-circle"></i>
                    <p>No items available from this vendor yet.</p>
                </div>
            `;
      return;
    }

    // Create and append item cards
    vendor.items.forEach((item) => {
      const itemCard = createItemCard(item);
      itemsContainer.appendChild(itemCard);
    });

    // Add animation to cards
    const cards = document.querySelectorAll(".col1.card");
    cards.forEach((card, index) => {
      card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
    });
  } catch (error) {
    console.error("Error loading vendor data:", error);
    itemsContainer.innerHTML = "";
    itemsContainer.appendChild(
      createErrorMessage(
        "Failed to load vendor information. Please try again later."
      )
    );
  }
};

// Add CSS styles
const styles = `
    .items-section {
        max-width: 1400px;
        margin: 0 auto;
        padding: 20px;
    }

    .row {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 30px;
    }

    .card-wrapper {
        width: 400px;
        margin-bottom: 30px;
    }

    .col1.card {
        height: 100%;
        border: none;
        border-radius: 15px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        overflow: hidden;
        background-color: white;
    }

    .prodimg {
        height: 250px;
        overflow: hidden;
        position: relative;
    }

    .prodimg img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .card-body {
        padding: 25px;
    }

    .card-title {
        font-size: 1.6rem;
        color: #2c3e50;
        margin-bottom: 15px;
    }

    .price {
        color: #e67e22;
        font-size: 1.8rem;
        margin: 15px 0;
        font-weight: bold;
    }

    .card-text {
        font-size: 1.1rem;
        line-height: 1.6;
        color: #666;
        margin-bottom: 20px;
    }

    .add-to-cart {
        width: 100%;
        padding: 12px 25px;
        font-size: 1.1rem;
        background-color: #e67e22;
        border: none;
        border-radius: 8px;
        color: white;
        transition: all 0.3s ease;
    }

    .add-to-cart:hover {
        background-color: #d35400;
        transform: translateY(-2px);
    }

    /* Responsive Design */
    @media (max-width: 1400px) {
        .card-wrapper {
            width: 350px;
        }
    }

    @media (max-width: 768px) {
        .card-wrapper {
            width: 100%;
            max-width: 400px;
        }

        .prodimg {
            height: 250px;
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", loadVendorData);
