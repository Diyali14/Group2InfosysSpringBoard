package com.carbontrack.app.service;

import com.carbontrack.app.dto.request.EmissionFactorRequest;
import com.carbontrack.app.dto.response.EmissionFactorResponse;

import java.util.List;

public interface EmissionFactorService {

    EmissionFactorResponse createEmissionFactor(EmissionFactorRequest request);

    List<EmissionFactorResponse> getAllEmissionFactors();

    EmissionFactorResponse getEmissionFactorById(Long id);

    EmissionFactorResponse updateEmissionFactor(Long id, EmissionFactorRequest request);

    void deleteEmissionFactor(Long id);
}