FROM sonarqube:community
USER root
COPY sonar-init.sh       /usr/local/bin/sonar-init.sh
COPY sonar-entrypoint.sh /usr/local/bin/sonar-entrypoint.sh
RUN chmod +x /usr/local/bin/sonar-init.sh \
 && chmod +x /usr/local/bin/sonar-entrypoint.sh
USER sonarqube
ENTRYPOINT ["/usr/local/bin/sonar-entrypoint.sh"]
