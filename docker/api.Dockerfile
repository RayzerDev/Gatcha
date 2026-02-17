FROM gradle:9.0-jdk21-alpine AS builder

ARG SERVICE_NAME

WORKDIR /app

COPY --chown=gradle:gradle common /common
COPY --chown=gradle:gradle common-auth /common-auth
COPY --chown=gradle:gradle ${SERVICE_NAME}/gradle gradle
COPY --chown=gradle:gradle ${SERVICE_NAME}/gradlew ${SERVICE_NAME}/build.gradle ${SERVICE_NAME}/settings.gradle ./

RUN gradle dependencies --no-daemon

COPY --chown=gradle:gradle ${SERVICE_NAME}/src src

RUN gradle build -x test --no-daemon

FROM eclipse-temurin:21-jre-alpine


RUN addgroup -S spring && adduser -S spring -G spring && \
    apk add --no-cache wget

USER spring:spring
WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
