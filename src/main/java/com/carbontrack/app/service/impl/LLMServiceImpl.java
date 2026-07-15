package com.carbontrack.app.service.impl;

import com.carbontrack.app.dto.llm.ChatResponse;
import com.carbontrack.app.service.LLMService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.carbontrack.app.dto.llm.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LLMServiceImpl implements LLMService {

    @Value("${openrouter.api.url}")
    private String apiUrl;

    @Value("${openrouter.api.key}")
    private String apiKey;

    @Value("${openrouter.model}")
    private String model;
    private final WebClient webClient;


    @Override
    public String generateResponse(String prompt) {

        ChatRequest request = ChatRequest.builder()
                .model(model)
                .messages(List.of(
                        ChatMessage.builder()
                                .role("user")
                                .content(prompt)
                                .build()
                ))
                .build();

        ChatResponse response = webClient.post()
                .uri(apiUrl)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(ChatResponse.class)
                .block();

        return response.getChoices().get(0).getMessage().getContent();
    }

}
