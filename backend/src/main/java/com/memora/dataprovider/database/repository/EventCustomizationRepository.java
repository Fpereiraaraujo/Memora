package com.memora.dataprovider.database.repository;

import com.memora.dataprovider.database.entity.EventCustomizationJpaEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventCustomizationRepository extends JpaRepository<EventCustomizationJpaEntity, UUID> {

	Optional<EventCustomizationJpaEntity> findByEventId(UUID eventId);
}
