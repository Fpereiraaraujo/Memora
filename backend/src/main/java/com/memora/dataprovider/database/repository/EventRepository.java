package com.memora.dataprovider.database.repository;

import com.memora.dataprovider.database.entity.EventJpaEntity;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<EventJpaEntity, UUID> {
	Optional<EventJpaEntity> findBySlug(String slug);
	List<EventJpaEntity> findAllByOwnerIdOrderByCreatedAtDesc(UUID ownerId);
	Optional<EventJpaEntity> findByIdAndOwnerId(UUID id, UUID ownerId);
}
