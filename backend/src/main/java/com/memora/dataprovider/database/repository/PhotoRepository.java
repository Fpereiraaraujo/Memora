package com.memora.dataprovider.database.repository;

import com.memora.core.domain.model.PhotoStatus;
import com.memora.dataprovider.database.entity.PhotoJpaEntity;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhotoRepository extends JpaRepository<PhotoJpaEntity, UUID> {

	List<PhotoJpaEntity> findAllByEventIdOrderByCreatedAtDesc(UUID eventId);

	List<PhotoJpaEntity> findAllByEventIdAndStatusOrderByCreatedAtDesc(UUID eventId, PhotoStatus status);

	Page<PhotoJpaEntity> findAllByEventIdOrderByCreatedAtDesc(UUID eventId, Pageable pageable);

	Page<PhotoJpaEntity> findAllByEventIdAndStatusOrderByCreatedAtDesc(UUID eventId, PhotoStatus status, Pageable pageable);

	Optional<PhotoJpaEntity> findByIdAndEventId(UUID id, UUID eventId);
}
