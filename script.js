// 🔥 SUPABASE CONFIG
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://wgjmygpaapczqedcxahz.supabase.co";
const supabaseKey = "sb_publishable_OQIGeDH1ejG2FTmMi7CdAg_rLlIK55k";

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
    return;
  }

  document.getElementById("loginPage").style.display = "none";
  document.getElementById("app").style.display = "block";

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

// ---------------- VENDER (BASE) ----------------
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
