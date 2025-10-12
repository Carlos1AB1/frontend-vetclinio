# Prototipos de Interfaces Gráficas de Usuario (UI)
## Sistema Integral de Gestión Veterinaria - VetClinic

---

## 1. PÁGINAS PÚBLICAS

### 1.1 Página de Inicio (Landing Page)
**Ruta:** `/`
**Descripción:** Página pública de presentación del sistema
**Elementos principales:**
- Logo y nombre del sistema "VetClinic"
- Título principal: "Sistema Integral de Gestión Veterinaria"
- Descripción de funcionalidades
- Sección de características principales (4 tarjetas):
  - Gestión de Citas
  - Pacientes y Propietarios
  - Historias Clínicas
  - Sistema Seguro
- Botones de llamado a la acción: "Comenzar Ahora" e "Iniciar Sesión"
- Footer con copyright

**Screenshot requerido:** ✅ Capturado

---

### 1.2 Página de Login
**Ruta:** `/login`
**Descripción:** Formulario de autenticación para acceso al sistema
**Elementos principales:**
- Logo y título "VetClinic"
- Campos de formulario:
  - Usuario
  - Contraseña
- Botón "Iniciar Sesión"
- Información de usuarios de prueba (admin, veterinario, recepcionista)

**Screenshot requerido:** ✅ Capturado

---

## 2. MÓDULO DASHBOARD

### 2.1 Dashboard Principal
**Ruta:** `/dashboard`
**Descripción:** Panel principal con estadísticas y resumen de actividades
**Elementos principales:**
- Saludo personalizado con nombre de usuario
- 4 Tarjetas de estadísticas:
  - Citas Hoy
  - Pacientes Activos
  - Propietarios
  - Alertas
- Sección "Citas de Hoy" con lista de citas programadas
- Sección "Estadísticas del Mes" con barras de progreso

**Screenshots requeridos:**
- [ ] Vista completa del dashboard
- [ ] Vista detalle de tarjetas de estadísticas
- [ ] Vista de lista de citas del día

---

## 3. MÓDULO PACIENTES

### 3.1 Lista de Pacientes
**Ruta:** `/patients`
**Descripción:** Listado completo de pacientes registrados
**Elementos principales:**
- Título "Pacientes"
- Botón "Agregar Paciente"
- Campo de búsqueda
- Filtros por especie (Todos, Perros, Gatos, Exóticos, Aves, Otros)
- Grid de tarjetas con información de cada paciente:
  - Foto/avatar
  - Nombre
  - Especie y raza
  - Edad
  - Propietario
  - Estado (activo/inactivo)
  - Última visita
- Mensaje cuando no hay resultados

**Screenshots requeridos:**
- [ ] Vista completa de la lista
- [ ] Vista con filtros aplicados
- [ ] Vista de búsqueda con resultados
- [ ] Vista sin resultados

---

### 3.2 Formulario de Paciente
**Componente:** Dialog modal
**Descripción:** Formulario para agregar o editar pacientes
**Elementos principales:**
- Título: "Agregar Paciente" o "Editar Paciente"
- Campos del formulario:
  - Nombre del paciente *
  - Especie *
  - Raza *
  - Fecha de nacimiento *
  - Sexo *
  - Color/Marcas
  - Número de microchip
  - Peso (kg) *
  - Propietario *
  - Estado *
  - Notas
- Botones: "Cancelar" y "Agregar Paciente"/"Guardar Cambios"

**Screenshots requeridos:**
- [ ] Formulario de nuevo paciente (vacío)
- [ ] Formulario de edición (con datos)
- [ ] Vista de validación de errores

---

### 3.3 Detalles de Paciente
**Componente:** Dialog modal
**Descripción:** Vista detallada de información del paciente
**Elementos principales:**
- Nombre y foto del paciente
- Badges de especie y estado
- Secciones de información:
  - Información Básica (especie, raza, sexo, edad, peso, microchip)
  - Propietario (nombre, teléfono, email)
  - Estado y Observaciones
  - Auditoría (fechas de registro y actualización)
- Botones: "Editar" y "Eliminar"

**Screenshots requeridos:**
- [ ] Vista completa de detalles
- [ ] Vista de diferentes especies de pacientes

---

## 4. MÓDULO PROPIETARIOS

### 4.1 Lista de Propietarios
**Ruta:** `/owners`
**Descripción:** Listado completo de propietarios/tutores
**Elementos principales:**
- Título "Propietarios"
- Botón "Agregar Propietario"
- Campo de búsqueda
- Grid de tarjetas con información:
  - Nombre completo
  - Tipo y número de documento
  - Teléfono y email
  - Dirección
  - Número de mascotas
  - Fecha de registro
