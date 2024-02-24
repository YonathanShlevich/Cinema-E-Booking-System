FROM ubuntu:latest

RUN apt-get update  && apt-get upgrade -y
RUN apt-get install wget -y
RUN apt-get install unzip -y
RUN mkdir /download ; cd /download
RUN cd /download; wget https://download.oracle.com/otn_software/linux/instantclient/2113000/instantclient-basic-linux.x64-21.13.0.0.0dbru.zip
RUN ls -al
RUN mkdir -p /opt/oracle; cd /opt/oracle
RUN unzip /download/instantclient-basic-linux.x64-21.13.0.0.0dbru -d /opt/oracle
COPY *Wallet* /opt/oracle/instantclient_21_13/
RUN unzip -o /opt/oracle/instantclient_21_13/Wallet* -d /opt/oracle/instantclient_21_13/network/admin
RUN mv /opt/oracle/instantclient_21_13/network/admin/sqlnet.ora /opt/oracle/instantclient_21_13/network/admin/sqlnet.ora_ ;\
    sed 's|?|/opt/oracle/instantclient_21_13|' /opt/oracle/instantclient_21_13/network/admin/sqlnet.ora_ > /opt/oracle/instantclient_21_13/network/admin/sqlnet.ora
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_21_13:${LD_LIBRARY_PATH}
ENV PATH=${PATH}:/opt/oracle/instantclient_21_13