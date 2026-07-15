package com.carbontrack.app.repository;

import com.carbontrack.app.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import com.carbontrack.app.dto.response.ActivityEmissionSummary;
import java.time.LocalDate;
import java.util.List;

import com.carbontrack.app.dto.response.CategoryEmissionResponse;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findByUserId(Long userId);

    List<ActivityLog> findByUserIdAndLogDateBetween(
            Long userId,
            LocalDate startDate,
            LocalDate endDate
    );
    @Query("""
SELECT COALESCE(SUM(a.co2e), 0)
FROM ActivityLog a
WHERE a.user.id = :userId
AND a.logDate = :date
""")
    Double getDailyEmission(
            @Param("userId") Long userId,
            @Param("date") LocalDate date
    );

    @Query("""
SELECT COALESCE(SUM(a.co2e), 0)
FROM ActivityLog a
WHERE a.user.id = :userId
AND a.logDate BETWEEN :startDate AND :endDate
""")
    Double getEmissionBetweenDates(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
    @Query("""
SELECT new com.carbontrack.app.dto.response.CategoryEmissionResponse(
    a.category,
    COALESCE(SUM(a.co2e), 0)
)
FROM ActivityLog a
WHERE a.user.id = :userId
AND a.logDate BETWEEN :startDate AND :endDate
GROUP BY a.category
ORDER BY SUM(a.co2e) DESC
""")
    List<CategoryEmissionResponse> getCategoryWiseEmission(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("""
SELECT new com.carbontrack.app.dto.response.ActivityEmissionSummary(
    a.category,
    a.activityType,
    SUM(a.co2e),
    COUNT(a),
    SUM(a.quantity)
)
FROM ActivityLog a
WHERE a.user.id = :userId
AND a.logDate BETWEEN :startDate AND :endDate
GROUP BY a.category, a.activityType
ORDER BY SUM(a.co2e) DESC
""")
    List<ActivityEmissionSummary> getActivityEmissionSummary(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}