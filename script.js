
const selectedItemsArray = [];  // array for storing atiom



// check category and enable dropdown list

function clickme1(n1) {
    const fruitsElements = ['itm1', 'qnt1', 'add1'];
    const nonVegElements = ['itm2', 'qnt2', 'add2'];
    const vegetablesElements = ['itm3', 'qnt3', 'add3'];

    const disableElements = [fruitsElements, nonVegElements, vegetablesElements];
    let enableElements = [];

    if (n1 === 'fruits') enableElements = fruitsElements;
    else if (n1 === 'non-veg') enableElements = nonVegElements;
    else if (n1 === 'vegetables') enableElements = vegetablesElements;
    else {
        console.log('Category not recognized');
        return;
    }

    disableElements.forEach(elements => {
        elements.forEach(element => {
            const el = document.getElementById(element);
            el.disabled = !enableElements.includes(element);
        });
    });
}


// add item from category
function add(category) {
    let selectedItem, selectedQuantity;

    if (category === 'fruits') {
        selectedItem = document.getElementById('itm1');
        selectedQuantity = document.getElementById('qnt1');
    } else if (category === 'non-veg') {
        selectedItem = document.getElementById('itm2');
        selectedQuantity = document.getElementById('qnt2');
    } else if (category === 'vegetables') {
        selectedItem = document.getElementById('itm3');
        selectedQuantity = document.getElementById('qnt3');
    } else {
        console.log('Category not recognized');
        return;
    }

    if (!selectedItem.value || !selectedQuantity.value) {

        if (!selectedItem.value) {
            selectedItem.setCustomValidity('Please select an item');
            selectedItem.reportValidity();
            return;
        } else if (!selectedQuantity.value) {
            selectedQuantity.setCustomValidity('Please select a quantity');
            selectedQuantity.reportValidity();
            return;
        } else {
            selectedItem.setCustomValidity('');
            selectedQuantity.setCustomValidity('');
            return;
        }
        
    }

 

    const existingItemIndex = selectedItemsArray.findIndex(item => item.name === selectedItem.value);

    if (existingItemIndex !== -1) {
        console.log("CAlled"+selectedItemsArray[existingItemIndex].quantity)

        selectedItemsArray[existingItemIndex].quantity += parseFloat(selectedQuantity.value);
       
        
        selectedItemsArray[existingItemIndex].price += calculatePrice(selectedItem.value, selectedQuantity.value);
    } else {
        selectedItemsArray.push({
            name: selectedItem.value,
            quantity: parseFloat(selectedQuantity.value),
            price: calculatePrice(selectedItem.value, selectedQuantity.value)
        });

        document.getElementById('itemsTable').style.display = 'block';
    }

    displaySelectedItems();
}
// price take from here 
function calculatePrice(item, quantity) {
    const prices = {
        'chicku -Rs.20 per dozen': { '1': 20, '2': 40, '0.5': 10 },
        'mango -Rs.30 per dozen': { '1': 30, '2': 60, '0.5': 15 },
        'kaju -Rs.50 per dozen': { '1': 50, '2': 100, '0.5': 25 },
        'Fish -Rs.500 per kg': { '1': 500, '2': 1000, '0.5': 250 },
        'Mutton -Rs.350 per kg': { '1': 350, '2': 700,'0.5':175 },
        'Chicken -Rs.200 per kg': { '1': 200, '2': 400, '0.5': 100 },
        'Potato -Rs.30 per kg': { '1': 30, '2': 60, '0.5': 15 },
        'Cabbage -Rs.40 per kg': { '1': 40, '2': 80, '0.5': 20 },
        'Tomato -Rs.20 per kg': { '1': 20, '2': 40, '0.5': 10 }
    };

    if (prices[item] && prices[item][quantity]) {
        return prices[item][quantity];
    } else {
        console.log('Price not found for:', item, quantity);
        return 0;
    }
}

