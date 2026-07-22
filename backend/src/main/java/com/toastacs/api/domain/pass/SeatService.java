package com.toastacs.api.domain.pass;

import com.toastacs.api.domain.pass.dto.SeatStatusResponse;
import com.toastacs.api.global.error.ApiException;
import com.toastacs.api.global.error.ErrorCode;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SeatService {

    private final PassRepository passRepository;
    private final PassRequestRepository passRequestRepository;

    @Transactional(readOnly = true)
    public Set<String> takenSeats() {
        Set<String> taken = new HashSet<>(passRepository.findActiveSeats(Instant.now()));
        taken.addAll(passRequestRepository.findSeatsByStatus(PassRequestStatus.PENDING));
        return taken;
    }

    @Transactional(readOnly = true)
    public List<SeatStatusResponse> list() {
        Set<String> taken = takenSeats();
        return Seats.ALL.stream()
                .map(seat -> new SeatStatusResponse(seat, taken.contains(seat)))
                .toList();
    }

    @Transactional(readOnly = true)
    public void validateSelectable(String seat) {
        if (!Seats.isValid(seat)) {
            throw new ApiException(ErrorCode.SEAT_INVALID);
        }
        if (takenSeats().contains(seat)) {
            throw new ApiException(ErrorCode.SEAT_TAKEN);
        }
    }

    @Transactional(readOnly = true)
    public String resolveForApproval(String requestedSeat) {
        Set<String> activeSeats = new HashSet<>(passRepository.findActiveSeats(Instant.now()));
        if (requestedSeat != null) {
            if (activeSeats.contains(requestedSeat)) {
                throw new ApiException(ErrorCode.SEAT_TAKEN);
            }
            return requestedSeat;
        }
        Set<String> taken = takenSeats();
        return Seats.ALL.stream()
                .filter(seat -> !taken.contains(seat))
                .findFirst()
                .orElseThrow(() -> new ApiException(ErrorCode.SEAT_TAKEN));
    }

    @Transactional(readOnly = true)
    public String occupancyMask() {
        Set<String> taken = takenSeats();
        StringBuilder mask = new StringBuilder(Seats.ALL.size());
        for (String seat : Seats.ALL) {
            mask.append(taken.contains(seat) ? '1' : '0');
        }
        return mask.toString();
    }
}
