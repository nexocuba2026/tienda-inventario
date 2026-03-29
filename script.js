// 🔥 SUPABASE CONFIG
const supabaseUrl = "TU_SUPABASE_URL";
const supabaseKey = "TU_SUPABASE_ANON_KEY";

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// ---------------- LOGIN ----------------
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  document.getElementById("loginPage").style.display = "none";
  document.getElementById("app").style.display = "block";

  loadProducts();
}

// ---------------- PRODUCTOS ----------------
async function loadProducts() {
  const { data } = await supabaseClient.from("productos").select("*");

  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  data.forEach(p => {
    grid.innerHTML += `
      <div class="card">
        <h3>${p.nombre}</h3>
        <p>Inventario: ${p.cantidad}</p>
        <p>${p.descripcion}</p>
        <p>Precio: ${p.precio} CUP</p>
        <p>Unidad: ${p.unidad}</p>

        <button class="btn">Vender</button>
      </div>
    `;
  });
}

// ---------------- FOOTER ----------------
function showProducts() {
  loadProducts();
}

function showSales() {
  alert("Aquí irá la tabla de ventas");
}
