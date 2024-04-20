

document.addEventListener('DOMContentLoaded', () => {

  cargarRoommates();  // Cargar los roommates Tabla Roommates
  cargarHistorialGastos(); // Cargar los Gastos Tabla Gastos
  cargarNombresRoommates() // Cargar los nombres de los roommates en el selector
  // Listener para agregar roommate
  document.getElementById('btnAgregarRoommate').addEventListener('click', nuevoRoommate);

  // Listener para el formulario de agregar gasto
  document.getElementById('formGasto').addEventListener('submit', agregarGasto);

  document.getElementById('roommateSelect').addEventListener('click', cargarNombresRoommates);

});



function cargarRoommates() {
  fetch('/roommate')
    .then(response => response.json())
    .then(data => {
      const tbody = document.getElementById('roommates');
      tbody.innerHTML = '';
      data.forEach(rm => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', rm.id);
        row.innerHTML = `
        <td><input type="text" class="form-control form-control-sm" value="${rm.nombre}"   disabled style="border:0;background:transparent;"></td>
        <td><input type="text" class="form-control form-control-sm" value="${formatearMoneda(rm.debe)}"  disabled style="border:0;background:transparent; "></td>
        <td><input type="text" class="form-control form-control-sm" value="${formatearMoneda(rm.recibe)}"  disabled style="border:0;background:transparent; "></td>

        <td>

            <button class="btn btn-danger btn-sm btn-delete">
                <i class="bi bi-trash"></i>
            </button>
        </td>
          `;
        tbody.appendChild(row);
      });
      attachEventListeners();
    });
}

function formatearMoneda(valor) {
  return `$${valor.toLocaleString('es-CL', { maximumFractionDigits: 0 })}`;
}

function attachEventListeners() {
  document.querySelectorAll('.btn-edit').forEach(icon => {
    icon.addEventListener('click', function () {
      const inputs = this.closest('tr').querySelectorAll('input');
      inputs.forEach(input => {
        input.disabled = false;  // Habilita todos los inputs para la edición
        input.style.background = "white";  // Cambia el fondo para indicar que son editables
      });
      this.classList.add('d-none');
      this.nextElementSibling.classList.remove('d-none');
      this.nextElementSibling.nextElementSibling.classList.add('d-none');
    });
  });


  document.querySelectorAll('.tabla-roommates .btn-delete').forEach(button => {
    button.addEventListener('click', function () {
      const tr = this.closest('tr');
      const roommateId = tr.getAttribute('data-id');  // Usa getAttribute para obtener data-id
      eliminarRoommate(roommateId, tr);
    });
  });
}


// ROOMMATES

function cargarNombresRoommates() {
  fetch('/roommate/nombres/')  // Asegúrate de que esta ruta devuelve los nombres e IDs de los roommates
    .then(response => response.json())
    .then(roommates => {
      const select = document.getElementById('roommateSelect');
      select.innerHTML = '';  // Limpiar opciones existentes
      roommates.forEach(rm => {
        const option = document.createElement('option');
        option.value = rm.id;
        option.textContent = rm.nombre;
        select.appendChild(option);
      });
    })
    .catch(error => console.error('Error al cargar roommates:', error));
}


function nuevoRoommate(event) {
  event.preventDefault();
  fetch('/roommate/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },

  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Falló la creación del roommate');
      }
      return response.json();
    })
    .then(() => {
      showToast('Roommate agregado exitosamente.', 'success');
      cargarRoommates();  // Recargar los nombres en el selector
      cargarNombresRoommates();
      invocarRecalculoDeGastos();
    })
    .catch(error => console.error('Error al agregar roommate:', error));
}