function getImagePath(itemName) {
    const imagePaths = {
        'chicku -Rs.20 per dozen': 'images/frt_itm_1.png',
        'mango -Rs.30 per dozen': 'images/frt_itm_2.png',
        'kaju -Rs.50 per dozen': 'images/frt_itm_3.png',
        'Fish -Rs.500 per kg': 'images/non-veg_itm_1.jpg',
        'Mutton -Rs.350 per kg': 'images/non-veg_itm_2.jpg',
        'Chicken -Rs.200 per kg': 'images/non-veg_itm_3.jpg',
        'Potato -Rs.30 per kg': 'images/veg_itm_1.png',
        'Cabbage -Rs.40 per kg': 'images/veg_itm_2.png',
        'Tomato -Rs.20 per kg': 'images/veg_itm_3.png'
    };

    if (imagePaths[itemName]) {
        return imagePaths[itemName];
    } else {
        console.log('Image path not found for:', itemName);
        return '';
    }
}
//checkbox handale
function handleCheckbox(index) {
    const checkbox = document.querySelector(`input[type='checkbox'][data-index='${index}']`);
    const removeButton = document.querySelector(`button[data-index='${index}']`);

    if (checkbox.checked) {
        removeButton.disabled = false; // Enable the associated button
    } else {
        removeButton.disabled = true; // Disable the associated button
    }
}



//  remove item from array 
function removeItem(index) {
    const confirmation = window.confirm('Are you sure you want to remove this item?');
    if (confirmation) {
        selectedItemsArray.splice(index, 1);
        displaySelectedItems();
    }
    else{
        displaySelectedItems();
    }
}


function displaySelectedItems() {
    const tableBody = document.getElementById('itemsBody');
    tableBody.innerHTML = '';

    selectedItemsArray.forEach((item, index) => {


        const newRow = document.createElement('tr');

        const selectCell = document.createElement('td');
        const checkbox = document.createElement('input');
         checkbox.type = 'checkbox';
         checkbox.dataset.index = index; 
         checkbox.onclick = function() {
            handleCheckbox(this.dataset.index); // Retrieve the index from the data attribute
        };



        const itemCell = document.createElement('td');
        itemCell.textContent = item.name;

        const quantityCell = document.createElement('td');
        quantityCell.textContent = `${item.quantity} ${getUnit(item.name)}`;

        const priceCell = document.createElement('td');
        priceCell.textContent = `${item.price} .Rs`;

        const nameCell = document.createElement('td');
        const itemName = document.createElement('a');
        itemName.textContent = item.name;
            itemName.href = '#';
            itemName.addEventListener('click', function(event) {
                event.preventDefault();
                const imagePath = getImagePath(item.name);
                displayModal(imagePath);
                
            });

        const removeCell = document.createElement('td');
        const removeButton = document.createElement('button'); 
        removeButton.textContent = 'Remove';
        removeButton.dataset.index = index;

        removeButton.onclick = function () {
            removeItem(this.dataset.index); // Retrieve the index from the data attribute
        };
        removeButton.disabled = true;
        nameCell.appendChild(itemName);

       
        selectCell.appendChild(checkbox);
        removeCell.appendChild(removeButton);
        newRow.appendChild(selectCell);
        newRow.appendChild(itemCell);
        newRow.appendChild(quantityCell);
        newRow.appendChild(priceCell);
        newRow.appendChild(nameCell);

        newRow.appendChild(removeCell);


        tableBody.appendChild(newRow);
    });

    updateTotal();
    calculateDiscount();
    getImagePath();
    
}


function getUnit(itemName) {
    const unitMapping = {
        'chicku -Rs.20 per dozen': 'dozen',
        'mango -Rs.30 per dozen': 'dozen',
        'kaju -Rs.50 per dozen': 'dozen',
        'Fish -Rs.500 per kg': 'Kg',
        'Mutton -Rs.350 per kg': 'Kg',
        'Chicken -Rs.200 per kg': 'Kg',
        'Potato -Rs.30 per kg': 'Kg',
        'Cabbage -Rs.40 per kg': 'Kg',
        'Tomato -Rs.20 per kg': 'Kg'
    };
    return unitMapping[itemName] || '';
}

