const productos = [];
const ventas = [];

document.querySelectorAll("form")[0].addEventListener("submit", function (e) {
    e.preventDefault();

const inputs = e.target.querySelectorAll("input");
const [codigoInput, nombreInput, precioInput, descuentoInput, cantidadInput] = inputs;

let hayError = false;

const rules = {
        codigo: /^\d+$/,                            // solo números
        nombre: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/,        // solo letras y espacios
        numeroDecimal: /^\d+(\.\d+)?$/,             // número con o sin decimal
        cantidad: /^\d+$/,                          // solo números
        };

const valores = [codigoInput, nombreInput, precioInput, descuentoInput, cantidadInput];
const reglas = [rules.codigo, rules.nombre, rules.numeroDecimal, rules.cantidad, rules.cantidad];

valores.forEach((input, i) => {
        const help = input.nextElementSibling;
        const valor = input.value.trim();
        if (valor === "") {
            input.classList.add("is-danger");
            help.textContent = "Campo obligatorio";
            hayError = true;
        } else if (!reglas[i].test(valor)) {
            input.classList.add("is-danger");
            help.textContent = "Formato inválido";
            hayError = true;
        } else {
            input.classList.remove("is-danger");
            help.textContent = "";
        }
    });

    if (hayError) return;

    const codigo = codigoInput.value.trim();
    if (productos.find(p => p.codigo === codigo)) {
        codigoInput.classList.add("is-danger");
        codigoInput.nextElementSibling.textContent = "Código ya registrado";
        return;
    }

    const producto = {
        codigo,
        nombre: nombreInput.value.trim(),
        precio: parseFloat(precioInput.value),
        descuento: parseFloat(descuentoInput.value),
        cantidad: parseInt(cantidadInput.value)
    };

    productos.push(producto);
    e.target.reset();
    renderizarProductos();
});


function renderizarProductos() {
    const tbody = document.querySelectorAll("tbody")[0];
    tbody.innerHTML = "";
    productos.forEach(p => {
        const row = `
            <tr>
                <td>${p.codigo}</td>
                <td>${p.nombre}</td>
                <td>${p.precio}</td>
                <td>${p.descuento}</td>
                <td>${p.cantidad}</td>
            </tr>`;
        tbody.innerHTML += row;
    });
}


document.querySelector("button.button.is-info").addEventListener("click", function () {
    const codigo = document.querySelectorAll("form")[1].querySelectorAll("input")[0].value.trim();
    const producto = productos.find(p => p.codigo === codigo);

    const inputs = document.querySelectorAll("form")[1].querySelectorAll("input");
    const [, nombreInput, precioInput, descuentoInput] = inputs;

    if (producto) {
        nombreInput.value = producto.nombre;
        precioInput.value = producto.precio;
        descuentoInput.value = producto.descuento;
    }
    else {
        alert("Producto no encontrado");
        nombreInput.value = "";
        precioInput.value = "";
        descuentoInput.value = "";
    }
});

document.querySelectorAll("form")[1].addEventListener("submit", function (e) {
    e.preventDefault();

    const inputs = e.target.querySelectorAll("input");
    const [codigoInput, nombreInput, precioInput, descuentoInput] = inputs;

    const cantidad = parseInt(prompt("Ingrese la cantidad a vender: "));
    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Cantidad inválida");
        return;
    }

    const producto = productos.find(p => p.codigo === codigoInput.value.trim());
    if (!producto) {
        alert("Debe buscar un producto válido antes de registrar la venta");
        return;
    }

    if (cantidad > producto.cantidad) {
        alert("No hay suficiente stock disponible");
        return;
    }

    const precioFinal = producto.precio * cantidad * (1 - producto.descuento / 100);
    const venta = {
        codigo: producto.codigo,
        nombre: producto.nombre,
        precio: producto.precio,
        descuento: producto.descuento,
        cantidad,
        precioFinal
    };

    producto.cantidad -= cantidad;
    ventas.push(venta);
    e.target.reset();
    renderizarProductos();
    renderizarVentas();
});

function renderizarVentas() {
    const tbody = document.querySelectorAll("tbody")[1];
    const tfoot = document.querySelectorAll("tfot");
    tbody.innerHTML = "";
    let total = 0;

    ventas.forEach(v => {
        total += v.precioFinal;
        const row = `
            <tr>
                <td>${v.codigo}</td>
                <td>${v.nombre}</td>
                <td>${v.precio}</td>
                <td>${v.descuento}</td>
                <td>${v.cantidad}</td>
                <td>${v.precioFinal.toFixed(2)}</td>
            </tr>`;
        tbody.innerHTML += row;
    });

    tfoot.innerHTML = `
        <tr>
            <th colspan="5">TOTAL VENTAS</th>
            <th>${total.toFixed(2)}</th>
        </tr>`;
}