package com.memora.dataprovider.database.repository;

import com.memora.dataprovider.database.entity.PaymentOrderJpaEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentOrderRepository extends JpaRepository<PaymentOrderJpaEntity, UUID> {
	Optional<PaymentOrderJpaEntity> findByOrderNsu(String orderNsu);
	Optional<PaymentOrderJpaEntity> findTopByEventIdOrderByCreatedAtDesc(UUID eventId);
}
