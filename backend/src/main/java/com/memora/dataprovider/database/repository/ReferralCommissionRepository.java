package com.memora.dataprovider.database.repository;

import com.memora.dataprovider.database.entity.ReferralCommissionJpaEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReferralCommissionRepository extends JpaRepository<ReferralCommissionJpaEntity, UUID> {
	Optional<ReferralCommissionJpaEntity> findByPaymentOrderId(UUID paymentOrderId);

	@Query("""
		select coalesce(sum(rc.commissionAmountCents), 0)
		from ReferralCommissionJpaEntity rc
		where rc.status in ('APPROVED', 'PAYABLE')
	""")
	long sumPendingCommissionCents();
}
