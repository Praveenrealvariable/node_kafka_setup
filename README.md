--> install docker desktop

--> install wsl_update_x64.msi  for windows

--> docker-compose up -d  (to start docker)


Read messages directly from kafka
--sh     open shell  -->
docker-compose exec kafka sh


--> go to below dir
cd /user/bin


--> run below cmnd
./kafka-console-consumer --topic test-topic --boostrap-server localhost:9092 --from beginning




