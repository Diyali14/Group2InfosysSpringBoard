package com.carbontrack.app.repository;

import com.carbontrack.app.entity.Badge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BadgeRepository extends JpaRepository<Badge, Long> {

    List<Badge> findByUserId(Long userId);

}