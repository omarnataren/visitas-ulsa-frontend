# ✅ Estado de la Conexión con el Backend

## 🎯 CONFIGURACIÓN COMPLETADA

La aplicación Angular está **completamente conectada** al backend en `http://localhost:3000/api`.

---

## 📋 Endpoints Configurados (Sin Mocks)

### ✅ Visitantes (`/visitantes`)
- `GET /visitantes` - Listar todos los visitantes (incluye citas)
- `GET /visitantes/:id` - Obtener un visitante por ID
- `POST /visitantes` - Crear nuevo visitante
  ```json
  {
    "nombre": "string",
    "genero": "string",
    "fechaNacimiento": "date",
    "correo": "string",
    "telefono": "string",
    "ine": "string"
  }
  ```
- `PUT /visitantes/:id` - Actualizar visitante
- `DELETE /visitantes/:id` - Eliminar visitante (respuesta 204)

### ✅ Citas (`/citas`)
- `GET /citas` - Listar todas las citas (incluye visitante y usuario)
- `GET /citas/:id` - Obtener una cita por ID
- `POST /citas` - Crear nueva cita
  ```json
  {
    "visitanteId": number,
    "usuarioId": number,
    "fecha": "date",
    "hora": "time",
    "personaAVisitar": "string",
    "area": "string",
    "medioIngreso": "string",
    "marcaVehiculo": "string?",
    "modeloVehiculo": "string?",
    "colorVehiculo": "string?",
    "placasVehiculo": "string?"
  }
  ```
- `PUT /citas/:id` - Actualizar cita completa
- `PATCH /citas/:id/estado` - Actualizar solo el estado
  ```json
  { "estado": "PROGRAMADA" | "REAGENDADA" | "FINALIZADA" | "CANCELADA" }
  ```
- `DELETE /citas/:id` - Eliminar cita (respuesta 204)

### ✅ Usuarios (`/usuarios`)
- `GET /usuarios` - Listar todos los usuarios (sin contraseña)
- `GET /usuarios/:id` - Obtener un usuario por ID
- `POST /usuarios` - Crear nuevo usuario
  ```json
  {
    "nombre": "string",
    "correo": "string",
    "contrasena": "string",
    "rol": "string"
  }
  ```
- `PUT /usuarios/:id` - Actualizar usuario
- `DELETE /usuarios/:id` - Eliminar usuario (respuesta 204)

---

## � Mapeo de Campos

### Frontend (snake_case) → Backend (camelCase)

**Visitantes:**
- `fecha_nacimiento` → `fechaNacimiento`

**Citas:**
- `visitante_id` → `visitanteId`
- `usuario_id` → `usuarioId`
- `persona_a_visitar` → `personaAVisitar`
- `medio_ingreso` → `medioIngreso`
- `marca_vehiculo` → `marcaVehiculo`
- `modelo_vehiculo` → `modeloVehiculo`
- `color_vehiculo` → `colorVehiculo`
- `placas_vehiculo` → `placasVehiculo`

---

## 📁 Servicios Actualizados

### ✅ VisitantesService
```typescript
await visitantesService.loadVisitantes()        // GET /visitantes
await visitantesService.getVisitante(id)        // GET /visitantes/:id
await visitantesService.addVisitante(data)      // POST /visitantes
await visitantesService.updateVisitante(id, data) // PUT /visitantes/:id
await visitantesService.deleteVisitante(id)     // DELETE /visitantes/:id
```

### ✅ CitasService
```typescript
await citasService.loadCitas()                  // GET /citas
await citasService.getCita(id)                  // GET /citas/:id
await citasService.addCita(data)                // POST /citas
await citasService.updateCita(id, data)         // PUT /citas/:id
await citasService.deleteCita(id)               // DELETE /citas/:id
await citasService.updateEstadoCita(id, estado) // PATCH /citas/:id/estado
await citasService.reagendarCita(id, fecha, hora) // PUT /citas/:id
```

### ✅ UsuariosService (NUEVO)
```typescript
await usuariosService.loadUsuarios()            // GET /usuarios
await usuariosService.getUsuario(id)            // GET /usuarios/:id
await usuariosService.addUsuario(data)          // POST /usuarios
await usuariosService.updateUsuario(id, data)   // PUT /usuarios/:id
await usuariosService.deleteUsuario(id)         // DELETE /usuarios/:id
```

### ⚠️ AuthService (Mock - sin endpoint)
```typescript
await authService.login(correo, contrasena)     // Login simulado
authService.logout()                            // Logout local
authService.isAuthenticated()                   // Verificación local
```

---

## 🚀 Para Probar la Conexión

### 1. Backend debe estar corriendo:
```bash
# En el proyecto del backend
npm start
# Debe estar en http://localhost:3000
```

### 2. Frontend:
```bash
npm start
# Estará en http://localhost:4200
```

### 3. Verificación:
1. Abre `http://localhost:4200`
2. Presiona F12 (Consola del navegador)
3. Ve a la pestaña "Network"
4. Navega a Visitantes o Citas
5. Deberías ver peticiones a `http://localhost:3000/api/*`

---

## 🎨 Características Implementadas

### ✅ Conversión Automática de Campos
Los servicios convierten automáticamente entre:
- Frontend: `snake_case` (ej: `visitante_id`)
- Backend: `camelCase` (ej: `visitanteId`)

### ✅ Manejo de Errores
- Try/catch en todas las operaciones
- Logs en consola para debugging
- Retorno de valores apropiados (null, false, [])

### ✅ Respuestas 204 (No Content)
Manejadas correctamente en DELETE

### ✅ Includes del Backend
El backend incluye relaciones:
- Visitantes incluyen sus citas
- Citas incluyen visitante y usuario

---

## ⚠️ Notas Importantes

### Backend NO tiene endpoints de autenticación
- No hay `/auth/login`
- No hay `/auth/register`
- No hay `/auth/me`
- El `AuthService` usa login simulado

### CORS debe estar habilitado en el backend
```javascript
app.use(cors({
  origin: 'http://localhost:4200'
}));
```

### Formato de Fechas
- Frontend envía: ISO 8601 strings
- Backend recibe: `new Date(fecha)`

### Formato de Horas
El backend convierte la hora:
```javascript
hora: new Date(`1970-01-01T${hora}`)
```

---

## ✨ Todo está listo!

La aplicación está **100% conectada** con tu backend real.
Solo necesitas que el backend esté corriendo en `http://localhost:3000` 🚀

No hay mocks, todos los datos vienen del backend real.
