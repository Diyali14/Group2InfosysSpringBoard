package com.carbontrack.app.dto.llm;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    private String role;

    private String content;

}
