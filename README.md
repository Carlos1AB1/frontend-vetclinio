# 🏥 VetClinic Pro

Sistema integral de gestión para clínicas veterinarias desarrollado con tecnologías modernas.

## 🚀 Características

- 👥 **Gestión de Usuarios**: Sistema completo de roles y permisos (Admin, Veterinario, Recepcionista)
- 🔐 **Autenticación Segura**: JWT con tokens de acceso y refresh
- 📊 **Dashboard Interactivo**: Estadísticas y métricas en tiempo real
- 📦 **Control de Inventario**: Gestión de productos y medicamentos
- 🐾 **Gestión de Pacientes**: (Próximamente en DEV 2)
- 📅 **Gestión de Citas**: (Próximamente en DEV 2)
- 📋 **Historiales Médicos**: (Próximamente en DEV 3)

## 🛠️ Tecnologías

### Frontend
- **React 18** con TypeScript
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Estilos utilitarios
- **Shadcn/ui** - Componentes de UI
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **React Hook Form** - Manejo de formularios

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** con JWT
- **PostgreSQL** - Base de datos
- **Hibernate/JPA** - ORM
- **Maven** - Gestión de dependencias
- **Lombok** - Reducción de boilerplate

## 📋 Requisitos Previos

- Node.js 18+ y npm
- Java 17+
- Maven 3.8+
- PostgreSQL 14+

## 🔧 Instalación

### Backend

1. Configurar PostgreSQL:
```sql
CREATE DATABASE vetclinic_db;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE vetclinic_db TO postgres;
```

2. Configurar variables de entorno en `backend/src/main/resources/application.yml`

3. Compilar y ejecutar:
```bash
cd backend
mvn clean package -DskipTests
mvn spring-boot:run
```

El backend estará disponible en: `http://localhost:8081`

### Frontend

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar en modo desarrollo:
```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:8080`

## 👤 Usuario por Defecto

- **Usuario**: admin
- **Contraseña**: admin123
- **Rol**: ADMIN

## 📁 Estructura del Proyecto

```
vetclinic-pro/
├── backend/                    # API REST Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/vetclinic/
│   │   │   │       ├── config/          # Configuraciones
│   │   │   │       ├── controller/      # Controladores REST
│   │   │   │       ├── dto/             # Data Transfer Objects
│   │   │   │       ├── entity/          # Entidades JPA
│   │   │   │       ├── exception/       # Manejo de excepciones
│   │   │   │       ├── patterns/        # Patrones de diseño
│   │   │   │       ├── repository/      # Repositorios JPA
│   │   │   │       ├── security/        # Seguridad y JWT
│   │   │   │       └── service/         # Lógica de negocio
│   │   │   └── resources/
│   │   │       └── application.yml      # Configuración
│   └── pom.xml                          # Dependencias Maven
│
├── src/                        # Frontend React
│   ├── components/             # Componentes React
│   │   ├── Layout/             # Layouts y rutas protegidas
│   │   ├── ui/                 # Componentes de UI
│   │   ├── users/              # Componentes de usuarios
│   │   └── inventory/          # Componentes de inventario
│   ├── contexts/               # Contextos React (Auth)
│   ├── pages/                  # Páginas principales
│   ├── services/               # Servicios de API
│   └── types/                  # Tipos TypeScript
│
├── public/                     # Archivos estáticos
├── index.html                  # HTML principal
├── package.json               # Dependencias Node
└── vite.config.ts             # Configuración Vite
```

## 🎨 Patrones de Diseño Implementados

### Backend
- **Chain of Responsibility**: Validación de registro de usuarios
- **Adapter**: Servicio de email adaptable
- **Strategy**: Estrategias de notificación (Email, SMS)
- **Builder**: Construcción de objetos complejos (Lombok)
- **Singleton**: Proveedor de tokens JWT
- **Repository**: Abstracción de la capa de datos
- **Facade**: Servicios que simplifican operaciones complejas
- **DTO**: Transferencia de datos entre capas

### Frontend
- **Custom Hooks**: Reutilización de lógica
- **Context API**: Estado global de autenticación
- **Service Layer**: Centralización de llamadas API
- **Compound Components**: Componentes composables

## 🔒 Seguridad

- Autenticación JWT con tokens de acceso y refresh
- Control de acceso basado en roles (RBAC)
- Encriptación de contraseñas con BCrypt
- CORS configurado para múltiples orígenes
- Protección contra intentos de login fallidos
- Validación de datos en frontend y backend

## 📝 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/refresh-token` - Refrescar token
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Usuario actual

### Usuarios (Admin)
- `GET /api/users` - Listar usuarios (paginado)
- `POST /api/users` - Crear usuario
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario (soft delete)

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas del sistema

### Inventario
- `GET /api/inventory` - Listar productos
- `POST /api/inventory` - Crear producto
- `PUT /api/inventory/:id` - Actualizar producto
- `DELETE /api/inventory/:id` - Eliminar producto

## 🧪 Testing

El proyecto incluye Postman Collection en:
- `VetClinic Pro API- Version Carlos.postman_collection.json`

## 📄 Licencia

Proyecto desarrollado como parte del sistema VetClinic Pro.

## 👥 Equipo de Desarrollo

- **DEV 1**: Backend Lead - Seguridad & Core
- **DEV 2**: Backend - Gestión de Pacientes & Citas
- **DEV 3**: Backend - Historiales Médicos & Reportes

---

**VetClinic Pro** - Sistema de Gestión Veterinaria © 2025
