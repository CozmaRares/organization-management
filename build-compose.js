const fs = require("fs");

const envFile = ".env.local";
const composeFile = "docker-compose.yaml";

const VARIABLES = Object.freeze({
  MYSQL_ROOT_PASSWORD: "mysqlRootPassword",
  MYSQL_DATABASE: "mysqlDatabase",
  MYSQL_BIND_PORT: "mysqlBindPort",
  PMA_BIND_PORT: "pmaBindPort",
});

function buildCompose(vars) {
  Object.values(VARIABLES).forEach((varName) => {
    if (vars[varName] === undefined) {
      console.log(`ERROR\nVariable '${varName}' is not set`);
      process.exit(1);
    }
  });

  const { mysqlRootPassword, mysqlDatabase, mysqlBindPort, pmaBindPort } = vars;

  return `
networks:
    org-management:
        driver: bridge

volumes:
    sql_data:

services:
    mysql:
        image: mysql:8.0
        environment:
            MYSQL_ROOT_PASSWORD: ${mysqlRootPassword}
            MYSQL_DATABASE: ${mysqlDatabase}
        ports:
            - ${mysqlBindPort}:3306
        networks:
            org-management:
                aliases:
                - mysql

        volumes:
            - ./sql_data:/var/lib/mysql

    phpmyadmin:
        image: phpmyadmin:5.2.0
        links:
            - mysql
        environment:
            PMA_HOST: mysql
            PMA_PORT: 3306
        ports:
            - ${pmaBindPort}:80
        networks:
            org-management:
                aliases:
                - phpmyadmin
`;
}

const values = {};

fs.readFileSync(envFile, "utf8")
  .split("\n")
  .filter((str) => str.length != 0 && str[0] != "#")
  .map((str) => str.split(" = "))
  .forEach(([name, value]) => {
    values[VARIABLES[name]] = value;
  });

const composeContents = buildCompose(values);

fs.writeFileSync(composeFile, composeContents);
