const loadAllCategories = () => {
    fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories));
};

// 1..Category Loading Load Tree Categories dynamically on the left side
const displayCategories = (categories) => {
    const categoriesContainer = document.getElementById("all-categories");
    categoriesContainer.innerHTML = "";

    const allBtn = document.createElement("button");
        allBtn.textContent = "All Trees";
        allBtn.className = "btn bg-green-600 text-white rounded p-2";
        allBtn.id ="all-bnt"
        // allBtn.onclick = loadAllPlants()  //
        allBtn.setAttribute('onclick', "loadAllPlants(this)")
        console.log(allBtn)
         categoriesContainer.appendChild(allBtn);

    categories.forEach((category) => {
        const btn = document.createElement("button");
        btn.textContent = category.category_name;
            btn.className = "btn bg-gray-200 rounded p-2";
            btn.onclick = () => loadByCategory(category.id, btn);
    categoriesContainer.appendChild(btn);
    })
};

const loadAllPlants = (event) => {
  console.log(event)
    document.querySelectorAll("#all-categories button")
        .forEach(button => button.classList.remove("bg-green-600", "text-white"));
      event?.classList.add("bg-green-600", "text-white");
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
      displayPlants(data.plants);
      toggleSpinner(false);
    });
};

// 2.. Category Click → Tree Data On clicking a category: load trees of that category.
const displayPlants = (plants) => {
  const treeContainer  = document.getElementById("tree-container");
  treeContainer .innerHTML = "";
// 3.. Card Contents Each card includes:
  plants.forEach(plant => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-lg shadow p-4";
    card.innerHTML = `
     <img src="${plant.image}" alt="${plant.name}" class="w-full h-32 object-cover rounded">
      <h3 class="font-bold text-lg mt-2">${plant.name}</h3>
      <p class="text-sm text-gray-600">${plant.description}</p>
      <div class="flex justify-between items-center space-y-4"> 
      <p class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">${plant.category}</p>
      <p class="font-semibold">৳${plant.price}</p>
      </div>
      <button class="w-full mt-2 bg-green-600 text-white px-3 py-1 rounded">Add to Cart</button>
    `;
      card.querySelector("img").onclick = () => loadDetails(plant.id);
      card.querySelector("button").onclick = () => addToCart(plant);
      treeContainer.appendChild(card);
  })
};

// 4..Modal on Card Click Clicking a tree name on a card opens a modal with full tree details.
const loadDetails = async (id) => {
  const url = ` https://openapi.programming-hero.com/api/plant/${id} `;
    const res = await fetch(url);
    const details = await res.json();
    displayDetails(details.plants);
};

const displayDetails = (plant) => {
  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML = `
          <div class="">
            <h2 class="text-2xl font-bold">
              ${plant.name}</h2>
          </div>
          <div class=""> <img class="w-full h-[300px]" src=${plant.image}/></div>
          <div class="">
            <h2 class="font-bold">Category : ${plant.category}</h2>
            <p>Price: ৳ ${plant.price}</p>
          </div>
          <div class="">
            <h2 class="font-bold">Details : ${plant.description}</h2>
          </div>
    `;
  document.getElementById("plants_modal").showModal();
};

// .. Challenges..............
let cart = [];
let total = 0;

function addToCart(plant) {
  cart.push(plant);          
  total += plant.price;     
  showCart();                
}

function removeFromCart(index) {
  total -= cart[index].price; 
  cart.splice(index, 1);      
  showCart();                
}

function showCart() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = ""; 
  cart.forEach((item, i) => {
    const li = document.createElement("li");
    li.className = "flex justify-between bg-white shadow rounded p-2 mb-2";
    li.innerHTML = `
      <span>${item.name} - ৳ ${item.price}</span>
      <button class="text-red-600">❌</button>
    `;
    li.querySelector("button").onclick = function() {
      removeFromCart(i);
    };
    cartList.appendChild(li); 
  });
  document.getElementById("cart-total").textContent =  `Total: ৳ ${total}`;
}
//...4) Loading Spinner......
const toggleSpinner = (show) => {
  let spinner = document.getElementById("spinner");
  if (!spinner) {
    spinner = document.createElement("div");
    spinner.id = "spinner";
    spinner.className = "text-center py-10 text-green-700 font-bold";
    spinner.innerHTML = `<span class="loading loading-infinity loading-xl items-center"></span>`;
    document.getElementById("tree-container").appendChild(spinner);
  }
  spinner.style.display = show ? "block" : "none";
};

loadAllCategories();
loadAllPlants();