- Mensaje cuando no hay resultados

**Screenshots requeridos:**
- [ ] Vista completa de la lista
- [ ] Vista con búsqueda activa
- [ ] Vista sin resultados

---

### 4.2 Formulario de Propietario
**Componente:** Dialog modal
**Descripción:** Formulario para agregar o editar propietarios
**Elementos principales:**
- Título: "Agregar Propietario" o "Editar Propietario"
- Campos del formulario:
  - Nombre completo *
  - Tipo de documento *
  - Número de documento *
  - Teléfono *
  - Email *
  - Dirección *
  - Ciudad *
  - Notas
- Botones: "Cancelar" y "Agregar Propietario"/"Guardar Cambios"

**Screenshots requeridos:**
- [ ] Formulario de nuevo propietario (vacío)
- [ ] Formulario de edición (con datos)
- [ ] Vista de validación de errores

---

### 4.3 Detalles de Propietario
**Componente:** Dialog modal
**Descripción:** Vista detallada de información del propietario
**Elementos principales:**
- Nombre del propietario
- Secciones de información:
  - Información Personal (documento, teléfono, email, dirección, ciudad)
  - Mascotas Registradas (lista de pacientes asociados)
  - Auditoría (fechas de registro y actualización)
- Botones: "Editar" y "Eliminar"

**Screenshots requeridos:**
- [ ] Vista completa de detalles
- [ ] Vista con múltiples mascotas asociadas

---

## 5. MÓDULO CITAS

### 5.1 Lista de Citas
**Ruta:** `/appointments`
**Descripción:** Listado y gestión de citas médicas
**Elementos principales:**
- Título "Citas"
- Botón "Nueva Cita"
- Tabs de filtros por estado (Todas, Pendientes, En Progreso, Completadas, Canceladas)
- Campo de búsqueda
- Lista de tarjetas con información de cada cita:
  - Paciente y propietario
  - Fecha y hora
  - Veterinario asignado
  - Motivo de la consulta
  - Estado con badge de color
  - Notas adicionales
- Mensaje cuando no hay resultados

**Screenshots requeridos:**
- [ ] Vista completa de todas las citas
- [ ] Vista filtrada por cada estado
- [ ] Vista con búsqueda activa
- [ ] Vista sin resultados

---

### 5.2 Formulario de Cita
**Componente:** Dialog modal
**Descripción:** Formulario para agendar o editar citas
**Elementos principales:**
- Título: "Nueva Cita" o "Editar Cita"
- Campos del formulario:
  - Paciente *
  - Propietario * (autocompletado)
  - Fecha *
  - Hora *
  - Veterinario *
  - Motivo de la consulta *
  - Tipo de consulta *
  - Notas
  - Estado *
- Botones: "Cancelar" y "Agendar Cita"/"Guardar Cambios"

**Screenshots requeridos:**
- [ ] Formulario de nueva cita (vacío)
- [ ] Formulario de edición (con datos)
- [ ] Vista de selección de fecha (calendario)
- [ ] Vista de validación de errores

---

### 5.3 Detalles de Cita
**Componente:** Dialog modal
**Descripción:** Vista detallada de información de la cita
**Elementos principales:**
- Información del paciente y propietario
- Fecha y hora de la cita
- Veterinario asignado
- Tipo de consulta y motivo
- Estado con badge de color
- Notas adicionales
- Auditoría (fechas de creación y actualización)
- Botón "Cerrar"

**Screenshots requeridos:**
- [ ] Vista completa de detalles
- [ ] Vistas de diferentes estados de citas

---

## 6. MÓDULO HISTORIAS CLÍNICAS

### 6.1 Lista de Historias Clínicas
**Ruta:** `/medical-records`
**Descripción:** Registro de consultas y tratamientos
**Elementos principales:**
- Título "Historias Clínicas"
- Botón "Nueva Historia"
- Campo de búsqueda
- Grid de tarjetas con información:
  - Paciente y propietario
  - Fecha de la consulta
  - Veterinario
  - Diagnóstico
  - Tratamiento aplicado
  - Badge de estado
- Mensaje cuando no hay resultados

**Screenshots requeridos:**
- [ ] Vista completa de la lista
- [ ] Vista con búsqueda activa
- [ ] Vista sin resultados

---

