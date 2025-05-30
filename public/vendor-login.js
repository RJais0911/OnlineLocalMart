const urlParams = new URLSearchParams(window.location.search);
const vendorId = urlParams.get("id");

fetch(`/vendor/${vendorId}`)
  .then((response) => response.json())
  .then((vendor) => {
    document.getElementById("vendorName").textContent = vendor.name;
    document.getElementById("vendorInfo").textContent = vendor.information;

    const items = vendor.items;

    const totalProducts = items.length;
    document.getElementById("totalProducts").textContent = totalProducts;

    if (totalProducts > 0) {
      const prices = items.map((item) => parseFloat(item.price));

      const avgPrice =
        prices.reduce((sum, price) => sum + price, 0) / totalProducts;
      document.getElementById("avgPrice").textContent = `₹${avgPrice.toFixed(
        2
      )}`;

      const highestPrice = Math.max(...prices);
      document.getElementById(
        "highestPrice"
      ).textContent = `₹${highestPrice.toFixed(2)}`;

      const lowestPrice = Math.min(...prices);
      document.getElementById(
        "lowestPrice"
      ).textContent = `₹${lowestPrice.toFixed(2)}`;
    }

    vendor.items.forEach((item) => {
      let itemCard = document.createElement("div");

      itemCard.classList.add("col-lg-4", "col-md-6", "col-sm-6");

      itemCard.innerHTML = `<div class="col1 card">
        <div class="prodimg" onclick="window.location.href='product-info.html?id=${item._id}'">
          <img class="card-img-top" src="${item.image_url}" alt="Card image cap">
        </div>
        <div class="card-body">
          <h5 class="card-title">₹${item.price}</h5>
          <p class="card-text">${item.description}</p>
          <a href="#" class="btn btn-primary">Edit Item</a>
        </div>
      </div>`;

      let itemsContainer = document.getElementById("row");
      itemsContainer.appendChild(itemCard);
    });
  })
  .catch((error) => {
    console.error("Error fetching vendor data:", error);
  });

const showAddItemFormButton = document.getElementById("showAddItemFormButton");
showAddItemFormButton.addEventListener("click", () => {
  document.getElementById("addItemForm").style.display = "block";
  document.getElementById("showAddItemFormButton").style.display = "none";
});

const cancelAddItemButton = document.getElementById("cancelAddItem");
cancelAddItemButton.addEventListener("click", () => {
  document.getElementById("addItemForm").style.display = "none";
  document.getElementById("showAddItemFormButton").style.display = "block";
  document.getElementById("addItemForm").reset(); // Reset the form
});

const addItemForm = document.getElementById("addItemForm");
const nameInput = addItemForm.querySelector("#name");
const priceInput = addItemForm.querySelector("#price");
const imageUrlInput = addItemForm.querySelector("#image_url");
const descriptionInput = addItemForm.querySelector("#description");

addItemForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value;
  const price = priceInput.value;
  const imageUrl = imageUrlInput.value;
  const description = descriptionInput.value;
  console.log(name, price, imageUrl, description);

  fetch("/add-item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      price: price,
      image_url: imageUrl,
      description: description,
      vendorId: vendorId,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        window.location.reload();
      } else {
        console.error(data.error);
      }
    })
    .catch((error) => {
      console.error(error);
    });
});

priceInput.addEventListener("input", function () {
  let value = this.value;
  value = value.replace(/[^\d.]/g, "");
  const parts = value.split(".");
  if (parts.length > 2) value = parts[0] + "." + parts.slice(1).join("");
  this.value = value;
});
