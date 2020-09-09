
## Information Security and Quality Assurance

This repository contains information security and quality assurance certification projects.  
For more information please visit [https://www.freecodecamp.org/](https://www.freecodecamp.org/).

To run an individual project, after cloning the repository:
1. navigate to it's folder e.g. `01-metric-imperial-converter`
2. install the required dependencies using **`npm install`**
3. if the project requires access to a `MongoDB` database make sure that the connection URI is available under `DB` environment variable
4. use one of the available scripts to start the application or run associated tests:
    ##### `npm start`
    start server (by default on `localhost:3000`)
    ##### `npm run watch`
    start server in development mode using `nodemon` (by default on `localhost:3000`)
    ##### `npm test`
    run associated unit and functional tests
