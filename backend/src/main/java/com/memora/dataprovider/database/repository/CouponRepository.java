package com.memora.dataprovider.database.repository;

import com.memora.dataprovider.database.entity.CouponJpaEntity;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponRepository extends JpaRepository<CouponJpaEntity, UUID> {
	Optional<CouponJpaEntity> findByCode(String code);

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	Optional<CouponJpaEntity> findWithLockById(UUID id);
}
