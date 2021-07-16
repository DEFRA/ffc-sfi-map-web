# Microservice Performance Tests

This folder contains the peformance tests for the FFC SFI Map Web service `ffc-sfi-map-web` front end.

The framework is based upon (jmeter)[https://jmeter.apache.org/], and utilises an jmeter image from [https://github.com/justb4/docker-jmeter].

## Requirements

- Docker Desktop 2.2.0.3 (42716) or higher
- (jmeter v5.1.1)[https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-5.1.1.tgz] (for local running)

## How to run the tests
- `cd test/performance`
- `docker-compose -f ../../docker-compose.yaml -f docker-compose.jmeter.yaml run jmeter-test`
