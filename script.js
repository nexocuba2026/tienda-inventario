import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 🔥 SUPABASE CONFIG
const supabaseUrl = "https://wgjmygpaapczqedcxahz.supabase.co";
const supabaseKey = "TU_ANON_KEY";

const supabase = createClient(supabaseUrl, supabaseKey);

let currentUser = null;

// ---------------- LOGIN ----------------
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  currentUser = data.user;

  document.getElementById("loginPage").style.display = "none";
  document.getElementById("app").style.display = "block";
  document.getElementById("footer").style.display = "flex";

  checkRole(email);

  loadProducts();
}

// ---------------- ROLES (ADMIN / USER) ----------------
function checkRole(email) {
  const adminEmails = [
    "director@gmail.com",
    "administrador@gmail.com",
    "economica@gmail.com"
  ];

  const isAdmin = adminEmails.includes(email);

  const adminBtn = document.querySelector(".top-actions");

  if (isAdmin) {
    adminBtn.style.display = "block";
  } else {
    adminBtn.style.display = "none";
  }
}

// ---------------- MODAL ----------------
function openModal() {
  document.getElementById("productModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("productModal").style.display = "none";
  clearForm();
}

// ---------------- LIMPIAR FORM ----------------
function clearForm() {
  document.getElementById("nombre").value = "";
  document.getElementById("numero_inventario").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("stock").value = "";
  document.getElementById("unidad_medida").value = "";
  document.getElementById("precio_cup").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("imagen").value = "";
}

// ---------------- SUBIR IMAGEN A SUPABASE STORAGE ----------------
async function uploadImage(file) {
  const fileName = `${Date.now()}_${file.name}`;

  const { error } = await supabase.storage
    .from("productos")
    .upload(fileName, file);

  if (error) {
    console.error(error);
    return null;
  }

  const { data } = supabase.storage
    .from("productos")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

// ---------------- AGREGAR PRODUCTO ----------------
async function addProduct() {

  const file = document.getElementById("imagen").files[0];

  let imageUrl = "";

  if (file) {
    imageUrl = await uploadImage(file);
  }

  const producto = {
    nombre: document.getElementById("nombre").value,
    numero_inventario: document.getElementById("numero_inventario").value,
    descripcion: document.getElementById("descripcion").value,
    stock: Number(document.getElementById("stock").value),
    unidad_medida: document.getElementById("unidad_medida").value,
    precio_cup: Number(document.getElementById("precio_cup").value),
    categoria: document.getElementById("categoria").value,
    imagen_url: imageUrl
  };

  const { error } = await supabase
    .from("productos")
    .insert([producto]);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Producto agregado ✔️");

  closeModal();
  loadProducts();
}

// ---------------- PRODUCTOS ----------------
async function loadProducts() {
  const { data, error } = await supabase
    .from("productos")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  data.forEach(p => {
    grid.innerHTML += `
      <div class="card">
        <img src="${p.imagen_url}" style="width:100%; border-radius:10px;" />

        <h3>${p.nombre}</h3>

        <p><b>Inv:</b> ${p.numero_inventario}</p>
        <p><b>Stock:</b> ${p.stock}</p>
        <p>${p.descripcion}</p>

        <p><b>Precio:</b> ${p.precio_cup} CUP</p>
        <p><b>Unidad:</b> ${p.unidad_medida}</p>

        <button class="btn" onclick="sellProduct('${p.id}')">
          Vender
        </button>
      </div>
    `;
  });
}

// ---------------- VENTA ----------------
async function sellProduct(id) {
  alert("Venta en desarrollo: " + id);
}

// ---------------- VISTAS ----------------
function showProducts() {
  loadProducts();
}

function showSales() {
  alert("Ventas en desarrollo");
}

// ---------------- GLOBAL ----------------
window.login = login;
window.openModal = openModal;
window.closeModal = closeModal;
window.addProduct = addProduct;
window.loadProducts = loadProducts;
window.sellProduct = sellProduct;
window.showProducts = showProducts;
window.showSales = showSales;
