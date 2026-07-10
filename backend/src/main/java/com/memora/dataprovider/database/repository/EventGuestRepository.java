package com.memora.dataprovider.database.repository;

import com.memora.core.domain.model.GuestRsvpStatus;
import com.memora.dataprovider.database.entity.EventGuestJpaEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventGuestRepository extends JpaRepository<EventGuestJpaEntity, UUID> {
    Page<EventGuestJpaEntity> findByEventIdOrderByCreatedAtDesc(UUID eventId, Pageable pageable);

    Optional<EventGuestJpaEntity> findByInvitationToken(String invitationToken);

    @Query("""
        select new com.memora.dataprovider.database.repository.EventGuestRsvpSummaryProjection(
            count(guest),
            coalesce(sum(case when guest.rsvpStatus = :pending then 1 else 0 end), 0),
            coalesce(sum(case when guest.rsvpStatus = :confirmed then 1 else 0 end), 0),
            coalesce(sum(case when guest.rsvpStatus = :declined then 1 else 0 end), 0),
            coalesce(sum(case when guest.rsvpStatus = :confirmed then 1 + guest.plusOnes else 0 end), 0)
        )
        from EventGuestJpaEntity guest
        where guest.eventId = :eventId
        """)
    EventGuestRsvpSummaryProjection summarizeByEventId(
        @Param("eventId") UUID eventId,
        @Param("pending") GuestRsvpStatus pending,
        @Param("confirmed") GuestRsvpStatus confirmed,
        @Param("declined") GuestRsvpStatus declined
    );
}
