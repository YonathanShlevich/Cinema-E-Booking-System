FROM ubuntu:latest

RUN apt-get update  && apt-get upgrade -y
RUN apt-get install wget
RUN apt-get install unzip

RUN mkdir /download ; cd /download
RUN wget https://download.oracle.com/otn_software/linux/instantclient/2113000/instantclient-basic-linux.x64-21.13.0.0.0dbru.zip
RUN mkdir -p /opt/oracle; cd /opt/oracle
RUN unzip /download/instantclient-basic-linux.x64-21.13.0.0.0dbru.zip -d /opt/oracle
COPY Wallet /opt/oracle/instantclient21_13/
RUN mv /opt/oracle/instantclient_21_13/sqlnet.ora /opt/oracle/instantclient_21_13/sqlnet.ora;\
    sed 's|?|/opt/oracle/instantclient21_13|' /opt/oracle/instantclient_21_13/sqlnet.ora > /opt/oracle/instantclient_21_13/sqlnet.ora

RUN echo "export LD_LIBRARY_PATH=/opt/oracle/instantclient_21_13:${LD_LIBRARY_PATH}" >> /root/.profile;
    echo "export PATH=${PATH}:/opt/oracle/instantclient_21_13" >> /root/.profile