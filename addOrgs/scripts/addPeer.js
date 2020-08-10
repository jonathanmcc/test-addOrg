const { spawnSync, env } = require('process');
const fs = require('fs');
const path = require('path');

//Load `crypto-config.yaml` and replace XXX with the org number
const orgNumber = '3';
const P0PORT = 11051;

let cryptoConfig = fs.readFileSync(path.join(__dirname, '../base/crypto-config.yaml')).toString();
cryptoConfig = cryptoConfig.replace(/XXX/g, orgNumber);
fs.writeFileSync(path.join(__dirname, `../org${orgNumber}-crypto.yaml`), cryptoConfig);

// console.log(cryptoConfig);
const createCommand = `cryptogen generate --config=org${orgNumber}-crypto.yaml --output="../organizations"`;
// spawnSync(createCommand);
console.log(createCommand);

//Once crypto material is cready, we can do the configtx stuff.

let configBase = fs.readFileSync(path.join(__dirname, '../base/configtx-base.yaml')).toString();
configBase = configBase.replace(/XXX/g, orgNumber);
configBase = configBase.replace(/YYY/, P0PORT.toString());
fs.writeFileSync(path.join(__dirname, '../configtx.yaml'), configBase);

const configtxCommand = `configtxgen -configPath . -printOrg Org${orgNumber}MSP > ../organizations/peerOrganizations/org3.example.com/org3.json`;
//spawnSync(configtxCommand);
console.log(configtxCommand);

let composeBase = fs.readFileSync(path.join(__dirname, '../base/docker-compose-base.yaml')).toString();
composeBase = composeBase.replace(/XXX/g, orgNumber);
composeBase = composeBase.replace(/YYY/g, P0PORT.toString());
composeBase = composeBase.replace(/ZZZ/g, (P0PORT + 1).toString());
composeBase = composeBase.replace(/\$IMAGE_TAG/g, 'latest');
fs.writeFileSync(path.join(__dirname, `../docker-compose-org${orgNumber}.yaml`), composeBase);

console.log(`export IMAGE_TAG=latest`);
console.log(`export COMPOSE_PROJECT_NAME=net`);

const composeCommand = `docker-compose -f docker-compose-org${orgNumber}.yaml up -d`;
// spawnSync(composeCommand);
console.log(composeCommand);

let envsh = fs.readFileSync(path.join(__dirname, '../base/env.sh')).toString();
envsh = envsh.replace(/XXX/g, orgNumber);
fs.writeFileSync(path.join(__dirname, `../env.sh`), envsh);

let step1base = fs.readFileSync(path.join(__dirname, '../base/step1org.sh')).toString();
step1base = step1base.replace(/XXX/g, orgNumber);
fs.writeFileSync(path.join(__dirname, `../step1org${orgNumber}.sh`), step1base);

let step2base = fs.readFileSync(path.join(__dirname, `../base/step2org.sh`)).toString();
step2base = step2base.replace(/XXX/g, orgNumber);
fs.writeFileSync(path.join(__dirname, `../step2org${orgNumber}.sh`), step2base);

let dockerExec1 = `docker exec Org${orgNumber}cli ./scripts/step1org${orgNumber}.sh mychannel 3 10 false`;
console.log(dockerExec1);

let dockerExec2 = `docker exec Org${orgNumber}cli ./scripts/step2org${orgNumber}.sh mychannel 3 10 false`;
console.log(dockerExec2);