FROM gradle:9.0-jdk21-alpine AS builder

ARG SERVICE_NAME

WORKDIR /app

COPY --chown=gradle:gradle ${SERVICE_NAME}/gradle gradle
COPY --chown=gradle:gradle ${SERVICE_NAME}/gradlew ${SERVICE_NAME}/build.gradle ${SERVICE_NAME}/settings.gradle ./

RUN gradle dependencies --no-daemon

COPY --chown=gradle:gradle ${SERVICE_NAME}/src src

RUN gradle clean build -x test --no-daemon

FROM eclipse-temurin:21-jre-alpine


RUN addgroup -S spring && adduser -S spring -G spring && \
    apk add --no-cache wget

USER spring:spring
WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

HEALTHCHECK --interval=3s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
