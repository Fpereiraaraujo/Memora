package com.memora.dataprovider.database.repository;

import com.memora.dataprovider.database.entity.EventInvitationJpaEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventInvitationRepository extends JpaRepository<EventInvitationJpaEntity, UUID> {
	Optional<EventInvitationJpaEntity> findByEventId(UUID eventId);
}
