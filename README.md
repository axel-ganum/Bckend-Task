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

API RESTful desarrollada con NestJS para la gestión de tareas con capacidades de inteligencia artificial. Este proyecto permite crear, leer, actualizar y eliminar tareas, además de ofrecer funcionalidades avanzadas como la generación automática de tareas mediante IA.

## 🚀 Características

- ✅ Gestión completa de tareas (CRUD)
- 🤖 Generación automática de tareas mediante IA
- 🔍 Búsqueda y filtrado de tareas
- 🔐 Autenticación y autorización
- 🛡️ Validación de datos integrada
- 📊 Base de datos PostgreSQL con TypeORM
- 🧪 Pruebas unitarias y de integración
- 📦 Configuración mediante variables de entorno

## 🛠️ Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- PostgreSQL
- Cuenta en un servicio de IA (si se utiliza la generación de tareas)

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
   
   # Configuración de la base de datos
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_DATABASE=task_manager
   
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

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
