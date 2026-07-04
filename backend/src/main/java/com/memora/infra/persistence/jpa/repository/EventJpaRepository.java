package com.memora.infra.persistence.jpa.repository;

import com.memora.dataprovider.database.entity.EventJpaEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventJpaRepository extends JpaRepository<EventJpaEntity, UUID> {
	Optional<EventJpaEntity> findBySlug(String slug);
}

