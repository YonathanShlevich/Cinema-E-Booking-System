#! /bin/bash

docker buildx build -f dockerfile -t app .

docker run -it -v "/%cd%":/app app:v2