const pedidosGuardados = JSON.parse(localStorage.getItem("pedidos")) || [];



const formulario = document.getElementById("formPedido");

pedidosGuardados.forEach(pedido=>{
    crearFila(pedido);
})
actualizarContador();


//Contador de pedidos
function actualizarContador(){
    const contadorPedidos= document.getElementById("contadorPedidos");
    contadorPedidos.textContent='pedidos totales: '+ pedidosGuardados.length;
}


//Contador de postres a hacer

function actualizarPostres() {
    let totalPostres = 0;
    let totalOreo = 0;
    let totalMaracuya = 0;
    let totalArequipe = 0;

    pedidosGuardados.forEach(pedido => {
        totalPostres += parseInt(pedido.cantidad);
        if(pedido.sabor === "Oreo"){
            totalOreo += parseInt(pedido.cantidad);
        }else if (pedido.sabor === "Maracuya"){
            totalMaracuya += parseInt(pedido.cantidad);
        } else if(pedido.sabor === "Arequipe") {
            totalArequipe += parseInt(pedido.cantidad);
        };
    });
    const contadorPostres = document.getElementById("contadorPostres");
    contadorPostres.textContent = "Postres por hacer: " + totalPostres;

    const contadorOreo = document.getElementById("contadorOreo");
    contadorOreo.textContent = "Oreo: " + totalOreo;

    const contadorMaracuya = document.getElementById("contadorMaracuya");
    contadorMaracuya.textContent = "Maracuya: " + totalMaracuya;

    const contadorArequipe = document.getElementById("contadorArequipe");
    contadorArequipe.textContent = "Arequipe: " + totalArequipe;




}

actualizarPostres();

formulario.addEventListener("submit", function(event){


    event.preventDefault();
/*/* Para buscar el id y la informacion*/

    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const jornada = document.getElementById("jornada").value;
    const tipocliente=document.getElementById("tipocliente").value;
    const sabor = document.getElementById("sabor").value;
    const cantidad = document.getElementById("cantidad").value;
    const fecha = document.getElementById("fecha").value;
    let total;
    if(tipocliente==="conocidos"){
                            total= cantidad*8000;
                        } else if (tipocliente==="empleado") {
                            total= cantidad*9000;
                        };
    const valorPagado = parseInt(document.getElementById("valorPagado").value) || 0;
    const adeudado = total - valorPagado;


//Colocar estado automaticamente
let estado="Pendiente";
if (adeudado>0){
    estado="Debe"
};


/*/* Objeto para almacenar los pedidos */

    const pedido ={
    id:Date.now(),
    nombre,
    telefono,
    jornada,
    sabor,
    cantidad,
    fecha,
    tipocliente,
    total,
    valorPagado,
    adeudado,
    estado
};


if (valorPagado > total) {
    alert("El valor pagado no puede ser mayor al total");
    return;
}


pedidosGuardados.push(pedido);
actualizarContador();
actualizarPostres();
localStorage.setItem("pedidos", JSON.stringify(pedidosGuardados)); 
crearFila(pedido);

});



    function crearFila(pedido){

        formulario.reset();

        const valorPagado = pedido.valorPagado || 0;
        const adeudado = pedido.total - valorPagado;


        const fila = document.createElement("tr");
        const tbody = document.querySelector("#tablaPedidos tbody");
            
        

            fila.innerHTML = `
        
        <td>${pedido.nombre}</td>
        <td>${pedido.telefono}</td>
        <td>${pedido.jornada}</td>
        <td>${pedido.sabor}</td>
        <td>${pedido.cantidad}</td>
        <td>${pedido.fecha}</td>
        <td>
            <select class="estadoPedido">
                <option value="Pendiente" ${pedido.estado === "Pendiente" ? "selected" : ""}>Pendiente</option>
                <option value="Debe" ${pedido.estado === "Debe" ? "selected": ""}>Debe</option>
                <option value="entregado" ${pedido.estado === "entregado" ? "selected" : ""}>Entregado</option>
            </select>
        </td>
        <td>${pedido.tipocliente}</td>
        <td>${pedido.total}</td>
        <td>${valorPagado}</td>
        <td>${adeudado}</td>
    <td>
    <button class="eliminar">
        Eliminar
    </button>
    <button class="abonar">
    Abonar
    </button>
    </td>
    `;


    const selectEstado = fila.querySelector(".estadoPedido");
    if (pedido.estado === "entregado") {
        fila.style.backgroundColor = "#44e269";
    }

selectEstado.addEventListener("change", function(){

    pedido.estado=this.value;
    localStorage.setItem("pedidos", JSON.stringify(pedidosGuardados));

    if(this.value === "entregado"){
        fila.style.backgroundColor = "#44e269";
    } else {
        fila.style.backgroundColor = "";
    }

});

    const botonEliminar = fila.querySelector(".eliminar");

botonEliminar.addEventListener("click", function(){

    const indice=pedidosGuardados.findIndex(p=>p.id===pedido.id);
    pedidosGuardados.splice(indice, 1);
    actualizarContador();
    actualizarPostres();
    localStorage.setItem("pedidos",JSON.stringify(pedidosGuardados));
    fila.remove();
});

const botonAbonar = fila.querySelector(".abonar");
botonAbonar.addEventListener("click", function(){
let abono = parseInt(prompt("Digite la cantidad de dinero abonada"));

if (pedido.adeudado===0){
    alert("No se puede abonar más este pedido esta completamente pago");
    return;
};


if (abono <= 0) {
    alert("Dinero no válido, se tiene que ganar dinero no perder");
    return;
}
if(adeudado>0){
const confirmar = confirm("Estas seguro que el abono es de: " + abono);
if (!confirmar) {
    return;
}
};



if(abono>pedido.adeudado){
    alert("No se puede abonar mas de la deuda pendiente");
    return;
};

pedido.valorPagado = pedido.valorPagado + abono;

pedido.adeudado = pedido.total - pedido.valorPagado;

if (pedido.adeudado > 0) {
    pedido.estado="Debe";
} else {
    pedido.estado="Pendiente"
}

localStorage.setItem("pedidos", JSON.stringify(pedidosGuardados));

location.reload();

});



tbody.appendChild(fila);

};



const exportar = document.getElementById("exportar");
exportar.addEventListener("click", function(){
    let filaCSV="Nombre;Teléfono;Jornada;Sabor;Cantidad;Fecha de entrega;Estado;Tipo de cliente;Total\n";

    for(let i = 0; i < pedidosGuardados.length; i++){
    const pedido=pedidosGuardados[i];
    filaCSV += pedido.nombre + ";" + pedido.telefono + ";" + pedido.jornada + ";" + pedido.sabor + ";" + pedido.cantidad + ";" + pedido.fecha + ";" + pedido.estado + ";" + pedido.tipocliente + ";" + pedido.total + "\n";

}

const enlace=document.createElement("a");
enlace.download="pedidos.csv";
const blob=new Blob([filaCSV], {type: "text/csv"});
enlace.href = URL.createObjectURL(blob);
enlace.click();
});



