#! /bin/bash

docker build -t app .

docker run -it --rm -p 3000:3000 -v "/$(pwd)":/app app