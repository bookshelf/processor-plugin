# Bookshelf Processor Plugin

[![Build Status](https://travis-ci.com/bookshelf/processor-plugin.svg?branch=master)](https://travis-ci.com/bookshelf/processor-plugin) [![Greenkeeper badge](https://badges.greenkeeper.io/bookshelf/processor-plugin.svg)](https://greenkeeper.io/)

This is a plugin for the [Bookshelf Node.js ORM](https://bookshelfjs.org/) that allows defining custom processor
functions that handle transformation of values whenever they are `.set()` on a model.

## How to use

First install the package:

    npm install bookshelf-processor-plugin

Then load the plugin using `bookshelf.plugin('bookshelf-processor-plugin')`. Now you are all set to start defining
custom attribute processors on your models.

For more information check the online
[wiki page](https://github.com/bookshelf/processor-plugin/wiki/Bookshelf-Processor-Plugin).
