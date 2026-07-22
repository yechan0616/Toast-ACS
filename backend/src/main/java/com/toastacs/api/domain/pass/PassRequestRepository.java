package com.toastacs.api.domain.pass;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PassRequestRepository extends JpaRepository<PassRequest, Long> {

    Optional<PassRequest> findByPublicId(UUID publicId);

    Page<PassRequest> findAllByStatusOrderByCreatedAtDesc(PassRequestStatus status, Pageable pageable);

    long countByStatus(PassRequestStatus status);

    @Query("select r.seat from PassRequest r where r.status = :status and r.seat is not null")
    List<String> findSeatsByStatus(@Param("status") PassRequestStatus status);
}
