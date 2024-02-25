docker build -t app .

docker run -it --rm -p 3000:3000 -v "%cd%":/app app