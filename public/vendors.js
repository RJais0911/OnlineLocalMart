// vendors.js


// Make a GET request to the backend endpoint to get all vendors
fetch('/vendors')
  .then(response => response.json())
  .then(vendors => {
    
    // Loop through each vendor and create a card for them
    vendors.forEach(vendor => {
      
      let vendorCard = document.createElement('div');
      vendorCard.classList.add('card');

      let vendorName = document.createElement('h2');
      vendorName.textContent = vendor.name;

      let vendorInfo = document.createElement('p');
      vendorInfo.textContent = vendor.information;

      // const vendorCategory = document.createElement('p');
      // vendorCategory.textContent = vendor.category;

      vendorCard.appendChild(vendorName);
      vendorCard.appendChild(vendorInfo);
vendorCard.addEventListener('click', () => {
  // Redirect to the vendor information page with the vendor ID as a query parameter
  window.location.href = `vendor-info.html?id=${vendor._id}`;
});

      
      
      let vendorsContainer = document.getElementById(vendor.category);
    
      vendorsContainer.appendChild(vendorCard);
    });
  })
  .catch(err => console.error(err));
