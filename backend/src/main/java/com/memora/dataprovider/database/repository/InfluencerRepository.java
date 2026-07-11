package com.memora.dataprovider.database.repository;

import com.memora.dataprovider.database.entity.InfluencerJpaEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InfluencerRepository extends JpaRepository<InfluencerJpaEntity, UUID> {
}
