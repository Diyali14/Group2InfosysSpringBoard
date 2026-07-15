package com.carbontrack.app.dto.llm;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRequest {

    private String model;

    private List<ChatMessage> messages;

}