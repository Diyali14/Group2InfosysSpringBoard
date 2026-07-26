package com.carbontrack.app.repository;

import com.carbontrack.app.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findByUserId(Long userId);

    List<ActivityLog> findByUserIdAndLogDateBetween(
            Long userId,
            LocalDate startDate,
            LocalDate endDate
    );

}