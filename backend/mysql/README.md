# TODO

Implement once `rabbitmq` module is finished, integrated into `pm2` and reviewed by _haimich_.

Previously created in a `docker-compose.yml`:
```
mysql:
  image: mysql:latest
  container_name: event-mysql
  environment:
    MYSQL_ROOT_PASSWORD: topsecret123
  ports:
    - "3306:3306"
```

* Execute `.sql` files on start