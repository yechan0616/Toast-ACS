package com.toastacs.api.domain.entry;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EntryLogRepository extends JpaRepository<EntryLog, Long> {

    Page<EntryLog> findByResultOrderByCreatedAtDesc(EntryResult result, Pageable pageable);

    long countByResultAndCreatedAtGreaterThanEqual(EntryResult result, Instant from);

    long countByResult(EntryResult result);

    long countByPassIdAndResult(Long passId, EntryResult result);

    @Query("SELECT e.sessionId AS sessionId, COUNT(e) AS count FROM EntryLog e "
            + "WHERE e.result = :result AND e.sessionId IN :sessionIds GROUP BY e.sessionId")
    List<SessionEntryCount> countByResultGroupedBySession(@Param("result") EntryResult result,
            @Param("sessionIds") Collection<Long> sessionIds);

    @Query("SELECT e.createdAt FROM EntryLog e WHERE e.result = :result AND e.createdAt >= :from")
    List<Instant> findCreatedAtByResultSince(@Param("result") EntryResult result,
            @Param("from") Instant from);

    interface SessionEntryCount {
        Long getSessionId();

        long getCount();
    }
}
