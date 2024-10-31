# install Docker
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# login to Docker
docker login -u daniel2202x -p ...

# create Docker Service
docker swarm init
docker pull daniel2202x/ngx-todo:latest
docker service create --name ngx-todo --replicas 3 --publish 80:80 --publish 443:443 daniel2202x/ngx-todo:latest

# validate Service
curl http://localhost
curl https://localhost