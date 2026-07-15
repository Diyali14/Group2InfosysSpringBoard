package com.carbontrack.app.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryEmissionResponse {

    private String category;

    private Double totalEmission;

}