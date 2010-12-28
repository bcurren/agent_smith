node-microseconds
=================

Simple wrapper around the *nix gettimeofday() system call which provides microseconds.

Compiling
---------

    node-waf configure build test

Usage
-----

    var microseconds = require("../lib/node-microseconds").microseconds;
    require("sys").puts(microseconds());
