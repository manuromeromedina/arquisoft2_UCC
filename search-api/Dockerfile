FROM golang:1.23

ADD . /search-api

WORKDIR /search-api
RUN go mod init search-api
RUN go mod tidy
RUN go build -o search-api
RUN chmod +x /search-api

EXPOSE 8090

ENTRYPOINT ["./search-api"]