function eliminarRoommate(roommateId, tr) {
  fetch(`/roommate/${roommateId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Falló la eliminación del roommate');
      }
      // Eliminar la fila del DOM inmediatamente sin esperar la respuesta del servidor
      if (tr) {
        tr.remove();
      } else {
        console.error('No se pudo encontrar la fila para eliminar');
      }
      cargarRoommates();  // Recargar la lista de roommates
      cargarNombresRoommates();
      invocarRecalculoDeGastos();
    })
    .catch(error => {
      console.error('Error al eliminar roommate:', error);
      //alert('No se pudo eliminar el roommate.'); 
    });
}


function cargarHistorialGastos() {
  fetch('/roommate/nombres/')  // Obtener primero los nombres de los roommates
    .then(response => response.json())
    .then(roommateNames => {
      const nameMap = new Map(roommateNames.map(rm => [rm.id, rm.nombre]));

      fetch('/gasto/')  // Obtener los gastos
        .then(response => response.json())
        .then(gastos => {
          const tbody = document.getElementById('historialGastos');
          tbody.innerHTML = '';  // Limpiar la tabla
          gastos.forEach(gasto => {
            const roommateName = nameMap.get(gasto.roommateId) || 'Nombre no encontrado';
            const tr = document.createElement('tr');
            tr.setAttribute('data-gasto-id', gasto.id);
            tr.innerHTML = `
                  <td><input type="text" class="form-control form-control-sm" value="${roommateName}" data-gasto-id="${gasto.roommateId}" disabled style="border:0;background:transparent;"></td>
                  <td><input type="text" class="form-control form-control-sm" value="${gasto.descripcion}" disabled style="border:0;background:transparent;"></td>
                  <td><input type="text" class="form-control form-control-sm" value="${formatearMoneda(gasto.monto)}" disabled style="border:0;background:transparent;"></td>
                  <td>
                      <button class="btn btn-warning btn-sm btn-edit">
                          <i class="bi bi-pencil-square"></i>
                      </button>
                      <button class="btn btn-success btn-sm btn-save d-none">
                          <i class="bi bi-floppy"></i>
                      </button>
                      <button class="btn btn-danger btn-sm btn-delete">
                          <i class="bi bi-trash"></i>
                      </button>
                  </td>
              `;
            tbody.appendChild(tr);
          });
          attachEventListenersToGastos();  // Asegúrate de que esta función maneja correctamente los nuevos inputs editables
        });
    })
    .catch(error => {
      console.error('Error al cargar los datos:', error);
    });
}

function attachEventListenersToGastos() {

  document.querySelectorAll('.btn-edit').forEach(button => {
    button.addEventListener('click', function () {
      const tr = this.closest('tr');

      // Obtener el selector de nombres de roommates si ya existe, si no, crea uno nuevo.
      let select = tr.querySelector('td:nth-child(1) select');
      if (!select) {
        select = document.createElement('select');
        select.classList.add('form-control', 'form-control-sm');
        tr.querySelector('td:nth-child(1) input').replaceWith(select);
      }

      // Rellenar el selector de nombres de roommates y habilitar para edición
      fetch('/roommate/nombres/')
        .then(response => response.json())
        .then(roommates => {
          select.innerHTML = roommates.map(rm => `<option value="${rm.id}">${rm.nombre}</option>`).join('');
          select.disabled = false;
          select.style.background = "white";
        });

      // Habilitar los inputs para la descripción y el monto y cambiar el fondo a blanco.
      const descripcionInput = tr.querySelector('td:nth-child(2) input');
      const montoInput = tr.querySelector('td:nth-child(3) input');
      descripcionInput.disabled = false;
      montoInput.disabled = false;
      descripcionInput.style.background = "white";
      montoInput.style.background = "white";

      // Cambiar la visibilidad de los botones.
      this.classList.add('d-none');
      tr.querySelector('.btn-save').classList.remove('d-none');
      tr.querySelector('.btn-delete').classList.add('d-none');
    });
  });

  // Agregar listener para el botón de guardar
  document.querySelectorAll('.btn-save').forEach(button => {
    button.addEventListener('click', function () {
      const tr = this.closest('tr');
      const gastoId = tr.getAttribute('data-gasto-id'); // Asegúrate de obtener el gastoId correctamente.
      guardarCambiosGasto(gastoId, tr);

      // Deshabilita los inputs y el select y restaura su estilo después de guardar.
      const descripcionInput = tr.querySelector('td:nth-child(2) input');
      const montoInput = tr.querySelector('td:nth-child(3) input');
      const select = tr.querySelector('td:nth-child(1) select');
      descripcionInput.disabled = true;
      montoInput.disabled = true;
      select.disabled = true;
      descripcionInput.style.background = "transparent";
      montoInput.style.background = "transparent";
      select.style.background = "transparent";
      select.style.border = "none"; // Asegúrate de quitar cualquier estilo de borde que se haya aplicado.

      // Restablece la visibilidad de los botones.
      tr.querySelector('.btn-edit').classList.remove('d-none');
      this.classList.add('d-none');
      tr.querySelector('.btn-delete').classList.remove('d-none');
    });
  });

  document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', function () {
      const tr = this.closest('tr');
      const gastoId = tr.getAttribute('data-gasto-id');
      eliminarGasto(gastoId);
    });
  });
}


// Funciones auxiliares para el historial de gastos
function guardarCambiosGasto(gastoId, tr) {
  const select = tr.querySelector('select'); // Obtiene el select con los nombres de los roommates.
  const inputs = tr.querySelectorAll('input');

  const data = {
    roommateId: select.value,
    descripcion: inputs[0].value,
    monto: parseFloat(inputs[1].value)
  };

  fetch(`/gasto/${gastoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al actualizar el gasto');
      }
      return response.json();
    })
    .then(() => {
      invocarRecalculoDeGastos();
      cargarRoommates();
      showToast('Gasto actualizado correctamente.', 'success');
      //alert('Gasto actualizado correctamente');
      tr.querySelector('.btn-save').classList.add('d-none');
      tr.querySelector('.btn-edit').classList.remove('d-none');
      tr.querySelector('.btn-delete').classList.remove('d-none');
    })
    .catch(error => {
      console.error('Error al actualizar gasto:', error);
      alert('No se pudo actualizar el gasto.');
    });
}

