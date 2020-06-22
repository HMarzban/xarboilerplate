<p align="center">
<a href="#badge">
    <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square">
</a>
<a href="https://standardjs.com" rel="nofollow"><img src="https://camo.githubusercontent.com/58fbab8bb63d069c1e4fb3fa37c2899c38ffcd18/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f636f64655f7374796c652d7374616e646172642d627269676874677265656e2e737667" alt="Standard - JavaScript Style Guide" data-canonical-src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" style="max-width:100%;"></a>


<img src="./coverage/badge-lines.svg" alt="Coverage lines" data-canonical-src="./coverage/badge-lines.svg" style="max-width:100%;">

<img src="./coverage/badge-functions.svg" alt="Coverage functions" data-canonical-src="./coverage/badge-functions.svg" style="max-width:100%;">


<img src="./coverage/badge-branches.svg" alt="Coverage branches" data-canonical-src="./coverage/badge-branches.svg" style="max-width:100%;">

<img src="./coverage/badge-statements.svg" alt="Coverage statements" data-canonical-src="./coverage/badge-statements.svg" style="max-width:100%;">

</p>

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

# xarboilerplate
NodeJs Expressjs boilerplate 


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