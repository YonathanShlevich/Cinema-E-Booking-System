#! /bin/bash

docker buildx build -f dockerfile -t app .

docker run -it -v "/$(pwd)":/app app:v2