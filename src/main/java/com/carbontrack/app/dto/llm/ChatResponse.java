package com.carbontrack.app.dto.llm;

import lombok.*;


import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {

    private List<Choice> choices;

}