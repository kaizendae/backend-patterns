here are the steps for the demo:

1. docker-compose up
2. call the proxy side-car without the token

   ```bash
   curl http://localhost:4000/hello 
   ```

3. Call the proxy side-car with the token

    ```bash
     curl -H "x-auth-token: mysecrettoken" http://localhost:4000/hello 
     ```