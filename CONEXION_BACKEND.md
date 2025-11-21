# 🔗 Conexión Frontend-Backend - VetClinic Pro

## ✅ Estado: CONECTADO

El frontend está completamente conectado con el backend. Todos los servicios están implementados y listos para usar.

## 📋 Servicios Implementados

### ✅ Servicios Base
- ✅ **authService** - Autenticación y gestión de tokens
- ✅ **api** - Cliente Axios configurado con interceptores

### ✅ Servicios de Gestión
- ✅ **ownerService** - Gestión de propietarios
- ✅ **patientService** - Gestión de pacientes
- ✅ **appointmentService** - Gestión de citas (incluye acciones desde recordatorios)
- ✅ **medicalRecordService** - Gestión de historiales médicos
- ✅ **prescriptionService** - Gestión de prescripciones
- ✅ **inventoryService** - Gestión de inventario
- ✅ **userService** - Gestión de usuarios
- ✅ **roleService** - Gestión de roles y permisos

### ✅ Servicios Adicionales
- ✅ **agendaService** - Visualización de agenda (diaria, semanal, mensual)
- ✅ **informedConsentService** - Gestión de consentimientos informados
- ✅ **clinicService** - Catálogo de servicios de la clínica
- ✅ **reportService** - Generación de reportes
- ✅ **dashboardService** - Estadísticas del dashboard

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto frontend:

```env
VITE_API_BASE_URL=http://localhost:8081/api
VITE_APP_NAME=VetClinic Pro
VITE_APP_VERSION=1.0.0
```

### Configuración por Defecto

Si no se define `VITE_API_BASE_URL`, el sistema usa por defecto:
```
http://localhost:8081/api
```

## 🔐 Autenticación

### Flujo de Autenticación

1. **Login**: El usuario se autentica y recibe `token` y `refreshToken`
2. **Almacenamiento**: Los tokens se guardan en `localStorage`
3. **Interceptores**: Cada petición incluye automáticamente el token JWT
4. **Refresh Automático**: Si el token expira (401), se intenta refrescar automáticamente
5. **Logout**: Se limpian los tokens y se redirige al login

### Manejo de Tokens

- **Access Token**: Se incluye en cada petición (`Authorization: Bearer {token}`)
- **Refresh Token**: Se usa automáticamente cuando el access token expira
- **Cola de Peticiones**: Las peticiones fallidas por token expirado se encolan y se reintentan después del refresh

## 📡 Estructura de Respuestas

Todos los endpoints del backend devuelven esta estructura:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
  timestamp?: string;
}
```

Los servicios del frontend extraen automáticamente `data` de la respuesta.

## 🎯 Endpoints Especiales

### Acciones desde Recordatorios (RF018)

El sistema permite confirmar, cancelar o reprogramar citas directamente desde los enlaces del email:

```typescript
// Confirmar desde recordatorio
await appointmentService.confirmFromReminder(appointmentId, token);

// Cancelar desde recordatorio
await appointmentService.cancelFromReminder(appointmentId, token);

// Reprogramar desde recordatorio
await appointmentService.rescheduleFromReminder(
  appointmentId,
  token,
  newScheduledDate,
  reason
);
```

### Exportación de Archivos

Los servicios de reportes y prescripciones pueden exportar archivos:

```typescript
// Exportar receta en PDF
const blob = await prescriptionService.exportPrescription(id, 'PDF');
reportService.downloadBlob(blob, 'receta.pdf');

// Generar reporte
const reportBlob = await reportService.generateAppointmentsReport(startDate, endDate);
reportService.downloadBlob(reportBlob, 'reporte_citas.xlsx');
```

## 🚀 Uso de los Servicios

### Ejemplo: Obtener Pacientes

```typescript
import { patientService } from '@/services';

// Obtener lista paginada
const patients = await patientService.getAll(0, 10);

// Buscar paciente
const results = await patientService.search('Max');

// Crear paciente
const newPatient = await patientService.create({
  name: 'Max',
  species: 'DOG',
  breed: 'Golden Retriever',
  ownerId: '123',
  // ...
});
```

### Ejemplo: Gestión de Citas

```typescript
import { appointmentService, agendaService } from '@/services';

// Obtener citas del día
const todayAppointments = await agendaService.getDailyView('2024-12-25');

// Crear cita
const appointment = await appointmentService.create({
  patientId: 1,
  ownerId: 1,
  veterinarianId: 'uuid-del-veterinario',
  scheduledDate: '2024-12-25T10:00:00',
  appointmentType: 'CONSULTATION',
  // ...
});

// Confirmar cita
await appointmentService.confirm(appointment.id);
```

## 🔄 Manejo de Errores

El sistema maneja automáticamente:

- ✅ **401 Unauthorized**: Intenta refrescar el token automáticamente
- ✅ **Token Expirado**: Refresca y reintenta la petición
- ✅ **Refresh Fallido**: Redirige al login
- ✅ **Otros Errores**: Se propagan para manejo en componentes

## 📝 Notas Importantes

1. **CORS**: El backend debe tener configurado CORS para permitir peticiones desde el frontend
2. **Puertos**: 
   - Backend: `http://localhost:8081`
   - Frontend: `http://localhost:8080`
3. **Context Path**: El backend usa `/api` como context path
4. **Timeout**: Las peticiones tienen un timeout de 30 segundos

## 🧪 Pruebas

Para probar la conexión:

1. Iniciar el backend en `http://localhost:8081`
2. Iniciar el frontend con `npm run dev`
3. Hacer login con credenciales válidas
4. Navegar por las diferentes secciones

## 📚 Documentación Adicional

- Ver `FRONTEND_README.md` para más detalles del frontend
- Ver documentación del backend en el repositorio del backend
- Ver `RF018_COMPLETADO.md` para detalles de recordatorios

---

**Última actualización**: Diciembre 2024
**Estado**: ✅ Completamente conectado y funcional

