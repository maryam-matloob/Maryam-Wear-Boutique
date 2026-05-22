let products =
JSON.parse(localStorage.getItem("products")) || [];

const adminProducts =
document.getElementById("adminProducts");

/* DISPLAY PRODUCTS */

function displayProducts(){

  adminProducts.innerHTML = "";

  products.forEach((product,index)=>{

    adminProducts.innerHTML += `

      <div class="product-card">

        <img src="${product.image}">

        <div class="product-info">

          <h3>${product.name}</h3>

          <p>${product.description}</p>

          <p class="price">
            Rs ${product.price}
          </p>

          <button
            class="delete-btn"
            onclick="deleteProduct(${index})">

            Delete Product

          </button>

        </div>

      </div>
    `;
  });

}

displayProducts();

/* ADD PRODUCT */

function addProduct(){

  const name =
  document.getElementById("name").value;

  const price =
  document.getElementById("price").value;

  const description =
  document.getElementById("description").value;

  const imageInput =
  document.getElementById("image");

  const file =
  imageInput.files[0];

  if(
    name === "" ||
    price === "" ||
    description === "" ||
    !file
  ){
    alert("Please Fill All Fields");
    return;
  }

  const reader =
  new FileReader();

  reader.onload = function(){

    const product = {

      id:Date.now(),

      name:name,

      price:price,

      description:description,

      image:reader.result

    };

    products.push(product);

    localStorage.setItem(
      "products",
      JSON.stringify(products)
    );

    displayProducts();

    document.getElementById("name").value = "";

    document.getElementById("price").value = "";

    document.getElementById("description").value = "";

    imageInput.value = "";

    alert("Product Added Successfully");

  };

  reader.readAsDataURL(file);

}

/* DELETE PRODUCT */

function deleteProduct(index){

  products.splice(index,1);

  localStorage.setItem(
    "products",
    JSON.stringify(products)
  );

  displayProducts();

}