var fs = require('fs');
var Docker = require('dockerode');

var dockerSettings = {};
if ( process.env.DOCKER_HOST ) {

    // Parsing DOCKER_HOST environment variable first to setup correct settings
    var host = null;
    var port = null;

    if (process.env.DOCKER_HOST.startsWith("tcp://")) {
        var hostAndPort = process.env.DOCKER_HOST.substring(6).split(":");

        host = hostAndPort[0];
        port = hostAndPort[1];

        if (host == null || port == null) {
            console.log("Failed to parse DOCKER_HOST: " + process.env.DOCKER_HOST);
            process.exit(1);
        }
    } else {
        console.log("Invalid DOCKER_HOST protocol: " + process.env.DOCKER_HOST);
        process.exit(1);
    }

    dockerSettings = {
        protocol: 'https',
        host: host,
        port: port,
        ca: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/ca.pem'),
        cert: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/cert.pem'),
        key: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/key.pem')
    };
} else {
    dockerSettings = {
        socketPath: '/var/run/docker.sock'
    };
}

var docker = new Docker(dockerSettings);

// Pulling latest rabbitmq image
docker.pull('rabbitmq:management', function (err, stream) {

    // Register callback on finish
    docker.modem.followProgress(stream, onFinished);

    function onFinished(err, output) {
        if (err == null) {

            // Create container of rabbitmq on successful pull of image
            docker.createContainer({
                Image: 'rabbitmq:management',
                Env: [
                    'RABBITMQ_DEFAULT_USER=development',
                    'RABBITMQ_DEFAULT_PASS=topsecret123'
                ],
                ExposedPorts: { '15672/tcp': {} },
                Name: "event-rabbitmq",
                Cmd: ['/bin/bash']
            }, function(err, container) {
                if (err == null && container != null) {

                    // Start container
                    container.start({}, function(err, data) {
                        if (err != null) {
                            console.log("Failed to start container: " + err);
                            process.exit(1);
                        }
                    });

                } else {
                    console.log("Failed to create container: " + err);
                    process.exit(1);
                }
            });

        } else {
            console.log("Failed to pull image: " + err);
            process.exit(1);
        }
    }
});