function eliminarGasto(gastoId) {
  fetch(`/gasto/${gastoId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Falló la eliminación del gasto');
      }
      // Intenta encontrar la fila con el atributo data-gasto-id que corresponda al gastoId
      invocarRecalculoDeGastos();
      cargarRoommates();
      const filaParaEliminar = document.querySelector(`tr[data-gasto-id="${gastoId}"]`);
      if (!filaParaEliminar) {
        throw new Error('No se encontró la fila del gasto para eliminar en la interfaz.');
      }
      filaParaEliminar.remove(); // Si se encuentra la fila, elimínala.
    })
    .catch(error => {
      console.error('Error al eliminar gasto:', error);
      //alert(error.message);
    });
}

function agregarGasto(event) {
  event.preventDefault();
  const form = event.target;
  const data = {
    roommateId: document.getElementById('roommateSelect').value,
    descripcion: document.getElementById('descripcion').value,
    monto: parseFloat(document.getElementById('monto').value)
  };

  fetch('/gasto/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Falló la adición del gasto');
      }
      return response.json();
    })
    .then(() => {
      form.reset();
      cargarHistorialGastos();
      cargarRoommates();
      invocarRecalculoDeGastos();
      // alert('Gasto agregado exitosamente');
      showToast('Gasto agregado exitosamente.', 'success');
    })
    .catch(error => {
      console.error('Error al agregar gasto:', error);
      //alert('No se pudo agregar el gasto.');
    });
}


// Funciones auxiliares para el recalcular de gastos
function invocarRecalculoDeGastos() {
  fetch('/roommate/recalcular-gastos', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al invocar el recálculo de gastos');
      }
      return response.json();
    })
    .then(result => {
      cargarRoommates();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container');

  // Limpiar toasts anteriores
  toastContainer.innerHTML = '';

  const toastEl = document.createElement('div');
  toastEl.classList.add('toast', 'align-items-center', 'text-white', 'border-1', 'fade', 'show');
  if (type === 'success') {
    toastEl.classList.add('bg-success');
  } else if (type === 'error') {
    toastEl.classList.add('bg-danger');
  }

  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');
  toastEl.innerHTML = `
      <div class="toast-header">
        <strong class="me-auto">Roommate App</strong>
      </div>
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  toastContainer.appendChild(toastEl);

  const toast = new bootstrap.Toast(toastEl, {
    delay: 1500 // Duración del toast
  });
  toast.show();
}

// Uso de la función showToast
// showToast('Esto es un mensaje de éxito.', 'success');
// showToast('Esto es un mensaje de error.', 'error');
