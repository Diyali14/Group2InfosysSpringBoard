package com.carbontrack.app.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String category;

    @Column(name = "activity_type", nullable = false)
    private String activityType;

    @Column(nullable = false)
    private Double quantity;

    @Column(nullable = false)
    private String unit;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;

    @Column(nullable = false)
    private Double co2e;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}