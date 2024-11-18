document.addEventListener("DOMContentLoaded", () => {
    const clienteForm = document.getElementById("form-cliente");
    const transaccionForm = document.getElementById("form-transaccion");
    const servicioForm = document.getElementById("form-servicio");

    clienteForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nombre = document.getElementById("nombre").value;
        const correo = document.getElementById("correo").value;
        const telefono = document.getElementById("telefono").value;

        const response = await fetch("/api/cliente", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, correo, telefono }),
        });
        alert(await response.text());
    });

    transaccionForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const tipo = document.getElementById("tipo-transaccion").value;
        const monto = document.getElementById("monto-transaccion").value;
        const cuentaOrigen = document.getElementById("cuenta-origen").value;
        const cuentaDestino = document.getElementById("cuenta-destino").value;

        const response = await fetch("/api/transaccion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tipo, monto, cuentaOrigen, cuentaDestino }),
        });
        alert(await response.text());
    });

    servicioForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const tipo = document.getElementById("tipo-servicio").value;
        const monto = document.getElementById("monto-servicio").value;

        const response = await fetch("/api/servicio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tipo, monto }),
        });
        alert(await response.text());
    });
});
