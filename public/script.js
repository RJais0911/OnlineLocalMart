// Get the reference to the row div
const row = document.querySelector('.products');

// Function to create a card element
function createCard(item) {
  const colDiv = document.createElement('div');
  colDiv.className = 'col-lg-4 col-md-6 col-sm-6';

  const cardDiv = document.createElement('div');
  cardDiv.className = 'col1 card';

  const prodImgDiv = document.createElement('div');
  prodImgDiv.className = 'prodimg';

  const img = document.createElement('img');
  img.className = 'card-img-top';
  img.src = item.image;
  img.alt = 'Card image cap';
  
  prodImgDiv.appendChild(img);

  const cardBodyDiv = document.createElement('div');
  cardBodyDiv.className = 'card-body';

  const title = document.createElement('h5');
  title.className = 'card-title';
  // title.textContent = item.title;
  title.innerHTML = '&#x20B9; ' + item.title;

  const description = document.createElement('p');
  description.className = 'card-text';
  description.textContent = item.description;

  const link = document.createElement('a');
  link.href = '#';
  link.className = 'btn btn-primary';
  link.textContent = 'Add to cart';

  cardBodyDiv.appendChild(title);
  cardBodyDiv.appendChild(description);
  cardBodyDiv.appendChild(link);

  cardDiv.appendChild(prodImgDiv);
  cardDiv.appendChild(cardBodyDiv);

  colDiv.appendChild(cardDiv);

  return colDiv;
}

// Fetch the items from the backend API
fetch('/featured')
  .then(response => response.json())
  .then(data => {
    // Iterate over the items and create cards
    data.forEach(item => {
      const card = createCard(item);
      row.appendChild(card);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });

