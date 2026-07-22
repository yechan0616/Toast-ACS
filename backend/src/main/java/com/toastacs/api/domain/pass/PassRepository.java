package com.toastacs.api.domain.pass;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PassRepository extends JpaRepository<Pass, Long> {

    Optional<Pass> findByCode(String code);

    boolean existsByCode(String code);

    long countByInsideTrue();

    @Query("select p.seat from Pass p where p.seat is not null and p.revokedAt is null and p.expiresAt > :now")
    List<String> findActiveSeats(@Param("now") Instant now);
}
