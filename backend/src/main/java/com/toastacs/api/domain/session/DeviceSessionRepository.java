package com.toastacs.api.domain.session;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DeviceSessionRepository extends JpaRepository<DeviceSession, Long> {

    Optional<DeviceSession> findByPassIdAndRevokedAtIsNull(Long passId);

    long countByRevokedAtIsNull();

    Page<DeviceSession> findAllByRevokedAtIsNullOrderByCreatedAtDesc(Pageable pageable);

    @Modifying
    @Query("UPDATE DeviceSession s SET s.lastUsedWindow = :window "
            + "WHERE s.id = :id AND (s.lastUsedWindow IS NULL OR s.lastUsedWindow < :window)")
    int claimWindow(@Param("id") Long id, @Param("window") long window);
}