function displayModal(imageUrl) {
    const modal = document.getElementById('myModal');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageUrl;

    // Get the close button for the modal
    const span = document.getElementsByClassName('close')[0];

    // Show the modal
    modal.style.display = 'block';

    // Close the modal when clicking on the 'x' (close button)
    span.onclick = function() {
        modal.style.display = 'none';
    };

    // Close the modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

// update total


function updateTotal() {
    const totalPriceCell = document.getElementById('totalPrice');
    let totalPrice = 0;

    selectedItemsArray.forEach(item => {
        totalPrice += item.price;
    });

    totalPriceCell.textContent = totalPrice + '.Rs';
}


function calculateDiscount() {
   
    let remainingPrice = 0;
    const totalPrice = parseInt(document.getElementById('totalPrice').textContent);
    let discountedPrice = 0;

    if (totalPrice >= 0 && totalPrice <= 99) {
        discountedPrice = 0; // No discount
    } else if (totalPrice >= 100 && totalPrice <= 200) {
        remainingPrice = totalPrice - 100;
        discountedPrice = 5 +  remainingPrice * 0.05; // 5% discount
    } else if (201 <= totalPrice && totalPrice  <= 699) {
        remainingPrice = totalPrice - 200;
        discountedPrice = 10 + remainingPrice * 0.10; // 10% discount
    } else if (700 <= totalPrice && totalPrice  <= 1700 ) {
        remainingPrice = totalPrice - 700;
        discountedPrice = 60 + remainingPrice * 0.15; // 15% discount
    } else if( totalPrice >= 1701 ) {
        remainingPrice = totalPrice - 1700;
        discountedPrice = 210 + remainingPrice * 0.20; // 20% discount
    } else {
        remainingPrice = totalPrice - 2700;
        discountedPrice = 405 + remainingPrice * 0.20; // Custom discount after 2000
    }

    document.getElementById('discountedPriceBill').textContent = `${discountedPrice} .Rs`;
}



function submitBill() {
    const confirmation = window.confirm('Are you sure you want to submit?');
    if (confirmation) {
    const billNo = generateBillNumber();
    const totalPrice = parseInt(document.getElementById('totalPrice').textContent);
    const discountedPrice = parseInt(document.getElementById('discountedPriceBill').textContent);
    const gst = parseFloat((totalPrice-discountedPrice )* 0.18).toFixed(2);
    const a = parseFloat(gst) + (totalPrice-discountedPrice );
    const paid = (a).toFixed(2);

    console.log("Bill No:", billNo);
    console.log("Total Price:", totalPrice);
    console.log("Discounted Price:", discountedPrice);
    console.log("GST:", gst);
    console.log("Paid Amount:", paid);

    document.getElementById('billTable').style.display = 'block';
    

    document.getElementById('billNo').textContent = billNo;
    document.getElementById('totalPriceBill').textContent = `${totalPrice}.Rs`;
    document.getElementById('discountedPriceBill').textContent = `${discountedPrice}.Rs`;
    document.getElementById('gstBill').textContent = `${gst}.Rs`;
    document.getElementById('paidAmountBill').textContent = `${paid}.Rs`;

    const now = new Date();
    const formattedDate = "Date: " + now.toJSON().slice(0, 10).replace(/-/g, '/');
    const formattedTime = "Time: " + now.toLocaleTimeString();
    document.getElementById('date').textContent = formattedDate;
    document.getElementById('time').textContent= formattedTime;

    document.getElementById('submit').disabled=true;

    document.getElementById('itm1').disabled=true;
    document.getElementById('qnt1').disabled=true;
    document.getElementById('add1').disabled=true;

    document.getElementById('itm2').disabled=true;
    document.getElementById('qnt2').disabled=true;
    document.getElementById('add2').disabled=true;

    document.getElementById('itm3').disabled=true;
    document.getElementById('qnt3').disabled=true;
    document.getElementById('add3').disabled=true;

    document.getElementById('rdo1').disabled=true;
    document.getElementById('rdo2').disabled=true;
    document.getElementById('rdo3').disabled=true;
} else {
}
}

//cancel bill function

function cancelBill() {
   
    const confirmation = window.confirm('Are you sure you want to cancel this action?');
    if (confirmation) {
        document.getElementById('itemsTable').style.display = 'none';
        document.getElementById('billTable').style.display = 'none';
        document.getElementById('discount-table').style.display = 'none';

    } else {
        
        alert('Cancellation canceled.');
        
        event.preventDefault();
    }
  
}




function generateBillNumber() {
    return Math.floor(Math.random() * 100); 
}


function discounttable() {

    event.preventDefault();
    const confirmation = window.confirm('Are you sure you want to display discount?');
    const discountTable = document.getElementById('discount-table');

    if (confirmation) {
        discountTable.style.display = 'block';
    } else {
        discountTable.style.display = 'none';
    }
}

