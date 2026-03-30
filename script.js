import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// ================= SUPABASE =================
const supabaseUrl = "https://wgjmygpaapczqedcxahz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indnam15Z3BhYXBjenFlZGN4YWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTM4OTYsImV4cCI6MjA5MDM2OTg5Nn0.GDxHcimnvVj_8M_KAUWOeZxv7Dza8UKFOagOv_34SLo"; // 👈 pon la correcta sin comentarios

const supabase = createClient(supabaseUrl, supabaseKey);

let currentUser = null;

// ================= LOGIN =================
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

// ================= ROLES =================
function checkRole(email) {
  const adminEmails = [
    "director@gmail.com",
    "administrador@gmail.com",
    "economica@gmail.com"
  ];

  const isAdmin = adminEmails.includes(email);

  document.querySelector(".top-actions").style.display =
    isAdmin ? "block" : "none";
}

// ================= MODAL =================
function openModal() {
  document.getElementById("productModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("productModal").style.display = "none";
  clearForm();
}

// ================= LIMPIAR =================
function clearForm() {
  ["nombre","numero_inventario","descripcion","stock","unidad_medida","precio_cup","imagen"]
  .forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}

// ================= IMAGEN =================
async function uploadImage(file) {
  const fileName = `${Date.now()}_${file.name}`;

  const { error } = await supabase.storage
    .from("productos")
    .upload(fileName, file);

  if (error) {
    console.error(error);
    return "";
  }

  const { data } = supabase.storage
    .from("productos")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

// ================= AGREGAR PRODUCTO =================
async function addProduct() {

  const file = document.getElementById("imagen").files[0];
  let imageUrl = "";

  if (file) imageUrl = await uploadImage(file);

  const producto = {
    nombre: document.getElementById("nombre").value,
    numero_inventario: document.getElementById("numero_inventario").value,
    descripcion: document.getElementById("descripcion").value,
    stock: Number(document.getElementById("stock").value),
    unidad_medida: document.getElementById("unidad_medida").value,
    precio_cup: Number(document.getElementById("precio_cup").value),
    imagen_url: imageUrl
  };

  const { error } = await supabase
    .from("productos")
    .insert([producto]);

  if (error) {
    alert(error.message);
    return;
  }

  closeModal();
  loadProducts();
}

// ================= CARGAR PRODUCTOS =================
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

  const isAdmin =
    document.querySelector(".top-actions")?.style.display === "block";

  data.forEach(p => {

    grid.innerHTML += `
      <div class="card">
        <div class="card-content">

          <img src="${p.imagen_url}" class="product-img">

          <div class="info">
            <h3>${p.nombre}</h3>
            <p><b>Inv:</b> ${p.numero_inventario}</p>
            <p><b>Stock:</b> ${p.stock}</p>
            <p><b>${p.precio_cup} CUP</b></p>

            <button class="btn" onclick="sellProduct('${p.id}', ${p.stock}, '${p.nombre}', '${p.numero_inventario}', ${p.precio_cup})">
              Vender
            </button>

            ${isAdmin ? `
              <button class="btn" onclick="editProduct('${p.id}')">Editar</button>
              <button class="btn" onclick="deleteProduct('${p.id}')">Eliminar</button>
            ` : ""}

          </div>
        </div>
      </div>
    `;
  });
}

// ================= VENTAS =================
let currentSellId = null;
let currentStock = 0;
let currentProduct = null;

function sellProduct(id, stock, nombre, inventario, precio) {
  currentSellId = id;
  currentStock = stock;

  currentProduct = {
    id,
    nombre,
    inventario,
    precio
  };

  document.getElementById("sellModal").style.display = "flex";
}

async function confirmSell() {

  const qty = Number(document.getElementById("sellQuantity").value);

  if (qty <= 0 || qty > currentStock) {
    alert("Cantidad inválida");
    return;
  }

  const newStock = currentStock - qty;

  // 1. actualizar stock
  const { error } = await supabase
    .from("productos")
    .update({ stock: newStock })
    .eq("id", currentSellId);

  if (error) {
    alert(error.message);
    return;
  }

  // 2. guardar venta
  const { error: saleError } = await supabase
    .from("ventas")
    .insert([{
      producto_id: currentProduct.id,
      numero_inventario: currentProduct.inventario,
      producto: currentProduct.nombre,
      precio_unitario: currentProduct.precio,
      cantidad_vendida: qty,
      importe: qty * currentProduct.precio,
      fecha: new Date().toISOString().split("T")[0]
    }]);

  if (saleError) {
    alert(saleError.message);
    return;
  }

  closeSellModal();
  loadProducts();
}

function closeSellModal() {
  document.getElementById("sellModal").style.display = "none";
}

// ================= DELETE =================
async function deleteProduct(id) {

  if (!confirm("¿Eliminar producto?")) return;

  const { error } = await supabase
    .from("productos")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
    return;
  }

  loadProducts();
}

// ================= EDIT =================
function editProduct(id) {
  alert("Editar lo conectamos luego con modal 👍");
}

// ================= EXPORT =================
window.login = login;
window.openModal = openModal;
window.closeModal = closeModal;
window.addProduct = addProduct;
window.loadProducts = loadProducts;
window.sellProduct = sellProduct;
window.confirmSell = confirmSell;
window.closeSellModal = closeSellModal;
window.deleteProduct = deleteProduct;
window.editProduct = editProduct;
