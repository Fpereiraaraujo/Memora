package com.memora.dataprovider.database.repository;

import com.memora.core.domain.model.EventPlanCode;
import com.memora.dataprovider.database.entity.PlanJpaEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlanRepository extends JpaRepository<PlanJpaEntity, EventPlanCode> {
	Optional<PlanJpaEntity> findByCodeAndActiveTrue(EventPlanCode code);
}
