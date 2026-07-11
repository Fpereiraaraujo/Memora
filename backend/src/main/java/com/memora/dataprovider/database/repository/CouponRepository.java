package com.memora.dataprovider.database.repository;

import com.memora.dataprovider.database.entity.CouponJpaEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponRepository extends JpaRepository<CouponJpaEntity, UUID> {
	Optional<CouponJpaEntity> findByCode(String code);
}
