# Análisis del Flujo de Funcionamiento - ByCarket App

## 📋 Índice

1. [Arquitectura General](#arquitectura-general)
2. [Flujo de Autenticación](#flujo-de-autenticación)
3. [Sistema de Estados Globales](#sistema-de-estados-globales)
4. [Gestión de Llamadas al Backend](#gestión-de-llamadas-al-backend)
5. [Problema de Múltiples Fetches](#problema-de-múltiples-fetches)
6. [Dashboard y Navegación](#dashboard-y-navegación)
7. [Gestión de Vehículos](#gestión-de-vehículos)
8. [Sistema de Publicaciones](#sistema-de-publicaciones)
9. [Recomendaciones de Optimización](#recomendaciones-de-optimización)

---

## 🏗 Arquitectura General

### Stack Tecnológico

- **Frontend**: Next.js 14+ con TypeScript
- **Estado Global**: Zustand para gestión de estado
- **Autenticación**: NextAuth.js + JWT personalizado
- **HTTP Client**: Axios con interceptores
- **UI**: TailwindCSS + React Icons

### Estructura de Providers

La aplicación utiliza múltiples providers anidados que se cargan en este orden:

```
SessionProvider (NextAuth)
└── AuthProvider (Custom)
    └── AuthInitializer
    └── SpinnerProvider
        └── ChatBot
        └── App Content
        └── NotificationsContainer
```

---

## 🔐 Flujo de Autenticación

### 1. Inicialización de la Aplicación

**Al cargar la app**, se ejecutan los siguientes procesos:

1. **SessionProvider**: Inicializa NextAuth.js
2. **AuthProvider**: Se ejecuta el `useEffect` que llama a `initializeAuth()`
3. **initializeAuth()**:
   - Busca token en localStorage
   - Si encuentra token, hace llamada a `/users/me` para obtener datos del usuario
   - Actualiza el estado global con los datos del usuario

### 2. Autenticación con Google

**Flujo Google OAuth**:

1. Usuario hace clic en "Iniciar sesión con Google"
2. NextAuth maneja la autenticación OAuth
3. Se crea una `session` con datos básicos del usuario
4. `AuthProvider` detecta la nueva session y ejecuta `handleGoogleSession()`
5. Se llama a `/auth/process-google` para procesar el usuario en el backend
6. El backend retorna un JWT personalizado y datos del usuario
7. Se guarda el token en localStorage y se actualiza el estado global

### 3. Autenticación Manual (Email/Password)

**Flujo Login Manual**:

1. Usuario completa formulario de login
2. Se llama a `loginUser()` que hace POST a `/auth/login`
3. Backend valida credenciales y retorna JWT + datos de usuario
4. Se guarda token en localStorage y se actualiza estado global

---

## 🔄 Sistema de Estados Globales

### AuthContext (Zustand)

**Responsabilidades**:

- Gestión del estado de autenticación
- Almacenamiento de datos del usuario
- Control de loading states
- Funciones de login/logout/register

**Estados principales**:

```typescript
{
  user: User | null,
  token: string | null,
  isAuthenticated: boolean,
  isActive: boolean,
  loading: boolean
}
```

### VehiclesContext (Zustand)

**Responsabilidades**:

- Gestión de vehículos del usuario
- Cache de marcas, modelos y versiones
- Paginación de vehículos
- Filtros y búsquedas

**Estados principales**:

```typescript
{
  vehicles: VehicleResponse[],
  brands: Brand[],
  models: Model[],
  versions: Version[],
  selectedVehicle: VehicleResponse | null,
  loading: boolean,
  error: string | null,
  pagination: PaginationInfo,
  filters: FilterState
}
```

---

## 🌐 Gestión de Llamadas al Backend

### HTTP Service (Axios)

**Configuración**:

- Base URL desde variables de entorno
- Interceptor que añade automáticamente el token Bearer
- Serialización personalizada de parámetros para arrays

### Servicios Principales

#### 1. **API Service** (`api.service.ts`)

**Endpoints principales**:

- `POST /auth/login` - Login manual
- `POST /auth/register` - Registro de usuario
- `POST /auth/process-google` - Procesamiento OAuth Google
- `GET /users/me` - Datos del usuario actual
- `PATCH /users/me` - Actualización de perfil
- `PATCH /files/user-profile` - Subida de imagen de perfil
- `DELETE /users/me` - Eliminación de cuenta

#### 2. **Vehicle Service** (`vehicle.service.ts`)

**Endpoints principales**:

- `GET /brands` - Lista de marcas
- `GET /brands/{id}/models` - Modelos por marca
- `GET /models/{id}/versions` - Versiones por modelo
- `GET /vehicles/me` - Vehículos del usuario
- `GET /vehicles` - Lista general de vehículos
- `POST /vehicles` - Crear vehículo
- `DELETE /vehicles/{id}` - Eliminar vehículo
- `GET /posts` - Lista de publicaciones
- `GET /posts/me` - Publicaciones del usuario
- `POST /posts` - Crear publicación

---

## 🚨 Problema de Múltiples Fetches

### Diagnóstico del Problema

**Al recargar la vista del perfil del usuario, se realizan aproximadamente 20 llamadas al backend**. Esto se debe a:

#### 1. **Inicialización Múltiple**

```typescript
// En AuthProvider.tsx
useEffect(() => {
  initializeAuth(); // Llama a getUserData()
}, [initializeAuth]);

// En ProfileContent.tsx
const { userData, refetch } = useUserData();

// En useUserData.tsx
useEffect(() => {
  if (isAuthenticated && token) {
    fetchUserData(); // OTRA llamada a getUserData()
  }
}, [isAuthenticated, token]);
```

#### 2. **Hooks que Duplican Llamadas**

- **useUserData**: Hace su propia llamada a `/users/me`
- **AuthContext**: Ya tiene los datos del usuario pero useUserData no los reutiliza
- **useRolePermissions**: Hace llamada a `/posts/me` para contar publicaciones
- **Dashboard components**: Cada uno puede tener su propio useEffect

#### 3. **Re-renders Innecesarios**

```typescript
// En ProfileContent.tsx - múltiples refetch()
refetch(); // Línea 165
refetch(); // Línea 231
```

#### 4. **Falta de Cache/Memoización**

- No hay cache de las llamadas HTTP
- Los hooks no memorizan resultados
- Cada componente hace su propia llamada

### Llamadas Identificadas en el Dashboard

**Al cargar ProfileContent**:

1. `initializeAuth()` → `GET /users/me`
2. `useUserData()` → `GET /users/me` (duplicada)
3. `useRolePermissions()` → `GET /posts/me`
4. Al hacer cualquier actualización → `refetch()` → `GET /users/me`
5. Al subir imagen → `uploadProfileImage()` → `PATCH /files/user-profile` + `refetch()` → `GET /users/me`

**Al navegar entre tabs del dashboard**:

- **VehiclesContent**: `useVehicles()` → `GET /vehicles/me`
- **PostContent**: `useFetchPosts()` → `GET /posts/me`
- **UserListContent** (Admin): `getUsers()` → `GET /users`

---

## 🏠 Dashboard y Navegación

### Estructura del Dashboard

El dashboard utiliza un sistema de tabs dinámico:

```typescript
const validTabs = [
  "profile",
  "vehicles",
  "publications",
  "register-vehicle",
  "publish-vehicle",
  "premium",
];

// Tabs adicionales por rol
if (isPremium) validTabs.push("premium-history");
if (isAdmin) validTabs.push("users", "user-posts", "database-scrapper");
```

### Flujo de Navegación

1. Usuario accede a `/dashboard`
2. Se lee el parámetro `?tab=` de la URL
3. Se valida el tab según el rol del usuario
4. Se renderiza el componente correspondiente
5. Cada tab tiene su propio ciclo de vida y llamadas al backend

---

## 🚗 Gestión de Vehículos

### Flujo de Creación de Vehículo

1. **Carga de Datos de Referencia**:

   ```typescript
   // useVehicleForm.tsx
   getBrands() → GET /brands
   ```

2. **Selección en Cascada**:

   ```typescript
   // Al seleccionar marca
   getModelsByBrand(brandId) → GET /brands/{id}

   // Al seleccionar modelo
   getVersionsByModel(modelId) → GET /models/{id}
   ```

3. **Creación del Vehículo**:
   ```typescript
   createVehicle(formData) → POST /vehicles
   ```

### Gestión de Estado de Vehículos

**VehiclesContext** maneja:

- Lista de vehículos del usuario
- Cache de marcas/modelos/versiones
- Vehículo seleccionado para edición
- Estados de carga y error

---

## 📝 Sistema de Publicaciones

### Flujo de Publicaciones

1. **Listado de Publicaciones**:

   ```typescript
   getPosts(page, limit, filters) → GET /posts
   ```

2. **Publicaciones del Usuario**:

   ```typescript
   getMyPosts() → GET /posts/me
   ```

3. **Creación de Publicación**:
   ```typescript
   createPost(data) → POST /posts
   ```

### Roles y Permisos

**Usuario Free**:

- Máximo 3 publicaciones
- Verificación en `useRolePermissions`

**Usuario Premium/Admin**:

- Publicaciones ilimitadas
- Acceso a funciones administrativas

---
