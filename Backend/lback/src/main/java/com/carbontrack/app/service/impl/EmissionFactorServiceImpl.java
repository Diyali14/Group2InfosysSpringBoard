package com.carbontrack.app.service.impl;

import com.carbontrack.app.dto.request.EmissionFactorRequest;
import com.carbontrack.app.dto.response.EmissionFactorResponse;
import com.carbontrack.app.entity.EmissionFactor;
import com.carbontrack.app.exception.ResourceNotFoundException;
import com.carbontrack.app.repository.EmissionFactorRepository;
import com.carbontrack.app.service.EmissionFactorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmissionFactorServiceImpl implements EmissionFactorService {

    private final EmissionFactorRepository repository;

    @Override
    public EmissionFactorResponse createEmissionFactor(EmissionFactorRequest request) {

        EmissionFactor factor = EmissionFactor.builder()
                .category(request.getCategory())
                .activityType(request.getActivityType())
                .unit(request.getUnit())
                .factor(request.getFactor())
                .build();

        return mapToResponse(repository.save(factor));
    }

    @Override
    public List<EmissionFactorResponse> getAllEmissionFactors() {

        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public EmissionFactorResponse getEmissionFactorById(Long id) {

        EmissionFactor factor = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Emission Factor not found with id : " + id));

        return mapToResponse(factor);
    }

    @Override
    public EmissionFactorResponse updateEmissionFactor(Long id, EmissionFactorRequest request) {

        EmissionFactor factor = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Emission Factor not found with id : " + id));

        factor.setCategory(request.getCategory());
        factor.setActivityType(request.getActivityType());
        factor.setUnit(request.getUnit());
        factor.setFactor(request.getFactor());

        return mapToResponse(repository.save(factor));
    }

    @Override
    public void deleteEmissionFactor(Long id) {

        EmissionFactor factor = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Emission Factor not found with id : " + id));

        repository.delete(factor);
    }

    private EmissionFactorResponse mapToResponse(EmissionFactor factor) {

        return EmissionFactorResponse.builder()
                .id(factor.getId())
                .category(factor.getCategory())
                .activityType(factor.getActivityType())
                .unit(factor.getUnit())
                .factor(factor.getFactor())
                .build();
    }
}