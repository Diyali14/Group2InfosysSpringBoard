package com.carbontrack.app.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI carbonTrackOpenAPI() {

        return new OpenAPI()
                .info(new Info()
                        .title("CarbonTrack API")
                        .description("REST API for Carbon Footprint Tracking System")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("CarbonTrack Team")
                                .email("team@carbontrack.com"))
                        .license(new License()
                                .name("MIT License")))
                .externalDocs(new ExternalDocumentation()
                        .description("Project Documentation"));
    }
}