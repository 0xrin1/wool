# Wool

Decentralized intranet for applications relating to IoT.

## Install

Currently you must include the git repo of this project in your `package.json`
file for this to work with node's require function.

## Usage

Below is an example of what you would do to make use of wool's API.

``` javascript
const Wool = require('wool');

const wool = new Wool();

// set data defining this wool node
// so other wool nodes understand what it can do
wool.module = {
    name: 'my-wool-node',
    traits: [
        'stream:sink',
        'stream:source',
    ],
};

// initiate the greeting
wool.start();

// listen for any incoming messages from other wool nodes
wool.on('message:received', (info, message) => {
    // get information about device that sent message in `info`
    // get message itself from `message`
});

// define a node to send a message to
const target = {
    address: wool.ledger[0].address,
};
const data = 'my message body';
const callback = () => {
    // do stuff when the message is sent
    // this is not fired if target node replies,
    // that is covered by the `wool.on` method.
};
wool.message(target, data, callback);
```

## Contribute

Contributions are greatly welcome! We ask, however, that you consider the
following points to contribute most effectively.

- Please familiarise yourself with the [program design](./src/README.md)
  of wool.
- Tools to use would be an [editorconfig](https://editorconfig.org) and
  [eslint](https://eslint.org/) plugins for your favourite IDE/text editor.
- Write necessary tests in the `/test` directory.
