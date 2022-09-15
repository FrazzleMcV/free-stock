# Emma Demo

Free stock implementation

Some assumptions made
- Broker is an external API lib that is pulled in so the BrokerManager is a wrap around
- External log monitoring to alert/warn when errors occur 
- More minute detailed assumptions have been commented in the code

## How to Run
In repo root
- `docker-compose build`
- `docker-compose up`

Once this is done then the api will be available on ` http://localhost:6023/claim-free-share`

## How to run tests
Run `npm install`

For unit tests in the repo root run `npm test`.


Integration testing is currently manual and can be found in `testResources`. This script posts to the server to generate a larege number of claims. 
Results can be seen in the docker logs.


## Next Steps
- Automate integration test. Probably using supertest and mocking out the Transaction Manager and Broker (Mocked as seperate services called in)
- Claim registry as separate event holder (something like redis)
- Better error handling and testing in the `lotterBuyStocks` logic
