package com.memora.dataprovider.database.repository;

import com.memora.dataprovider.database.entity.PhotoJpaEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhotoRepository extends JpaRepository<PhotoJpaEntity, UUID> {

	List<PhotoJpaEntity> findAllByEventIdOrderByCreatedAtDesc(UUID eventId);
}
