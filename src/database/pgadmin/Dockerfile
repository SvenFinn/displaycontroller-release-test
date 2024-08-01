FROM dpage/pgadmin4:latest

USER root

# Copy the pgadmin configuration file
COPY servers.json /pgadmin4/servers.json
COPY pgPass /var/lib/pgadmin/storage/admin_pgadmin.org/pgPass

RUN chmod 600 /var/lib/pgadmin/storage/admin_pgadmin.org/pgPass