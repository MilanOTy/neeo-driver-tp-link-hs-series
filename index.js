'use strict';

const neeoapi = require('neeo-sdk');
const controller = require('./controller');

console.log('NEEO SDK Example "simpleCustomDevice" adapter');
console.log('---------------------------------------------');

/*
 * Adapter - an Adapter contains one or more DEVICES. In this case we only use a single very
 * simple 2 button device.
 */

// first we set the device info, used to identify it on the Brain
const customLightDevice = neeoapi.buildDevice('Simple Buttons')
  .setManufacturer('TP-Link')
  .addAdditionalSearchToken('HS100/HS110')
  .setType('ACCESSOIRE')

  // Then we add the capabilities of the device
  .addButton({ name: 'power-on', label: 'HS-PLUG ON' })
  .addButton({ name: 'power-off', label: 'HS-PLUG OFF' })
  .addButtonHander(controller.onButtonPressed);

function startSdkExample(brain) {
  console.log('- Start server');
  neeoapi.startServer({
    brain,
    port: 6336,
    name: 'simple-adapter-one',
    devices: [customLightDevice]
  })
  .then(() => {
    console.log('# READY! use the NEEO app to search for "NEEO Simple Device".');
  })
  .catch((error) => {
    //if there was any error, print message out to console
    console.error('ERROR!', error.message);
    process.exit(1);
  });
}

const brainIp = process.env.BRAINIP;
if (brainIp) {
  console.log('- use NEEO Brain IP from env variable', brainIp);
  startSdkExample(brainIp);
} else {
  console.log('- discover one NEEO Brain...');
  neeoapi.discoverOneBrain()
    .then((brain) => {
      console.log('- Brain discovered:', brain.name);
      startSdkExample(brain);
    });
}