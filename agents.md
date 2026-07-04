# Manual del Agente - Mobuly Backend

## 📌 Visión General del Proyecto

Mobuly es un CRM Mobile-First orientado a profesionales freelance para la gestión de clientes, servicios y citas. El backend sigue una Arquitectura Hexagonal (Ports & Adapters) sobre NestJS, con PostgreSQL como base de datos y Prisma como ORM. El objetivo es mantener un sistema escalable, testeable y mantenible donde cada capa tenga una responsabilidad única y bien definida.

## 🏗️ Arquitectura y Estructura

El flujo de una petición HTTP sigue estrictamente este camino:

```
HTTP Request
       ↓
Controller (infrastructure/controllers) — decoradores @Controller, @Get, @Post...
       ↓
Use Case (application/useCases)
       ↓
Repository Port (domain/repositories)
       ↓
Repository Adapter (infrastructure/repositories)
       ↓
Prisma (infrastructure/prisma)
       ↓
PostgreSQL
```

### Responsabilidades de cada capa:

**Controller (NestJS)**: Define la ruta y el método HTTP mediante decoradores (`@Controller`, `@Get`, `@Post`, etc.). Extrae parámetros de la request (body, query, params, headers). Orquesta la ejecución del caso de uso. Transforma DTOs de entrada/salida. Maneja la respuesta HTTP. NO contiene lógica de negocio.

**Use Case**: Contiene la lógica de negocio pura. Es independiente de frameworks, bases de datos y protocolos de transporte. Recibe datos tipados, ejecuta reglas de negocio, interactúa con puertos de repositorio y retorna resultados.

**Repository Port (Interface)**: Define el contrato que debe cumplir cualquier adaptador de persistencia. Vive en el dominio.

**Repository Adapter**: Implementa el puerto usando un mecanismo de persistencia concreto (Prisma). Vive en infraestructura. Es el ÚNICO lugar donde se importa Prisma.

**Prisma**: ORM que conecta con PostgreSQL. Configurado con tipado estricto.

**Shared**: Contiene errores genéricos, utilidades y tipos compartidos entre capas.

## 🚦 Reglas de Desarrollo

- **SRP obligatorio**: Cada clase/función debe tener una única responsabilidad.
- **TypeScript estricto**: `strict: true` en tsconfig. Modo estricto habilitado siempre.
- **Prohibido `any`**: Nunca usar `any`. Usar `unknown` si el tipo no se conoce, luego hacer narrowing.
- **Prohibido lógica de negocio en controladores**: Los controladores solo orquestan, no deciden.
- **Prohibido acceso directo a Prisma fuera de infraestructura**: Ninguna capa fuera de `infrastructure/repositories` debe importar `@prisma/client`.
- **Toda entrada externa debe validarse con Zod**: Validar en el controller o validator, antes de llegar al caso de uso.
- **Casos de uso independientes de frameworks**: No deben importar nada de Next.js, Express, ni ningún framework HTTP.
- **Entidades de dominio puras e inmutables**: Las entidades deben ser objetos planos o clases sin efectos secundarios. Usar `readonly` donde aplique.
- **No duplicar lógica**: Si un patrón se repite, extraerlo a shared/utils.
- **Mantener bajo acoplamiento**: Depender de interfaces (puertos), no de implementaciones concretas.

## 🧠 Convenciones

- **Nombres descriptivos**: Evitar abreviaturas. Preferir nombres largos pero claros.
- **DTOs separados de entidades**: Los DTOs pertenecen a `application/dto/`. Las entidades pertenecen a `domain/entities/`. No mezclar.
- **Casos de uso con formato PascalCase**:

  ```
  CreateAppointmentUseCase
  UpdateClientUseCase
  GetAgendaViewUseCase
  ```

- **Repositorios con formato**:

  ```
  IAppointmentRepository     (puerto - domain/repositories)
  PrismaAppointmentRepository (adaptador - infrastructure/repositories)
  ```

## 💾 Estado de Implementación

- [ ] Configuración inicial
- [ ] Prisma Schema
- [ ] Dominio (entities, enums, repositories ports, exceptions, valueObjects)
- [ ] Aplicación (useCases, DTOs, services)
- [ ] Infraestructura (prisma, repositories, controllers, validators, auth, logger)
- [ ] Endpoints (NestJS Controllers + Modules)
- [ ] Validación (Zod schemas)
- [ ] Tests (Vitest)
