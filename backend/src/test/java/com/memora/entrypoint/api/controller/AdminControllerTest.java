package com.memora.entrypoint.api.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.memora.core.service.AdminManagementService;
import com.memora.entrypoint.api.auth.AuthenticatedUserPrincipal;
import com.memora.entrypoint.api.dto.AdminActionRequestDto;
import com.memora.entrypoint.api.dto.AdminActionResponseDto;
import com.memora.entrypoint.api.dto.AdminAffiliateMetricsSummaryResponseDto;
import java.time.LocalDate;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;

@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

	@Mock
	private AdminManagementService adminManagementService;

	@Test
	void affiliateMetricsSummaryDelegatesToService() {
		AdminController controller = new AdminController(adminManagementService);
		UUID influencerId = UUID.randomUUID();
		UUID couponId = UUID.randomUUID();
		LocalDate dateFrom = LocalDate.of(2026, 7, 1);
		LocalDate dateTo = LocalDate.of(2026, 7, 11);
		AdminAffiliateMetricsSummaryResponseDto summary = new AdminAffiliateMetricsSummaryResponseDto(
			120000L,
			8L,
			24000L,
			influencerId,
			"Marina",
			4L
		);

		when(adminManagementService.getAffiliateMetricsSummary(dateFrom, dateTo, influencerId, couponId))
			.thenReturn(summary);

		var response = controller.affiliateMetricsSummary(influencerId, couponId, dateFrom, dateTo);

		assertThat(response.getBody()).isEqualTo(summary);
		verify(adminManagementService).getAffiliateMetricsSummary(dateFrom, dateTo, influencerId, couponId);
	}

	@Test
	void markReferralCommissionPaidPassesReasonAndPrincipalContext() {
		AdminController controller = new AdminController(adminManagementService);
		UUID commissionId = UUID.randomUUID();
		UUID adminId = UUID.randomUUID();
		AuthenticatedUserPrincipal principal = new AuthenticatedUserPrincipal(adminId, "admin@memora.test", "ADMIN");
		Authentication authentication = new TestingAuthenticationToken(principal, null);
		MockHttpServletRequest request = new MockHttpServletRequest();
		request.setRemoteAddr("127.0.0.1");
		request.addHeader("User-Agent", "JUnit");

		when(adminManagementService.markReferralCommissionPaid(
			commissionId,
			"Pagamento enviado",
			principal,
			"127.0.0.1",
			"JUnit"
		)).thenReturn(new AdminActionResponseDto("Comissao marcada como paga com sucesso."));

		var response = controller.markReferralCommissionPaid(
			commissionId,
			new AdminActionRequestDto("Pagamento enviado"),
			authentication,
			request
		);

		assertThat(response.getBody()).isEqualTo(new AdminActionResponseDto("Comissao marcada como paga com sucesso."));
		verify(adminManagementService).markReferralCommissionPaid(
			commissionId,
			"Pagamento enviado",
			principal,
			"127.0.0.1",
			"JUnit"
		);
	}
}
