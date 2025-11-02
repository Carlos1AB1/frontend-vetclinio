# 🏥 VetClinic Pro - Frontend

Sistema integral de gestión para clínicas veterinarias - Aplicación Frontend desarrollada con React + TypeScript.

## 🚀 Características

- 👥 **Gestión de Usuarios**: Interfaz completa para administrar usuarios y roles
- 🔐 **Autenticación Segura**: Login con JWT y manejo de sesiones
- 📊 **Dashboard Interactivo**: Visualización de estadísticas en tiempo real
- 📦 **Control de Inventario**: Gestión visual de productos y medicamentos
- 🎨 **UI/UX Moderna**: Interfaz responsive y atractiva
- 🌙 **Tema Oscuro**: Soporte para modo claro/oscuro
- 📱 **Responsive**: Optimizado para desktop, tablet y móvil

## 🛠️ Tecnologías

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Framework de estilos utilitarios
- **Shadcn/ui** - Componentes de UI accesibles
- **React Router v6** - Navegación y rutas
- **Axios** - Cliente HTTP
- **React Hook Form** - Manejo de formularios
- **Lucide React** - Iconos modernos

## 📋 Requisitos Previos

- Node.js 18 o superior
- npm o yarn
- Backend API corriendo (ver repositorio del backend)

## 🔧 Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/Carlos1AB1/frontend-vetclinio.git
cd frontend-vetclinio
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**

El frontend está configurado para conectarse al backend en `http://localhost:8081/api`

Si necesitas cambiar la URL del backend, edita `src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8081/api';
```

4. **Iniciar en modo desarrollo:**
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:8080`

## 🏗️ Build para Producción

```bash
# Generar build optimizado
npm run build

# Preview del build
npm run preview
```

Los archivos optimizados se generarán en la carpeta `dist/`

## 📁 Estructura del Proyecto

```
frontend-vetclinio/
├── public/                     # Archivos estáticos
│   └── robots.txt
├── src/
│   ├── components/             # Componentes React
│   │   ├── Layout/             # Layouts y navegación
│   │   │   ├── AppSidebar.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── ui/                 # Componentes de UI base (Shadcn)
│   │   ├── users/              # Componentes de usuarios
│   │   └── inventory/          # Componentes de inventario
│   ├── contexts/               # Contextos React
│   │   └── AuthContext.tsx     # Contexto de autenticación
│   ├── hooks/                  # Custom Hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── pages/                  # Páginas principales
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Users.tsx
│   │   ├── Inventory.tsx
│   │   ├── Patients.tsx
│   │   ├── Appointments.tsx
│   │   └── MedicalRecords.tsx
│   ├── services/               # Servicios de API
│   │   ├── api.ts              # Cliente Axios configurado
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── inventoryService.ts
│   │   └── dashboardService.ts
│   ├── types/                  # Tipos TypeScript
│   ├── lib/                    # Utilidades
│   │   └── utils.ts
│   ├── App.tsx                 # Componente principal
│   ├── main.tsx                # Entry point
│   └── index.css               # Estilos globales
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

## 🎨 Componentes Principales

### Layout y Navegación
- **DashboardLayout**: Layout principal con sidebar y header
- **AppSidebar**: Menú lateral con navegación
- **ProtectedRoute**: HOC para proteger rutas autenticadas

### Páginas
- **Login**: Autenticación de usuarios
- **Dashboard**: Panel de estadísticas
- **Users**: Gestión de usuarios (CRUD completo)
- **Inventory**: Control de inventario

### Servicios
Todos los servicios incluyen:
- Manejo de errores
- Interceptores JWT
- Tipado TypeScript completo
- Paginación y filtros

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para la autenticación:

1. Login genera un `accessToken` y `refreshToken`
2. El `accessToken` se incluye en cada petición
3. El `refreshToken` se usa para renovar tokens expirados
4. Los tokens se almacenan en `localStorage`

### Usuario de Prueba
- **Usuario**: admin
- **Contraseña**: admin123
- **Rol**: Administrador

## 🎯 Características de UI/UX

- ✨ Animaciones suaves
- 🎨 Sistema de diseño consistente
- ♿ Accesibilidad (ARIA labels)
- 📱 Responsive design
- 🌙 Soporte para tema oscuro
- 🎭 Feedback visual (toasts, loading states)
- 🔍 Búsqueda y filtros en tiempo real
- 📄 Paginación optimizada

## 🔄 Flujo de Datos

```
Usuario → Componente → Service → API Backend
                ↓
         Context (Estado Global)
                ↓
         Componentes Actualizados
```

## 🐛 Debugging

Activar logs de desarrollo en `api.ts`:
```typescript
console.log('Request:', config);
console.log('Response:', response);
```

## 📦 Scripts Disponibles

```json
{
  "dev": "vite",                    // Modo desarrollo
  "build": "vite build",            // Build producción
  "build:dev": "vite build --mode development",
  "lint": "eslint .",               // Análisis de código
  "preview": "vite preview"         // Preview del build
}
```

## 🌐 Variables de Entorno

El proyecto usa configuración directa en el código. Para cambiar:

**Modo Desarrollo**: Editar `src/services/api.ts`
**Modo Producción**: Configurar en build time

## 🚀 Deployment

### Vercel / Netlify
1. Conectar el repositorio
2. Configurar build command: `npm run build`
3. Configurar output directory: `dist`

### Manual
1. `npm run build`
2. Subir la carpeta `dist/` a tu servidor
3. Configurar servidor web para SPA routing

## 🔗 Enlaces

- **Backend Repository**: [vetclinic-pro-backend](https://github.com/Carlos1AB1/vetclinic-pro)
- **API Documentation**: Ver Postman Collection en el backend

## 🤝 Contribución

Este proyecto es parte del sistema VetClinic Pro desarrollado por el equipo DEV 1.

## 📄 Licencia

© 2025 VetClinic Pro - Sistema de Gestión Veterinaria

---

Desarrollado con ❤️ usando React + TypeScript
