# Program Design

The program design consists of two parts, a Wool class that orchestrates the
application but also exposes public APIs for other node modules to use.

## Lifecycle

The life of a wool node starts with a protocol that adds itself to the local
network of wool nodes. This is a type handshake consisting of two messages, a
greeting and a confirmation. The former allows a node to inform other nodes of
its existance, the latter is a response to a greeting. Using both allows
pre-existing nodes in the local network to become aware of a new node, and
a new node to be aware of all pre-existing nodes in the local network.

From this point on the lifecycle depends on how the wool API is implemented.

## Architecture

## [Wool](./wool.js)

A class orchestrating the node's [lifecycle](#lifecycle).

Uses [EventEmitter](#eventemitter) to provide an event-driven API.

## [RadioOperator](./radio-operator/radio-operator.js)

A class providing abstracting network messaging and listening so no wool nodes
need to be aware of the network protocol, port, etc. Messages can just be sent
around with confidence they will work consistently throughout code.

Uses [EventEmitter](#eventemitter) to provide an event-driven API.

## [EventEmitter](./event-emitter/event-emitter.js)

A class that gives any extending classes the ability to listen to events and
emit them.
