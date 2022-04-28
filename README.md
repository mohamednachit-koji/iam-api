# Nestjs hexagonal architecture with Vue.js

A boilerplate/starter project for quickly building Nest.js applications with hexagonal architecture and Vue.js

## Quick Start

- clone repo  ``` git clone https://github.com/KOJI-SAS/brs-node-template ```
### Set up Vue.js client
- ```cd client ```
- install client dependencies ``` yarn ```
- build client ``` yarn build ```


### Set up Nest.js server
- create .env file (you can find mandatory environment variables on .env.example)
- install server dependencies ``` yarn ```
- start server ```yarn start ```
## Features
- **Architecture**: [Hexagonal architecture](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software))
- **Backend framework**: [Nest.js](https://docs.nestjs.com/)
- **Frontend framework**: [Vue.js](https://vuejs.com/)
- **Database**: [TypeORM](https://www.typeorm.com)
- **Validation**: data validation using [Joi](https://github.com/hapijs/joi)
- **Logging**: using [winston](https://github.com/winstonjs/winston)
- **Testing**: unit and integration tests using [Jest](https://jestjs.io)
- **Error handling**: centralized error handling mechanism
- **API documentation**: with [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) and [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)
- **Dependency management**: with [Yarn](https://yarnpkg.com)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env#readme)
- **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io)
- **Santizing**: sanitize request data against xss and query injection
- **Git hooks**: [Husky](https://github.com/typicode/husky)
- **Compression**: gzip compression with [compression](https://github.com/expressjs/compression)
- **CI**: continuous integration with [Travis CI](https://travis-ci.org)
- **Docker support**
- **Code coverage**: using [coveralls](https://coveralls.io)
- **Code quality**: with [Codacy](https://www.codacy.com)
- **Git hooks**: with [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged)
- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)
- **Editor config**: consistent editor configuration using [EditorConfig](https://editorconfig.org)
