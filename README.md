<p align="center">
  <img src="./assets/bunest-icon.svg" width="500" alt="Project Logo" />
</p>

  <p align="center">A NestJS project configured for Node.js runtime</p>

## Table of contents

- [Description](#description)
- [Project setup](#project-setup)
- [~~Compile &~~ run the project](#compile--run-the-project)
- [Build the project](#build-the-project)
- [Run tests](#run-tests)
- [Libraries Guides](#libraries-guides)
  - [1. TypeORM](#1-typeorm)
  - [2. Serving static files (`@nestjs/serve-static`)](#2-serving-static-files-nestjsserve-static)
- [Support](#support)
- [Stay in touch](#stay-in-touch)
- [License](#license)

## Description

A starter template for NestJS on Node.js runtime. This project uses standard Nest tooling and can be deployed to Node environments.

> ⚠️ **Warning**:
>
> - This template is still in development and may not be suitable for production use. Please report any issues you encounter.
> - **Do NOT** use [Nest CLI](https://www.npmjs.com/package/@nestjs/cli) with this template. A Nest-like, dedicated CLI tool for this template is currently in development.

## Project setup

```bash
$ npm install
```

## ~~Compile &~~ run the project

During development `tsc-watch` & `tsc` are used to transpile TypeScript; the project is built with `nest build` for production.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Build the project

Use the standard NestJS build command:

```bash
$ npm run build
```

This produces compiled JavaScript in the `dist` directory.

## Run tests

Tests use Jest as the runner. Use the npm scripts:

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

- Support Nest [here](https://docs.nestjs.com/support).

## License

- Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
- This template is also [MIT licensed](./LICENSE).
