package com.toastacs.api.domain.pass;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PassRepository extends JpaRepository<Pass, Long> {

    Optional<Pass> findByCode(String code);

    boolean existsByCode(String code);

    long countByInsideTrue();
}
