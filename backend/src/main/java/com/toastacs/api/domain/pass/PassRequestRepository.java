package com.toastacs.api.domain.pass;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PassRequestRepository extends JpaRepository<PassRequest, Long> {

    Optional<PassRequest> findByPublicId(UUID publicId);

    Page<PassRequest> findAllByStatusOrderByCreatedAtDesc(PassRequestStatus status, Pageable pageable);

    long countByStatus(PassRequestStatus status);
}
