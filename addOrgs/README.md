# Add a new organization & peer

In the current working directory as `test-network/addOrgs`, run `node scripts/addPeer.js`

This command dynamically creates relevant YAML fles and shell scripts in the current working directory. 
It will also output the list of shell commands that need to be run to add the new org & peer.

Example:
```
node .\scripts\addPeer.js
cryptogen generate --config=org3-crypto.yaml --output="../organizations"
configtxgen -configPath . -printOrg Org3MSP > ../organizations/peerOrganizations/org3.example.com/org3.json
export IMAGE_TAG=latest
export COMPOSE_PROJECT_NAME=net
docker-compose -f docker-compose-org3.yaml up -d
docker exec Org3cli ./scripts/step1org3.sh mychannel 3 10 false
docker exec Org3cli ./scripts/step2org3.sh mychannel 3 10 false
```

The output lines can then be run one by one in the shell. The create the crypto material, serialized org data, start docker containers, and issue commands to get the latest block, and issue transactions to add the new peer / org to the network.

You may edit the `scripts/addPeer.js` file to change the org number.