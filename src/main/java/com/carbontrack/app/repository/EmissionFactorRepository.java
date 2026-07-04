package com.carbontrack.app.repository;

import com.carbontrack.app.entity.EmissionFactor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmissionFactorRepository extends JpaRepository<EmissionFactor, Long> {

    List<EmissionFactor> findByCategory(String category);

    Optional<EmissionFactor> findByCategoryAndActivityType(String category, String activityType);

}