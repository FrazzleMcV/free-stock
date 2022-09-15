for i in {1..10000}
do
        curl -X POST http://localhost:6023/claim-free-share -H 'Content-Type: application/json' -d '{"account":"$i"}'
done