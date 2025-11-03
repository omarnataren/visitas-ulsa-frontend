# Integración con Backend - Sistema de Gestión de Visitas

## Configuración

La aplicación está configurada para conectarse al backend en `http://localhost:3000/api`.

### Variables de Entorno

- **Development**: `src/environments/environment.ts`
- **Production**: `src/environments/environment.prod.ts`

Para cambiar la URL del API, modifica la propiedad `apiUrl` en el archivo correspondiente.

## Estructura de la API

### Autenticación

#### Login
```typescript
POST /api/auth/login
Body: { correo: string, contrasena: string }
Response: { id, nombre, correo, rol, token }
```

#### Registro
```typescript
POST /api/auth/register
Body: { nombre, correo, contrasena, rol }
Response: { success: boolean }
```

#### Usuario Actual
```typescript
GET /api/auth/me
Headers: { Authorization: Bearer <token> }
Response: { id, nombre, correo, rol }
```

### Visitantes

#### Listar Visitantes
```typescript
GET /api/visitantes
Response: Visitante[]
```

#### Obtener Visitante
```typescript
GET /api/visitantes/:id
Response: Visitante
```

#### Crear Visitante
```typescript
POST /api/visitantes
Body: { nombre, genero, fecha_nacimiento, correo, telefono, ine }
Response: Visitante
```

#### Actualizar Visitante
```typescript
PUT /api/visitantes/:id
Body: Partial<Visitante>
Response: Visitante
```

#### Eliminar Visitante
```typescript
DELETE /api/visitantes/:id
Response: { success: boolean }
```

#### Buscar Visitante
```typescript
GET /api/visitantes/buscar?q=<searchTerm>
Response: Visitante[]
```

#### Buscar por INE
```typescript
GET /api/visitantes/ine/:ine
Response: Visitante
```

### Citas

#### Listar Citas
```typescript
GET /api/citas
Response: Cita[]
```

#### Obtener Cita
```typescript
GET /api/citas/:id
Response: Cita
```

#### Crear Cita
```typescript
POST /api/citas
Body: {
  visitante_id,
  usuario_id,
  fecha,
  hora,
  persona_a_visitar,
  area,
  medio_ingreso,
  marca_vehiculo?,
  modelo_vehiculo?,
  color_vehiculo?,
  placas_vehiculo?
}
Response: Cita
```

#### Actualizar Cita
```typescript
PUT /api/citas/:id
Body: Partial<Cita>
Response: Cita
```

#### Eliminar Cita
```typescript
DELETE /api/citas/:id
Response: { success: boolean }
```

#### Reagendar Cita
```typescript
PATCH /api/citas/:id/reagendar
Body: { fecha: Date, hora: string }
Response: Cita
```

#### Citas por Visitante
```typescript
GET /api/citas/visitante/:visitanteId
Response: Cita[]
```

#### Citas por Fecha
```typescript
GET /api/citas/fecha?fecha=<isoDate>
Response: Cita[]
```

## Servicios Angular

### AuthService

```typescript
// Login
await authService.login(correo, contrasena);

// Logout
authService.logout();

// Verificar autenticación
const isAuth = authService.isAuthenticated();

// Obtener usuario actual
const user = authService.currentUser();

// Actualizar usuario desde servidor
await authService.getCurrentUser();
```

### VisitantesService

```typescript
// Cargar visitantes
await visitantesService.loadVisitantes();

// Obtener lista (desde signal)
const visitantes = visitantesService.getVisitantes();

// Agregar visitante
const nuevoVisitante = await visitantesService.addVisitante(data);

// Actualizar visitante
await visitantesService.updateVisitante(id, data);

// Eliminar visitante
await visitantesService.deleteVisitante(id);

// Buscar visitante
const resultados = await visitantesService.searchVisitante('Juan');

// Buscar por INE
const visitante = await visitantesService.getVisitanteByINE('PEGA850515HOCRR01');
```

### CitasService

```typescript
// Cargar citas
await citasService.loadCitas();

// Obtener lista (desde signal)
const citas = citasService.getCitas();

// Agregar cita
const nuevaCita = await citasService.addCita(data);

// Actualizar cita
await citasService.updateCita(id, data);

// Eliminar cita
await citasService.deleteCita(id);

// Reagendar cita
await citasService.reagendarCita(id, nuevaFecha, nuevaHora);

// Citas por visitante
const citasVisitante = await citasService.getCitasByVisitante(visitanteId);

// Citas por fecha
const citasFecha = await citasService.getCitasByFecha(new Date());
```

## Autenticación

El sistema utiliza JWT (JSON Web Tokens) para la autenticación. El token se almacena en `localStorage` y se envía automáticamente en cada petición mediante un interceptor de Axios.

### Interceptor de Autenticación

```typescript
// El token se agrega automáticamente a todas las peticiones
config.headers.Authorization = `Bearer ${token}`;

// Si el token expira (401), se redirige automáticamente al login
if (error.response?.status === 401) {
  localStorage.removeItem('currentUser');
  window.location.href = '/login';
}
```

## Manejo de Errores

Todos los métodos de los servicios incluyen manejo de errores con try/catch y retornan valores apropiados en caso de fallo:

- Métodos de creación: retornan `null` en caso de error
- Métodos de actualización/eliminación: retornan `false` en caso de error
- Métodos de consulta: retornan arrays vacíos `[]` en caso de error

Los errores se registran en la consola para facilitar el debugging.

## Iniciar el Proyecto

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar la URL del backend** en `src/environments/environment.ts`

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm start
   ```

4. **Asegurarse de que el backend está corriendo** en `http://localhost:3000`

## Notas Importantes

- Todas las peticiones al backend son asíncronas y utilizan `async/await`
- Los servicios utilizan Angular Signals para la reactividad
- La autenticación es requerida para la mayoría de los endpoints
- Las fechas deben enviarse en formato ISO 8601
- El backend debe tener CORS habilitado para `http://localhost:4200`
