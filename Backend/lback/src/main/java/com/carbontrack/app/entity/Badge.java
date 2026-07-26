package com.carbontrack.app.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "badges")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "badge_name", nullable = false)
    private String badgeName;

    private String description;

    @Column(name = "earned_date")
    private LocalDate earnedDate;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}