package com.memora.dataprovider.database.repository;

import com.memora.dataprovider.database.entity.EventQrArtCustomizationJpaEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventQrArtCustomizationRepository extends JpaRepository<EventQrArtCustomizationJpaEntity, UUID> {
	Optional<EventQrArtCustomizationJpaEntity> findByEventId(UUID eventId);
}
