Read messages directly from kafka
--sh     shell
docker-compose exec kafka

cd /user/bin

./kafka-console-consumer --topic test-topic --boostrap-server localhost:9092 --from beginning

