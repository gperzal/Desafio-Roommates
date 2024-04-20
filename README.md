# Roommates Financial Manager

Un sistema de gestión financiera para compañeros de piso que facilita el seguimiento de los gastos compartidos y el balance de deudas entre miembros.

## Descripción

Este proyecto es una aplicación web que permite a los usuarios agregar y gestionar roommates y gastos compartidos. Utiliza una interfaz intuitiva donde se pueden registrar nuevos gastos, ver el historial de gastos y mantener actualizado el balance financiero de cada roommate. Una característica central es la capacidad de recalcular automáticamente las deudas y créditos cuando se agregan o eliminan gastos o roommates.

## Tecnologías Utilizadas

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![jSON](https://img.shields.io/badge/json-fff?style=for-the-badge&logo=JSON&logoColor=%23292928)


## Funcionalidades

### Roommates

- **Agregar Roommate:** Crea un nuevo roommate y recalcula automáticamente los balances.
- **Eliminar Roommate:** Elimina un roommate y actualiza los balances de los demás.
- **Editar Roommate:** Permite editar la información de un roommate existente.
- **Vista Responsiva:** La tabla de roommates es responsiva y se ajusta a diferentes tamaños de pantalla.

### Gastos

- **Agregar Gasto:** Registra un nuevo gasto y lo divide equitativamente entre todos los roommates.
- **Eliminar Gasto:** Elimina un gasto y recalcula los balances.
- **Editar Gasto:** Edita la información de un gasto y actualiza los balances correspondientes.
- **Histórico de Gastos:** Muestra un historial de todos los gastos registrados.


### Recálculo de Balances

El recálculo de balances se realiza automáticamente en las siguientes situaciones:

| Acción                                | Fórmula de Recálculo                                                                                      |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Agregar Gasto                         | Divide el monto total del gasto entre el número total de roommates.                                       |
| Eliminar Gasto                        | Reduce el "debe" o "recibe" de cada roommate en proporción a su parte en el gasto eliminado.              |
| Editar Gasto                          | Reasigna los montos de "debe" y "recibe" basados en el nuevo monto y recalcula la división del gasto.     |
| Agregar Roommate                      | Divide cada gasto existente entre todos los roommates, incluyendo el nuevo.                               |
| Eliminar Roommate                     | Reasigna los montos de los gastos existentes divididos entre los roommates restantes.                      |
| Editar Roommate (cambio de pagos)     | Ajusta los montos de "debe" y "recibe" de todos los roommates basados en los cambios de los pagos hechos. |

### Rutas y Funciones

Las rutas de la API son las siguientes, cada una asociada con su respectiva acción en el backend:

| Ruta                        | Método | Descripción                                                           |
| --------------------------- | ------ | --------------------------------------------------------------------- |
| `/roommates`                | GET    | Obtiene la lista de todos los roommates.                              |
| `/roommates`                | POST   | Agrega un nuevo roommate y recalcula balances.                        |
| `/roommates/:id`            | PUT    | Actualiza la información de un roommate y recalcula balances.         |
| `/roommates/:id`            | DELETE | Elimina un roommate y recalcula balances.                             |
| `/gastos`                   | GET    | Obtiene la lista de todos los gastos registrados.                     |
| `/gastos`                   | POST   | Registra un nuevo gasto y recalcula balances.                         |
| `/gastos/:id`               | PUT    | Actualiza la información de un gasto y recalcula balances.            |
| `/gastos/:id`               | DELETE | Elimina un gasto y recalcula balances.                                |
| `/recalcular-gastos`        | POST   | Recalcula todos los balances de los roommates en base a los gastos.   |



## Instalación

Para ejecutar localmente, necesitas tener instalado Node.js. Sigue estos pasos para la instalación:

1. Clona el repositorio:

   ```
   git clone https://github.com/gperzal/Desafio-Roommates.git
   ```

2. Navega al directorio del proyecto:

   ```
   cd <tu-repo>
   ```

3. Instala las dependencias:

   ```
   npm i
   ```

4. Inicia el servidor:
   ```
   npm start
   ```