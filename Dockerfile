# tell the docker to build the node image from DOCKER HUB
FROM node:16.13.2

# the working directory you want to run the node app in
WORKDIR /usr/src/smart-brain-api

# copy from the current directory to the container
COPY ./ ./

# what should we do in the container
# image build step, can be multiple
RUN npm install

# commend instruction tells what to run in the container 
# when u launch the container, one only
CMD [ "/bin/bash" ]