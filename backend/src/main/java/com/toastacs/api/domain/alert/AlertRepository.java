package com.toastacs.api.domain.alert;

import java.time.Instant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    Page<Alert> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long countByCreatedAtGreaterThanEqual(Instant from);
}