### 6.2 Formulario de Historia Clínica
**Componente:** Dialog modal
**Descripción:** Formulario para registrar nuevas historias clínicas
**Elementos principales:**
- Título: "Nueva Historia Clínica" o "Editar Historia"
- Campos del formulario:
  - Paciente *
  - Propietario * (autocompletado)
  - Fecha de consulta *
  - Veterinario *
  - Signos vitales:
    - Temperatura (°C)
    - Frecuencia cardíaca (lpm)
    - Frecuencia respiratoria (rpm)
    - Peso (kg) *
  - Motivo de consulta *
  - Síntomas *
  - Diagnóstico *
  - Tratamiento *
  - Prescripciones
  - Observaciones
- Botones: "Cancelar" y "Guardar Historia"

**Screenshots requeridos:**
- [ ] Formulario de nueva historia (vacío)
- [ ] Formulario completo con todos los campos llenos
- [ ] Vista de validación de errores

---

### 6.3 Detalles de Historia Clínica
**Componente:** Dialog modal
**Descripción:** Vista detallada de la historia clínica
**Elementos principales:**
- Información del paciente y propietario
- Signos vitales
- Fecha de consulta y veterinario
- Secciones detalladas:
  - Motivo de consulta
  - Síntomas observados
  - Diagnóstico
  - Tratamiento aplicado
  - Prescripciones
  - Observaciones adicionales
- Auditoría (fechas de creación y actualización)
- Botón "Cerrar"

**Screenshots requeridos:**
- [ ] Vista completa de detalles
- [ ] Vista de historia con prescripciones
- [ ] Vista de historia sin prescripciones

---

## 7. MÓDULO INVENTARIO

### 7.1 Lista de Inventario
**Ruta:** `/inventory`
**Descripción:** Gestión de productos e insumos de la clínica
**Elementos principales:**
- Título "Inventario"
- Botón "Agregar Producto"
- Campo de búsqueda
- Filtros por categoría (Todos, Medicamentos, Materiales, Alimentos, Equipos, Otros)
- Alertas de stock:
  - Productos agotados (rojo)
  - Productos con stock bajo (amarillo)
  - Productos próximos a vencer (azul)
- Grid de tarjetas con información:
  - Nombre del producto
  - Categoría
  - Cantidad actual y stock mínimo
  - Unidad de medida
  - Estado con badge
  - Proveedor
  - Fecha de vencimiento (si aplica)
- Mensaje cuando no hay resultados

**Screenshots requeridos:**
- [ ] Vista completa de la lista
- [ ] Vista con filtros por categoría
- [ ] Vista de alertas de stock
- [ ] Vista con búsqueda activa
- [ ] Vista sin resultados

---

### 7.2 Formulario de Inventario
**Componente:** Dialog modal
**Descripción:** Formulario para agregar o editar productos
**Elementos principales:**
- Título: "Agregar Producto" o "Editar Producto"
- Campos del formulario en grid:
  - Nombre del producto *
  - Categoría *
  - Proveedor *
  - Descripción
  - Cantidad actual *
  - Unidad de medida *
  - Stock mínimo *
  - Costo unitario ($) *
  - Fecha de vencimiento
  - Última reposición *
- Botones: "Cancelar" y "Agregar Producto"/"Guardar Cambios"

**Screenshots requeridos:**
- [ ] Formulario de nuevo producto (vacío)
- [ ] Formulario de edición (con datos)
- [ ] Vista de validación de errores

---

### 7.3 Detalles de Producto
**Componente:** Dialog modal
**Descripción:** Vista detallada de información del producto
**Elementos principales:**
- Nombre y descripción del producto
- Badges de categoría y estado
- Alertas visuales (agotado, bajo stock, próximo a vencer)
- Secciones de información:
  - Información de Stock (cantidad actual, stock mínimo, unidad)
  - Información Financiera (costo unitario, valor total, proveedor)
  - Fechas (última reposición, vencimiento)
- Botones: "Editar" y "Eliminar"

**Screenshots requeridos:**
- [ ] Vista completa de detalles
- [ ] Vista con alertas de stock
- [ ] Vista con alerta de vencimiento

---

## 8. MÓDULO REPORTES

### 8.1 Página de Reportes
**Ruta:** `/reports`
**Descripción:** Visualización de estadísticas y análisis
**Elementos principales:**
- Título "Reportes y Análisis"
- Selector de rango de fechas
- Botón "Exportar Reporte"
- 4 Tarjetas de métricas principales:
  - Total de Citas
  - Ingresos Totales
  - Pacientes Atendidos
  - Tratamientos Realizados
- Gráfico de líneas: "Citas por Mes"
- Gráfico de barras: "Ingresos Mensuales"
- Lista de "Tratamientos Más Frecuentes" con barras de progreso

**Screenshots requeridos:**
- [ ] Vista completa de la página
- [ ] Vista de gráficos en detalle
- [ ] Vista con diferentes rangos de fechas

---

