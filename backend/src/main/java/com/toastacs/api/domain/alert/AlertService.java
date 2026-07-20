package com.toastacs.api.domain.alert;

import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertRepository alertRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void raise(AlertType type, String detail) {
        alertRepository.save(Alert.of(type, detail));
    }

    @Transactional(readOnly = true)
    public Page<Alert> alerts(Pageable pageable) {
        return alertRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    @Transactional(readOnly = true)
    public long countSince(Instant from) {
        return alertRepository.countByCreatedAtGreaterThanEqual(from);
    }
}
