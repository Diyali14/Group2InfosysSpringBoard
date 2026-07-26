package com.carbontrack.app.service.impl;

import com.carbontrack.app.exception.ResourceNotFoundException;
import com.carbontrack.app.repository.ActivityLogRepository;
import com.carbontrack.app.repository.EmissionFactorRepository;
import com.carbontrack.app.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.carbontrack.app.dto.request.ActivityRequest;
import com.carbontrack.app.dto.response.ActivityResponse;
import com.carbontrack.app.entity.ActivityLog;
import com.carbontrack.app.entity.EmissionFactor;
import com.carbontrack.app.entity.User;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;




@ExtendWith(MockitoExtension.class)
class ActivityServiceImplTest {

    @Mock
    private ActivityLogRepository activityRepo;

    @Mock
    private EmissionFactorRepository factorRepo;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ActivityServiceImpl activityService;

    @BeforeEach
    void setUp() {

    }

    @Test
    void shouldCalculateEmissionSuccessfully() {

        // Arrange
        User user = User.builder()
                .id(1L)
                .build();

        EmissionFactor factor = EmissionFactor.builder()
                .category("Transport")
                .activityType("Car")
                .factor(0.21)
                .build();

        ActivityRequest request = ActivityRequest.builder()
                .userId(1L)
                .category("Transport")
                .activityType("Car")
                .quantity(100.0)
                .unit("km")
                .logDate(LocalDate.now())
                .build();

        ActivityLog savedLog = ActivityLog.builder()
                .id(1L)
                .user(user)
                .category("Transport")
                .activityType("Car")
                .quantity(100.0)
                .unit("km")
                .co2e(21.0)
                .build();

        when(userRepository.findById(1L))
                .thenReturn(java.util.Optional.of(user));

        when(factorRepo.findByCategoryAndActivityType("Transport", "Car"))
                .thenReturn(java.util.Optional.of(factor));

        when(activityRepo.save(any(ActivityLog.class)))
                .thenReturn(savedLog);

        // Act
        ActivityResponse response = activityService.addActivity(request);

        // Assert
        assertEquals(21.0, response.getCo2e());
        assertEquals("Transport", response.getCategory());
        assertEquals("Car", response.getActivityType());
    }

    //Zero Quantity Test
    @Test
    void shouldReturnZeroEmissionForZeroQuantity() {

        User user = User.builder()
                .id(1L)
                .build();

        EmissionFactor factor = EmissionFactor.builder()
                .category("Transport")
                .activityType("Car")
                .factor(0.21)
                .build();

        ActivityRequest request = new ActivityRequest();
        request.setUserId(1L);
        request.setCategory("Transport");
        request.setActivityType("Car");
        request.setQuantity(0.0);
        request.setUnit("km");
        request.setLogDate(LocalDate.now());

        ActivityLog savedLog = ActivityLog.builder()
                .id(2L)
                .user(user)
                .category("Transport")
                .activityType("Car")
                .quantity(0.0)
                .unit("km")
                .co2e(0.0)
                .build();

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(factorRepo.findByCategoryAndActivityType("Transport","Car"))
                .thenReturn(Optional.of(factor));

        when(activityRepo.save(any(ActivityLog.class)))
                .thenReturn(savedLog);

        ActivityResponse response = activityService.addActivity(request);

        assertEquals(0.0,response.getCo2e());
    }

    //Maximum Quantity Test
    @Test
    void shouldCalculateEmissionForLargeQuantity() {

        User user = User.builder()
                .id(1L)
                .build();

        EmissionFactor factor = EmissionFactor.builder()
                .category("Transport")
                .activityType("Car")
                .factor(0.21)
                .build();

        ActivityRequest request = new ActivityRequest();
        request.setUserId(1L);
        request.setCategory("Transport");
        request.setActivityType("Car");
        request.setQuantity(100000.0);
        request.setUnit("km");
        request.setLogDate(LocalDate.now());

        ActivityLog savedLog = ActivityLog.builder()
                .id(3L)
                .user(user)
                .category("Transport")
                .activityType("Car")
                .quantity(100000.0)
                .unit("km")
                .co2e(21000.0)
                .build();

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(factorRepo.findByCategoryAndActivityType("Transport","Car"))
                .thenReturn(Optional.of(factor));

        when(activityRepo.save(any(ActivityLog.class)))
                .thenReturn(savedLog);

        ActivityResponse response = activityService.addActivity(request);

        assertEquals(21000.0,response.getCo2e());
    }

    //Unknown Activity Type Test
    @Test
    void shouldThrowExceptionWhenActivityTypeNotFound() {

        User user = User.builder()
                .id(1L)
                .build();

        ActivityRequest request = new ActivityRequest();
        request.setUserId(1L);
        request.setCategory("Transport");
        request.setActivityType("Spaceship");
        request.setQuantity(100.0);
        request.setUnit("km");
        request.setLogDate(LocalDate.now());

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(factorRepo.findByCategoryAndActivityType("Transport","Spaceship"))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> activityService.addActivity(request));
    }

    //User Not Found Test
    @Test
    void shouldThrowExceptionWhenUserNotFound() {

        ActivityRequest request = new ActivityRequest();
        request.setUserId(99L);
        request.setCategory("Transport");
        request.setActivityType("Car");
        request.setQuantity(50.0);
        request.setUnit("km");
        request.setLogDate(LocalDate.now());

        when(userRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> activityService.addActivity(request));
    }

    //Parameterized test
    @ParameterizedTest
    @CsvSource({
            "100,0.21,21.0",
            "50,0.50,25.0",
            "0,0.21,0.0",
            "200,1.50,300.0"
    })
    void shouldCalculateEmissionForDifferentFactors(
            double quantity,
            double factorValue,
            double expectedEmission) {

        double actualEmission = quantity * factorValue;

        assertEquals(expectedEmission, actualEmission, 0.001);
    }
}