## 9. MÓDULO USUARIOS

### 9.1 Lista de Usuarios
**Ruta:** `/users`
**Descripción:** Gestión de usuarios del sistema
**Elementos principales:**
- Título "Usuarios del Sistema"
- Botón "Agregar Usuario"
- Campo de búsqueda
- Filtros por rol (Todos, Administradores, Veterinarios, Recepcionistas)
- Grid de tarjetas con información:
  - Nombre completo
  - Usuario
  - Email
  - Rol con badge
  - Estado (activo/inactivo)
- Mensaje cuando no hay resultados

**Screenshots requeridos:**
- [ ] Vista completa de la lista
- [ ] Vista filtrada por cada rol
- [ ] Vista con búsqueda activa
- [ ] Vista sin resultados

---

### 9.2 Formulario de Usuario
**Componente:** Dialog modal
**Descripción:** Formulario para agregar o editar usuarios
**Elementos principales:**
- Título: "Agregar Usuario" o "Editar Usuario"
- Campos del formulario:
  - Nombre completo *
  - Nombre de usuario *
  - Email *
  - Rol *
- Información de permisos por rol:
  - Administrador: Acceso completo
  - Veterinario: Gestión de pacientes e historias
  - Recepcionista: Gestión de citas y propietarios
- Botones: "Cancelar" y "Agregar Usuario"/"Guardar Cambios"

**Screenshots requeridos:**
- [ ] Formulario de nuevo usuario (vacío)
- [ ] Formulario de edición (con datos)
- [ ] Vista de validación de errores

---

### 9.3 Detalles de Usuario
**Componente:** Dialog modal
**Descripción:** Vista detallada de información del usuario
**Elementos principales:**
- Nombre completo y avatar
- Badge de rol
- Secciones de información:
  - Información de Cuenta (usuario, email, rol)
  - Permisos y Accesos (lista de módulos accesibles)
  - Auditoría (fechas de creación, última sesión, actualización)
- Botones: "Editar" y "Eliminar"

**Screenshots requeridos:**
- [ ] Vista completa de detalles para cada rol
- [ ] Vista de permisos expandidos

---

## 10. MÓDULO CONFIGURACIÓN

### 10.1 Página de Configuración
**Ruta:** `/settings`
**Descripción:** Configuraciones generales del sistema
**Elementos principales:**
- Título "Configuración"
- Sección "Información de la Clínica":
  - Nombre de la clínica
  - Dirección
  - Teléfono
  - Email
  - Botón "Guardar Cambios"
- Sección "Horario de Atención":
  - Horario de apertura y cierre
  - Botón "Guardar Horario"
- Sección "Notificaciones":
  - Switch "Notificaciones por Email"
  - Switch "Notificaciones por SMS"
  - Switch "Recordatorios de Citas"
  - Botón "Guardar Preferencias"

**Screenshots requeridos:**
- [ ] Vista completa de la página
- [ ] Vista con formulario de información completado
- [ ] Vista con notificaciones activadas/desactivadas

---

## 11. COMPONENTES DE NAVEGACIÓN

### 11.1 Sidebar (Barra Lateral)
**Descripción:** Menú de navegación principal
**Elementos principales:**
- Logo "VetClinic" con icono
- Enlaces de navegación con iconos:
  - Dashboard
  - Pacientes
  - Propietarios
  - Citas
  - Historias Clínicas
  - Inventario
  - Reportes
  - Usuarios (solo admin)
  - Configuración (solo admin)
- Sección de usuario con:
  - Avatar
  - Nombre de usuario
  - Rol
  - Botón "Cerrar Sesión"
- Estados de enlace activo resaltados

**Screenshots requeridos:**
- [ ] Sidebar completo (vista admin)
- [ ] Sidebar vista veterinario
- [ ] Sidebar vista recepcionista
- [ ] Sidebar con enlace activo en cada módulo

---

### 11.2 Header (Barra Superior)
**Descripción:** Barra superior de navegación
**Elementos principales:**
- Breadcrumbs de navegación
- Información de usuario
- Botón de menú móvil (responsive)

**Screenshots requeridos:**
- [ ] Header en vista desktop
- [ ] Header en vista móvil

---

## 12. COMPONENTES AUXILIARES

### 12.1 Toasts y Notificaciones
**Descripción:** Mensajes de feedback al usuario
**Screenshots requeridos:**
- [ ] Toast de éxito
- [ ] Toast de error
- [ ] Toast de advertencia
- [ ] Toast de información

---

### 12.2 Modales de Confirmación
**Descripción:** Diálogos de confirmación para acciones críticas
**Screenshots requeridos:**
- [ ] Modal de confirmación de eliminación
- [ ] Modal de confirmación de cambios

