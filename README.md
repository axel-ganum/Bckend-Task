<p align="center">
  <a href="http://nestjs.com/" target="_blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">API de Gestión de Tareas con IA</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/@nestjs/core" target="_blank">
    <img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NestJS Version" />
  </a>
  <a href="https://github.com/nestjs/nest/blob/master/LICENSE" target="_blank">
    <img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="License MIT" />
  </a>
  <a href="https://www.typescriptlang.org/" target="_blank">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
  <a href="https://typeorm.io/" target="_blank">
    <img src="https://img.shields.io/badge/TypeORM-262627?style=flat&logo=typescript&logoColor=white" alt="TypeORM" />
  </a>
</p>

## 📋 Descripción

API RESTful desarrollada con NestJS para la gestión de tareas con capacidades de inteligencia artificial. Este proyecto permite crear, leer, actualizar y eliminar tareas, además de ofrecer funcionalidades avanzadas como la generación automática de tareas mediante IA. Utiliza Supabase como base de datos PostgreSQL en la nube, ofreciendo una solución escalable y fácil de configurar.

## 🚀 Características

- ✅ Gestión completa de tareas (CRUD)
- 🤖 Generación automática de tareas mediante IA
- 🔍 Búsqueda y filtrado de tareas
- 🚀 Base de datos PostgreSQL en la nube con Supabase
- 🛠️ Integración con TypeORM para el manejo de datos
- 🧪 Pruebas unitarias y de integración
- 📦 Configuración mediante variables de entorno

## 🛠️ Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- Cuenta en [Supabase](https://supabase.com/) (para la base de datos)
- Cuenta en un servicio de IA (opcional, solo si se utiliza la generación de tareas)

## 🚀 Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/backend-task-ia.git
   cd backend-task-ia
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   ```env
   PORT=3000
   NODE_ENV=development
   
   # Configuración de Supabase (obtén estos valores en tu panel de control de Supabase)
   DB_HOST=db.xxxxxxxxxxxxx.supabase.co
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=tu_contraseña_supabase
   DB_DATABASE=postgres
   DB_SSL=true
   
   # Configuración de IA (opcional)
   AI_API_KEY=tu_api_key
   ```

## 🏃 Ejecución

### Desarrollo

```bash
# Modo desarrollo (con recarga en caliente)
npm run start:dev
```

### Producción

```bash
# Compilar la aplicación
npm run build

# Ejecutar en producción
npm run start:prod
```

### Pruebas

```bash
# Ejecutar pruebas unitarias
npm run test

# Ejecutar pruebas e2e
npm run test:e2e

# Generar cobertura de pruebas
npm run test:cov
```

## 📚 Documentación de la API

Una vez que el servidor esté en ejecución, puedes acceder a la documentación de la API en:
- Swagger UI: `http://localhost:3000/api`
- JSON: `http://localhost:3000/api-json`

## 🏗️ Estructura del Proyecto

```
src/
├── common/              # Código compartido
├── config/             # Configuraciones
├── modules/            # Módulos de la aplicación
│   ├── tasks/          # Módulo de tareas
│   │   ├── dto/        # Objetos de transferencia de datos
│   │   ├── entities/   # Entidades de la base de datos
│   │   ├── services/   # Lógica de negocio
│   │   └── tasks.module.ts
│   └── ...
├── app.module.ts       # Módulo principal
└── main.ts             # Punto de entrada
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, lee las [pautas de contribución](CONTRIBUTING.md) antes de enviar un pull request.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más información.
## ✨ Créditos

- [NestJS](https://nestjs.com/) - Framework de Node.js
- [TypeORM](https://typeorm.io/) - ORM para TypeScript y JavaScript
- Y todas las increíbles bibliotecas de código abierto que hacen posible este proyecto.

