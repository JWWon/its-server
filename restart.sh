#!/bin/bash
yarn build & chmod 700 ./dist/bin/www.js & sudo systemctl restart its-server
