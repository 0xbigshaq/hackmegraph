# Hackmegraph

Hackmegraph(QL) is a vulnerable GraphQL web application for security researchers. 

The objective in this lab is to escalate your privileges from an anonymous user to Remote Code Execution.

The lab contains multiple vulnerabillities & common mistakes in GraphQL implementation that you'll exploit in order to get to the RCE part. Once you're able to run ``whoami`` on the vulnerable app, you completed the challenge. 


## How to run 
1. Make sure you have ``docker-compose`` installed on your machine.
2. After you ``git clone`` this repo, make sure you're in the root directory and run:
```bash
docker-compose up
```
If you don't already have a local mysql and node images, it might take a minute or two (docker-compose will automatically start to download and build the container)

3. The lab will be available at http://localhost:3001/


## Contact
Twitter: [@0x_shaq](//twitter.com/0x_shaq)# hackmegraph
