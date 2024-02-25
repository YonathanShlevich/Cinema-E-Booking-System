# Cinema-E-Booking-System
UGA CSCI 4050 Semester Project

When developing new features, create a new branch to work on.
Only merge (pull) to main once your feature has been fully completed and is ready to merge. 

## How to Create a New Branch
UI -> from github website  
git clone https(from UI)  
git checkout [-b] [branch_name]  
git branch (checks which branch you are currently working in)  
When ready to merge, go into the UI and create a Pull Request  

## How to Run the App with connection to Oracle
You will need to download Docker Desktop for this to work.  
We are using a docker container to run the App with backend because...  
1) We should be able to run all of the code without having everyone install OCI clients
2) Everyone will be given the OCI Wallet as a zip file in their directory. It will not be picked up by github due to the .gitignore file. It will be kept this way for security reasons.

### How to run the docker commands.
You *can* run everything completely through the docker container without mounting a volume to it, but that makes it difficult to code in. We will be mounting our local directory with all of our code to the docker container so that the only thing you have to do it actually run *npm start* from the container and the rest can be done from VSCode.  
Run this command the FIRST TIME you set-up the docker image:  
*docker build . -t app*
Run this command when you're ready to boot up the App with DB connection:   
*docker run -it -v "/$(pwd)":/app app:v2*
From this point, you'll be in the docker container. 
