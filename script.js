
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 🔥 SUPABASE CONFIG
const supabaseUrl = "https://wgjmygpaapczqedcxahz.supabase.co";

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indnam15Z3BhYXBjenFlZGN4YWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTM4OTYsImV4cCI6MjA5MDM2OTg5Nn0.GDxHcimnvVj_8M_KAUWOeZxv7Dza8UKFOagOv_34SLo";

const supabaseClient = createClient(supabaseUrl, supabaseKey);

// ---------------- LOGIN ----------------
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("Error: " + error.message);
    console.error(error);
    return;
  }

  console.log("LOGIN OK:", data);

  // UI
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("app").style.display = "block";

  const footer = document.getElementById("footer");
  if (footer) footer.style.display = "flex";

  loadProducts();
}

// ---------------- PRODUCTOS ----------------
async function loadProducts() {
  const { data, error } = await supabaseClient
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
        <h3>${p.nombre}</h3>

        <p><b>Inventario:</b> ${p.inventario}</p>
        <p><b>Cantidad:</b> ${p.cantidad}</p>
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

// ---------------- VENTA BASE ----------------
async function sellProduct(id) {
  alert("Venta en desarrollo: " + id);
}

// ---------------- VISTAS ----------------
function showProducts() {
  loadProducts();
}

function showSales() {
  alert("Aquí irá la tabla de ventas");
}

// ---------------- GLOBAL ----------------
window.login = login;
window.showProducts = showProducts;
window.showSales = showSales;
window.sellProduct = sellProduct;
