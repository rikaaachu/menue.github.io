async function fetchMenuItems() {
    try {
        const response = await fetch('get_menu_items.php'); 
        const menuItems = await response.json();
        console.log("Menu items fetched:", menuItems);  
        displayMenuItems(menuItems);  
    } catch (error) {
        console.error("Error fetching menu items:", error);
    }
}

function viewMore(category) {
    fetch(`get_menu_items.php?category=${encodeURIComponent(category)}`)
        .then(response => response.json())
        .then(data => {
            console.log("Category items fetched:", data); 
            displayMenuItems(data); 
        })
        .catch(error => console.error("Error fetching category items:", error));
}

function displayMenuItems(items) {
    const menuList = document.getElementById('menu-list');
    menuList.innerHTML = '';  
    if (Array.isArray(items) && items.length > 0) {
        items.forEach(item => {
            console.log("Displaying item:", item); 

            const dish = item.dish || 'Dish not found';
            const category = item.category || 'Category not found';
            const price = item.price ? `PHP ${parseFloat(item.price).toFixed(2)}` : 'Price not found';

            const menuItemHtml = `
                <li class="menu-item">
                    <h3>${dish}</h3>
                    <p>Category: ${category}</p>
                    <p>${price}</p>
                    <button onclick="addToCart(${item.d_id})">Add to Cart</button>
                </li>
            `;
            menuList.innerHTML += menuItemHtml;
        });
    } else {
        menuList.innerHTML = '<p>No items available in this category.</p>';
    }
}

fetchMenuItems();

const drinksItems = {
    "milktea": [
        "Hokaido",
        "Okinawa",
        "Matcha Green Tea",
        "Wintermelon",
        "Taro",
        "Salted Caramel",
        "Cookies & Cream",
        "Salted Cream Cheese",
        "Dark Chocolate",
        "Classic Milktea",
        "Blueberry",
        "Strawberry",
    ],
    "hot": [
        "Hot Tea - PHP 50.00",
        "Brewed Coffee - PHP 65.00",
        "Cafe Latte - PHP 70.00",
        "Salted Caramel Mocha - PHP 70.00",
        "Dark Choco Mocha - PHP 70.00",
        "Hazelnut Latte - PHP 70.00",
        "Cafe Americano - PHP 65.00"
    ]
};

async function showMenuItems(category) {
    const menuCategoryTitle = document.getElementById('menu-category-title');
    const menuList = document.getElementById('menu-list');
    const bestSellersSection = document.querySelector('.best-seller-section');
    const menuItemsSection = document.getElementById('menu-items');

    menuCategoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ");
    menuList.innerHTML = '';  

    try {
        const response = await fetch(`get_menu_items.php?category=${encodeURIComponent(category)}`);
        const menuItems = await response.json();
        console.log(`Menu items for category '${category}'`, menuItems);

        if (menuItems && menuItems.length > 0) {
            menuItems.forEach(item => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <h2>${item.dish}</h2>
                    <p>${item.category}</p>
                    <p>PHP ${item.price}</p>
                    <button onclick="addToCart(${item.d_id})">Add to Cart</button>
                `;
                menuList.appendChild(listItem);
            });
        } else {
            menuList.innerHTML = '<li>No items available in this category.</li>';
        }

        bestSellersSection.style.display = 'none';
        menuItemsSection.style.display = 'block';

    } catch (error) {
        console.error("Error loading category items:", error);
        menuList.innerHTML = '<li>Error loading items.</li>';
    }
}

document.querySelectorAll('.view-more').forEach(button => {
    button.addEventListener('click', (e) => {
        const category = e.target.getAttribute('data-category');
        showMenuItems(category);
    });
});

const backBtn = document.getElementById('back-btn');
backBtn.addEventListener('click', () => {
    document.querySelector('.best-seller-section').style.display = 'flex';
    document.getElementById('menu-items').style.display = 'none';
    document.getElementById('menu-category-title').textContent = '';
});

function addToCart(d_id) {
    console.log(`Adding item ${d_id} to cart`);
}

document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function() {
        const dishId = this.getAttribute('data-dish-id');
        const quantity = 1; // You can modify this based on user input

        fetch('cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `dish_id=${dishId}&quantity=${quantity}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
            } else if (data.error) {
                alert('Error: ' + data.error);
            }
        })
        .catch(error => console.error('Error:', error));
    });
});

// Function to add item to the cart
function addToCart(dishId) {
    const quantity = 1; // Default quantity; can be adjusted for user input
    fetch('cart.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `dish_id=${dishId}&quantity=${quantity}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            checkout(); // Refresh the cart display
        } else if (data.error) {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Function to decrease the quantity of an item in the cart
function removeFromCart(dishId) {
    const quantity = -1; // Negative quantity to decrease
    fetch('cart.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `dish_id=${dishId}&quantity=${quantity}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            checkout(); // Refresh the cart display
        } else if (data.error) {
            alert('Error: ' + data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Function to retrieve and display cart items immediately
function checkout() {
    fetch('cart.php')
    .then(response => response.json())
    .then(data => {
        const cartList = document.getElementById('cart-list');
        cartList.innerHTML = ''; // Clear the current list
        if (data.length) {
            data.forEach(item => {
                const listItem = document.createElement('li');
                listItem.style.listStyleType = 'none'; // Remove bullet points
                listItem.innerHTML = `
                    ${item.dish} - Quantity: ${item.quantity}
                    <button onclick="removeFromCart(${item.dish_id})">Remove</button>
                `;
                cartList.appendChild(listItem);
            });
        } else {
            cartList.innerHTML = '<li>Your cart is empty.</li>';
        }
    })
    .catch(error => console.error('Error:', error));
}


