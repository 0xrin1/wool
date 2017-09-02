# Wool

Decentralized intranet for applications relating to IoT.

## Usage

Follow the steps below to see usage information. Each approach will display
the help output.

### UNIX

Execute the cli command in `/bin/wool-cli` as it is; it will be executed with
node by the OS automatically:

```
$ ./bin/wool-cli -h
```

### Windows

Execute the cli command in `/bin/wool-cli` with node:

```
> node ./bin/wool-cli -h
```

## Architecture

- Decentralized
- Each node is a socket-io server and client

## Lifecycle

- Each node scans the network for other nodes.
  - The first one it finds responds with a ledger of all nodes in the network.
