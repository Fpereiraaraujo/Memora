package com.memora.dataprovider.database.repository;

import com.memora.dataprovider.database.entity.InfluencerJpaEntity;
import com.memora.core.domain.model.InfluencerStatus;
import java.util.UUID;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InfluencerRepository extends JpaRepository<InfluencerJpaEntity, UUID> {
	List<InfluencerJpaEntity> findAllByOrderByCreatedAtDesc();
	Optional<InfluencerJpaEntity> findByReferralCode(String referralCode);
	long countByStatus(InfluencerStatus status);
	boolean existsByReferralCode(String referralCode);
}
