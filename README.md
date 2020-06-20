# xarboilerplate
nodejs expressjs boilerplate 


# scripts
```bash
yarn start              # nodemon ./app/server.js
yarn start:pm2          # pm2 start ./scripts/pm2.config.js --only backend-local
yarn test:e2e           # jest -c ./jest.config.e2e.js
yarn test:e2e:coverage  # jest -c ./jest.config.e2e.js --coverage
yarn test:intg          # jest \\.intg.test.js$ --testTimeout=20000
yarn lint               # prettier-standard --lint **/*.js
yarn pretty             # prettier --write **/*.js

yarn build:prod         # docker build -t bolit -f ./scripts/production.Dockerfile .
yarn build:prod:up      # docker-compose -f ./scripts/docker-compose.yml up
yarn build:prod:down    # docker-compose -f ./scripts/docker-compose.yml down

```