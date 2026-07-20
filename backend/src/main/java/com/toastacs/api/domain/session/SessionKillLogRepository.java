package com.toastacs.api.domain.session;

import java.time.Instant;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SessionKillLogRepository extends JpaRepository<SessionKillLog, Long> {

    long countByPassIdAndCreatedAtGreaterThanEqual(Long passId, Instant from);

    long countByCreatedAtGreaterThanEqual(Instant from);

    Page<SessionKillLog> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("""
            select k.passId as passId, count(k) as kills
            from SessionKillLog k
            where k.createdAt >= :from
            group by k.passId
            having count(k) >= :threshold
            order by count(k) desc
            """)
    List<KillCountByPass> countKillsByPassSince(@Param("from") Instant from, @Param("threshold") long threshold);

    interface KillCountByPass {
        Long getPassId();

        long getKills();
    }
}
