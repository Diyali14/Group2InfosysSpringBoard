package com.carbontrack.app.controller;

import com.carbontrack.app.dto.request.EmissionFactorRequest;
import com.carbontrack.app.dto.response.EmissionFactorResponse;
import com.carbontrack.app.service.EmissionFactorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/emission-factors")
@RequiredArgsConstructor
@Tag(
        name = "Emission Factor API",
        description = "APIs for Managing Emission Factors"
)
public class EmissionFactorController {

    private final EmissionFactorService service;

    @Operation(summary = "Create a new emission factor")
    @PostMapping
    public EmissionFactorResponse createEmissionFactor(
            @Valid @RequestBody EmissionFactorRequest request) {

        return service.createEmissionFactor(request);
    }

    @Operation(summary = "Get all emission factors")
    @GetMapping
    public List<EmissionFactorResponse> getAllEmissionFactors() {
        return service.getAllEmissionFactors();
    }

    @Operation(summary = "Get emission factor by ID")
    @GetMapping("/{id}")
    public EmissionFactorResponse getEmissionFactorById(@PathVariable Long id) {
        return service.getEmissionFactorById(id);
    }

    @Operation(summary = "Update emission factor")
    @PutMapping("/{id}")
    public EmissionFactorResponse updateEmissionFactor(
            @PathVariable Long id,
            @Valid @RequestBody EmissionFactorRequest request) {

        return service.updateEmissionFactor(id, request);
    }

    @Operation(summary = "Delete emission factor")
    @DeleteMapping("/{id}")
    public void deleteEmissionFactor(@PathVariable Long id) {
        service.deleteEmissionFactor(id);
    }
}