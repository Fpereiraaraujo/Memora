package com.memora.core.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.memora.core.domain.model.ReferralCommissionStatus;
import com.memora.core.domain.model.UserRole;
import com.memora.core.domain.model.UserStatus;
import com.memora.dataprovider.database.entity.ReferralCommissionJpaEntity;
import com.memora.dataprovider.database.entity.UserEntity;
import com.memora.dataprovider.database.gateway.AdminQueryGateway;
import com.memora.dataprovider.database.repository.AdminAuditLogRepository;
import com.memora.dataprovider.database.repository.CouponRepository;
import com.memora.dataprovider.database.repository.EventCustomizationRepository;
import com.memora.dataprovider.database.repository.EventRepository;
import com.memora.dataprovider.database.repository.InfluencerRepository;
import com.memora.dataprovider.database.repository.PaymentOrderRepository;
import com.memora.dataprovider.database.repository.PhotoRepository;
import com.memora.dataprovider.database.repository.PlanRepository;
import com.memora.dataprovider.database.repository.ReferralCommissionRepository;
import com.memora.dataprovider.database.repository.UserRepository;
import com.memora.dataprovider.storage.FileStorageService;
import com.memora.entrypoint.api.auth.AuthenticatedUserPrincipal;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AdminManagementServiceTest {

	@Mock private AdminQueryGateway adminQueryGateway;
	@Mock private UserRepository userRepository;
	@Mock private EventRepository eventRepository;
	@Mock private PhotoRepository photoRepository;
	@Mock private EventCustomizationRepository eventCustomizationRepository;
	@Mock private PlanRepository planRepository;
	@Mock private InfluencerRepository influencerRepository;
	@Mock private CouponRepository couponRepository;
	@Mock private PaymentOrderRepository paymentOrderRepository;
	@Mock private ReferralCommissionRepository referralCommissionRepository;
	@Mock private AdminAuditLogRepository adminAuditLogRepository;
	@Mock private FileStorageService fileStorageService;
	@Mock private EventPlanService eventPlanService;

	private AdminManagementService service;
	private UserEntity adminUser;

	@BeforeEach
	void setUp() {
		service = new AdminManagementService(
			adminQueryGateway,
			userRepository,
			eventRepository,
			photoRepository,
			eventCustomizationRepository,
			planRepository,
			influencerRepository,
			couponRepository,
			paymentOrderRepository,
			referralCommissionRepository,
			adminAuditLogRepository,
			fileStorageService,
			new ObjectMapper(),
			eventPlanService
		);

		adminUser = UserEntity.builder()
			.id(UUID.randomUUID())
			.name("Admin")
			.email("admin@memora.test")
			.role(UserRole.ADMIN)
			.status(UserStatus.ACTIVE)
			.createdAt(LocalDateTime.now(ZoneOffset.UTC))
			.updatedAt(LocalDateTime.now(ZoneOffset.UTC))
			.build();
	}

	@Test
	void markReferralCommissionPaidMarksCommissionAsPaid() {
		UUID commissionId = UUID.randomUUID();
		ReferralCommissionJpaEntity commission = ReferralCommissionJpaEntity.builder()
			.id(commissionId)
			.influencerId(UUID.randomUUID())
			.couponId(UUID.randomUUID())
			.paymentOrderId(UUID.randomUUID())
			.eventId(UUID.randomUUID())
			.userId(UUID.randomUUID())
			.grossAmountCents(10000)
			.discountAmountCents(1000)
			.netAmountCents(9000)
			.commissionPercent(20)
			.commissionAmountCents(1800)
			.status(ReferralCommissionStatus.APPROVED)
			.createdAt(LocalDateTime.now(ZoneOffset.UTC).minusDays(1))
			.updatedAt(LocalDateTime.now(ZoneOffset.UTC).minusDays(1))
			.build();

		when(userRepository.findById(adminUser.getId())).thenReturn(Optional.of(adminUser));
		when(referralCommissionRepository.findWithLockById(commissionId)).thenReturn(Optional.of(commission));

		var response = service.markReferralCommissionPaid(
			commissionId,
			"Repasse concluido",
			new AuthenticatedUserPrincipal(adminUser.getId(), adminUser.getEmail(), adminUser.getRole().name()),
			"127.0.0.1",
			"JUnit"
		);

		assertThat(response.message()).isEqualTo("Comissao marcada como paga com sucesso.");
		assertThat(commission.getStatus()).isEqualTo(ReferralCommissionStatus.PAID);
		assertThat(commission.getPaidAt()).isNotNull();
		verify(referralCommissionRepository).save(commission);
		verify(adminAuditLogRepository).save(any());
	}

	@Test
	void markReferralCommissionPaidRejectsAlreadyPaidCommission() {
		UUID commissionId = UUID.randomUUID();
		ReferralCommissionJpaEntity commission = ReferralCommissionJpaEntity.builder()
			.id(commissionId)
			.influencerId(UUID.randomUUID())
			.couponId(UUID.randomUUID())
			.paymentOrderId(UUID.randomUUID())
			.eventId(UUID.randomUUID())
			.userId(UUID.randomUUID())
			.grossAmountCents(10000)
			.discountAmountCents(1000)
			.netAmountCents(9000)
			.commissionPercent(20)
			.commissionAmountCents(1800)
			.status(ReferralCommissionStatus.PAID)
			.createdAt(LocalDateTime.now(ZoneOffset.UTC).minusDays(1))
			.updatedAt(LocalDateTime.now(ZoneOffset.UTC).minusDays(1))
			.paidAt(LocalDateTime.now(ZoneOffset.UTC).minusHours(2))
			.build();

		when(userRepository.findById(adminUser.getId())).thenReturn(Optional.of(adminUser));
		when(referralCommissionRepository.findWithLockById(commissionId)).thenReturn(Optional.of(commission));

		assertThatThrownBy(() -> service.markReferralCommissionPaid(
			commissionId,
			"Repasse duplicado",
			new AuthenticatedUserPrincipal(adminUser.getId(), adminUser.getEmail(), adminUser.getRole().name()),
			"127.0.0.1",
			"JUnit"
		)).isInstanceOf(IllegalArgumentException.class)
			.hasMessage("Comissao ja foi marcada como paga.");
	}
}
