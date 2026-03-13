FROM sonarqube:community
USER root
COPY sonar-init.sh       /usr/local/bin/sonar-init.sh
COPY sonar-entrypoint.sh /usr/local/bin/sonar-entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/sonar-init.sh /usr/local/bin/sonar-entrypoint.sh \
 && chmod +x /usr/local/bin/sonar-init.sh \
 && chmod +x /usr/local/bin/sonar-entrypoint.sh
USER sonarqube
ENTRYPOINT ["/usr/local/bin/sonar-entrypoint.sh"]