---

### 12.3 Estados de Carga
**Descripción:** Indicadores de procesos en curso
**Screenshots requeridos:**
- [ ] Skeleton loading en listas
- [ ] Spinner en formularios

---

### 12.4 Páginas de Error
**Ruta:** `/404` y otras
**Screenshots requeridos:**
- [ ] Página 404 Not Found
- [ ] Página de error genérico

---

## 13. VISTAS RESPONSIVE

### 13.1 Vista Mobile (< 768px)
**Screenshots requeridos por módulo:**
- [ ] Landing page mobile
- [ ] Login mobile
- [ ] Dashboard mobile
- [ ] Lista de pacientes mobile
- [ ] Lista de propietarios mobile
- [ ] Lista de citas mobile
- [ ] Lista de historias clínicas mobile
- [ ] Lista de inventario mobile
- [ ] Reportes mobile
- [ ] Lista de usuarios mobile
- [ ] Configuración mobile

---

### 13.2 Vista Tablet (768px - 1024px)
**Screenshots requeridos:**
- [ ] Vista tablet de módulos principales
- [ ] Sidebar colapsado en tablet

---

## 14. TEMAS Y ESTILOS

### 14.1 Modo Claro (Light Mode)
**Screenshots requeridos:**
- [ ] Dashboard en modo claro
- [ ] Formularios en modo claro
- [ ] Listas en modo claro

---

### 14.2 Modo Oscuro (Dark Mode)
**Screenshots requeridos:**
- [ ] Dashboard en modo oscuro
- [ ] Formularios en modo oscuro
- [ ] Listas en modo oscuro

---

## INSTRUCCIONES PARA CAPTURA DE SCREENSHOTS

### Preparación:
1. Iniciar sesión con cada tipo de usuario (admin, veterinario, recepcionista)
2. Configurar el navegador en diferentes tamaños (desktop, tablet, mobile)
3. Usar datos de ejemplo variados para mostrar diferentes estados

### Herramientas recomendadas:
- **Navegador:** Chrome o Firefox con DevTools para vistas responsive
- **Extensiones:** Full Page Screen Capture, Awesome Screenshot
- **Software:** Snagit, Lightshot, o captura nativa del sistema

### Convenciones de nomenclatura de archivos:
```
[MÓDULO]-[COMPONENTE]-[ESTADO]-[TAMAÑO].png

Ejemplos:
- dashboard-main-admin-desktop.png
- patients-list-filtered-desktop.png
- appointments-form-new-mobile.png
- inventory-details-low-stock-desktop.png
```

### Organización de carpetas:
```
prototipos-ui/
├── 01-publicas/
│   ├── landing-page.png
│   └── login.png
├── 02-dashboard/
├── 03-pacientes/
├── 04-propietarios/
├── 05-citas/
├── 06-historias-clinicas/
├── 07-inventario/
├── 08-reportes/
├── 09-usuarios/
├── 10-configuracion/
├── 11-navegacion/
├── 12-componentes/
├── 13-responsive/
└── 14-temas/
```

---

## RESUMEN DE CAPTURAS TOTALES NECESARIAS

| Módulo | Capturas Estimadas |
|--------|-------------------|
| Páginas Públicas | 2 |
| Dashboard | 3 |
| Pacientes | 7 |
| Propietarios | 6 |
| Citas | 8 |
| Historias Clínicas | 7 |
| Inventario | 9 |
| Reportes | 3 |
| Usuarios | 7 |
| Configuración | 3 |
| Navegación | 6 |
| Componentes | 6 |
| Responsive | 11 |
| Temas | 6 |
| **TOTAL** | **~84 screenshots** |

---

## CHECKLIST DE COMPLETITUD

### Módulos principales
- [ ] Todas las páginas principales capturadas
- [ ] Todos los formularios capturados (vacíos y con datos)
- [ ] Todos los detalles capturados
- [ ] Todos los estados capturados (éxito, error, vacío)

### Responsive
- [ ] Vistas desktop capturadas
- [ ] Vistas tablet capturadas
- [ ] Vistas mobile capturadas

### Roles de usuario
- [ ] Capturas con rol Administrador
- [ ] Capturas con rol Veterinario
- [ ] Capturas con rol Recepcionista

### Estados especiales
- [ ] Estados de carga
- [ ] Estados de error
- [ ] Estados vacíos
- [ ] Validaciones de formularios

---

**Fecha de creación:** ${new Date().toLocaleDateString('es-ES')}
**Sistema:** VetClinic - Sistema de Gestión Veterinaria
**Versión:** 1.0.0
