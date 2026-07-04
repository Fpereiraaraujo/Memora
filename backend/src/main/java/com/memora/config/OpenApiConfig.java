package com.memora.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

	@Bean
	public OpenAPI memoraOpenAPI() {
		return new OpenAPI()
			.info(new Info()
				.title("Memora API")
				.version("0.1.0")
				.description("Base inicial da API do Memora"));
	}
}

