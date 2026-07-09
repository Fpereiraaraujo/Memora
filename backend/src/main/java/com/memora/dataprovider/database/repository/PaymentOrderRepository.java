package com.memora.dataprovider.database.repository;

import com.memora.dataprovider.database.entity.PaymentOrderJpaEntity;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentOrderRepository extends JpaRepository<PaymentOrderJpaEntity, UUID> {
	Optional<PaymentOrderJpaEntity> findByOrderNsu(String orderNsu);
	Optional<PaymentOrderJpaEntity> findByExternalReference(String externalReference);
	Optional<PaymentOrderJpaEntity> findTopByEventIdOrderByCreatedAtDesc(UUID eventId);

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	Optional<PaymentOrderJpaEntity> findWithLockById(UUID id);

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	Optional<PaymentOrderJpaEntity> findWithLockByExternalReference(String externalReference);
}
