const loadAllCategories = () => {
    fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) =>  displayCategories(data.categories));

};

const  displayCategories = (categories) => {
    const categoriesContainer = document.getElementById("all-categories");
    categoriesContainer.innerHTML = "";

    const allBtn = document.createElement("button");
        allBtn.textContent = "All Trees";
        allBtn.className = "btn bg-green-600 text-white rounded p-2";
        allBtn.onclick = () => loadAllPlants();
    categoriesContainer.appendChild(allBtn);

    categories.forEach((category) => {
        const btn = document.createElement("button");
        btn.textContent = category.category;
            btn.className = "btn bg-gray-200 rounded p-2";
            btn.onclick = () => loadByCategory(category.id, btn);
    categoriesContainer.appendChild(btn);
    })
}

const loadAllPlants = () => {
    toggleSpinner(true);
    fetch('https://openapi.programming-hero.com/api/plants')
      .then(res => res.json())
      .then(data => {
        displayPlants(data.plants);
        toggleSpinner(false);
    })
};

const loadByCategory = (id, btn) => {
  toggleSpinner(true);
  fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    .then(res => res.json())
    .then(data => {
      document.querySelectorAll("#all-categories button")
        .forEach(button => button.classList.remove("bg-green-600", "text-white"));
      btn.classList.add("bg-green-600", "text-white");
      displayPlants(data.data);
      toggleSpinner(false);
    });
};

const displayPlants = (plants) => {
  const treeContainer  = document.getElementById("tree-container");
  treeContainer .innerHTML = "";

  plants.forEach(plant => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-lg shadow p-4";
    card.innerHTML = `
      <img src="${plant.image}" alt="${plant.name}" class="rounded mb-2 h-32 w-full object-cover">
      <h3 class="font-semibold text-lg cursor-pointer text-green-800 underline">${plant.name}</h3>
      <p class="text-sm text-gray-600 mb-2">${plant.description.slice(0, 60)}...</p>
      <span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">${plant.category}</span>
      <p class="font-bold mt-2">৳${plant.price}</p>
      <button class="btn w-full mt-3 bg-green-600 text-white">Add to Cart</button>
    `;
      card.querySelector("h3").onclick = () => loadDetails(plant.id);

    // Add to Cart
      card.querySelector("button").onclick = () => addToCart(plant);
      treeContainer .appendChild(card);
  })
};


const loadDetails = (id) => {
  fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
    .then(res => res.json())
    .then(data => showModal(data.plant));
};

const showModal = (plant) => {
  alert(`
    ${plant.name}
    ${plant.image}
    Category: ${plant.category}
    Price: ৳${plant.price}
    Details: ${plant.description}
  `);
};



// Cart array will store all selected trees
let cart = [];
let total = 0;

// 🟢 Add item to cart
function addToCart(plant) {
  cart.push(plant);          // put plant into cart array
  total += plant.price;      // add its price to total
  showCart();                // update cart display
}

// 🟢 Remove item from cart
function removeFromCart(index) {
  total -= cart[index].price; // subtract price of that item
  cart.splice(index, 1);      // remove item from array
  showCart();                 // update cart display
}

// 🟢 Show cart items on right side
function showCart() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = ""; // clear old cart list

  // go through each item in the cart
  cart.forEach((item, i) => {
    const li = document.createElement("li");
    li.className = "flex justify-between bg-white shadow rounded p-2 mb-2";

    // show item name and price
    li.innerHTML = `
      <span>${item.name} - ৳${item.price}</span>
      <button class="text-red-600">❌</button>
    `;

    // ❌ button removes item
    li.querySelector("button").onclick = function() {
      removeFromCart(i);
    };

    cartList.appendChild(li); // add item to list
  });

  // update total
  document.getElementById("cart-total").textContent =  `Total: ৳${total}`;
}


const toggleSpinner = (show) => {
  let spinner = document.getElementById("spinner");
  if (!spinner) {
    spinner = document.createElement("div");
    spinner.id = "spinner";
    spinner.className = "text-center py-10 text-green-700 font-bold";
    spinner.textContent = "Loading...";
    document.getElementById("tree-container").appendChild(spinner);
  }
  spinner.style.display = show ? "block" : "none";
};








loadAllCategories();
loadAllPlants();
