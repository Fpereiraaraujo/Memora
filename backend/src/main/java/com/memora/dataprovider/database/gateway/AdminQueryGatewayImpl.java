package com.memora.dataprovider.database.gateway;

import com.memora.core.domain.model.EventStatus;
import com.memora.core.domain.model.CouponStatus;
import com.memora.core.domain.model.InfluencerStatus;
import com.memora.core.domain.model.ReferralCommissionStatus;
import com.memora.core.domain.model.UserRole;
import com.memora.core.domain.model.UserStatus;
import com.memora.entrypoint.api.dto.AdminAffiliateCouponMetricDto;
import com.memora.entrypoint.api.dto.AdminAffiliateInfluencerMetricDto;
import com.memora.entrypoint.api.dto.AdminAffiliateMetricsSummaryResponseDto;
import com.memora.entrypoint.api.dto.AdminAffiliateSaleListItemDto;
import com.memora.entrypoint.api.dto.AdminAuditLogListItemDto;
import com.memora.entrypoint.api.dto.AdminCouponListItemDto;
import com.memora.entrypoint.api.dto.AdminDashboardResponseDto;
import com.memora.entrypoint.api.dto.AdminEventListItemDto;
import com.memora.entrypoint.api.dto.AdminInfluencerPerformanceResponseDto;
import com.memora.entrypoint.api.dto.AdminPaymentListItemDto;
import com.memora.entrypoint.api.dto.AdminPlanMetricDto;
import com.memora.entrypoint.api.dto.AdminReferralCommissionListItemDto;
import com.memora.entrypoint.api.dto.AdminRevenueSummaryResponseDto;
import com.memora.entrypoint.api.dto.AdminUserEventDto;
import com.memora.entrypoint.api.dto.AdminUserListItemDto;
import com.memora.entrypoint.api.dto.PageResponseDto;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class AdminQueryGatewayImpl implements AdminQueryGateway {

	private final NamedParameterJdbcTemplate jdbcTemplate;

	public AdminQueryGatewayImpl(NamedParameterJdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@Override
	public AdminDashboardResponseDto getDashboard() {
		Map<String, Object> metrics = jdbcTemplate.queryForMap("""
			select
				(select count(*) from users) as total_users,
				(select count(*) from users where status = 'ACTIVE') as total_active_users,
				(select count(*) from users where status = 'SUSPENDED') as total_suspended_users,
				(select count(*) from users where status = 'DELETED') as total_deleted_users,
				(select count(*) from events) as total_events,
				(select count(*) from events where status = 'ACTIVE') as total_active_events,
				(select count(*) from events where status = 'DRAFT') as total_draft_events,
				(select count(*) from photos where object_key is not null) as total_photos,
				(select count(*) from payment_orders) as total_payment_orders,
				(select count(*) from payment_orders where status = 'APPROVED') as total_approved_payments,
				(select count(*) from payment_orders where status = 'PENDING') as total_pending_payments,
				(select coalesce(sum(coalesce(paid_amount_cents, amount_cents)), 0) from payment_orders where status = 'APPROVED') as gross_revenue_cents,
				(select count(*) from users where created_at >= :todayStart) as users_created_today,
				(select count(*) from users where created_at >= :monthStart) as users_created_this_month,
				(select count(*) from payment_orders where status = 'APPROVED' and paid_at >= :monthStart) as payments_approved_this_month,
				(select count(*) from photos where object_key is not null and created_at >= :monthStart) as photos_uploaded_this_month
			""", new MapSqlParameterSource()
			.addValue("todayStart", LocalDate.now(ZoneOffset.UTC).atStartOfDay())
			.addValue("monthStart", LocalDate.now(ZoneOffset.UTC).withDayOfMonth(1).atStartOfDay()));

		List<AdminPlanMetricDto> revenueByPlan = jdbcTemplate.query("""
			select plan_code, coalesce(sum(coalesce(paid_amount_cents, amount_cents)), 0) as total
			from payment_orders
			where status = 'APPROVED'
			group by plan_code
			order by total desc
			""", (rs, rowNum) -> new AdminPlanMetricDto(rs.getString("plan_code"), rs.getLong("total")));

		List<AdminPlanMetricDto> eventsByPlan = jdbcTemplate.query("""
			select coalesce(plan_code, 'FREE') as plan_code, count(*) as total
			from events
			group by coalesce(plan_code, 'FREE')
			order by total desc
			""", (rs, rowNum) -> new AdminPlanMetricDto(rs.getString("plan_code"), rs.getLong("total")));

		return new AdminDashboardResponseDto(
			asLong(metrics.get("total_users")),
			asLong(metrics.get("total_active_users")),
			asLong(metrics.get("total_suspended_users")),
			asLong(metrics.get("total_deleted_users")),
			asLong(metrics.get("total_events")),
			asLong(metrics.get("total_active_events")),
			asLong(metrics.get("total_draft_events")),
			asLong(metrics.get("total_photos")),
			asLong(metrics.get("total_payment_orders")),
			asLong(metrics.get("total_approved_payments")),
			asLong(metrics.get("total_pending_payments")),
			asLong(metrics.get("gross_revenue_cents")),
			revenueByPlan,
			eventsByPlan,
			asLong(metrics.get("users_created_today")),
			asLong(metrics.get("users_created_this_month")),
			asLong(metrics.get("payments_approved_this_month")),
			asLong(metrics.get("photos_uploaded_this_month"))
		);
	}

	@Override
	public PageResponseDto<AdminUserListItemDto> listUsers(
		int page,
		int size,
		String search,
		String status,
		String role,
		LocalDate createdFrom,
		LocalDate createdTo
	) {
		int normalizedPage = Math.max(page, 0);
		int normalizedSize = Math.min(Math.max(size, 1), 100);
		MapSqlParameterSource params = new MapSqlParameterSource()
			.addValue("limit", normalizedSize)
			.addValue("offset", normalizedPage * normalizedSize);

		String where = buildUserFilters(search, status, role, createdFrom, createdTo, params);
		long total = jdbcTemplate.queryForObject("select count(*) from users u where 1=1 " + where, params, Long.class);

		List<AdminUserListItemDto> content = jdbcTemplate.query("""
			select
				u.id,
				u.name,
				u.email,
				u.role,
				u.status,
				u.created_at,
				u.last_login_at,
				(select count(*) from events e where e.owner_id = u.id) as total_events,
				(select e.plan_code from events e where e.owner_id = u.id and e.plan_code is not null order by e.paid_at desc nulls last, e.created_at desc limit 1) as active_plan_code,
				(select count(*) from photos p join events e2 on e2.id = p.event_id where e2.owner_id = u.id and p.object_key is not null) as total_photos,
				(select count(*) from payment_orders po where po.user_id = u.id and po.status = 'APPROVED') as total_approved_payments,
				(select coalesce(sum(coalesce(po.paid_amount_cents, po.amount_cents)), 0) from payment_orders po where po.user_id = u.id and po.status = 'APPROVED') as total_revenue_cents
			from users u
			where 1=1
			""" + where + """
			order by u.created_at desc
			limit :limit offset :offset
			""", params, (rs, rowNum) -> new AdminUserListItemDto(
			rs.getObject("id", UUID.class),
			rs.getString("name"),
			rs.getString("email"),
			UserRole.valueOf(rs.getString("role")),
			UserStatus.valueOf(rs.getString("status")),
			asLocalDateTime(rs.getObject("created_at")),
			asLocalDateTime(rs.getObject("last_login_at")),
			rs.getLong("total_events"),
			rs.getString("active_plan_code"),
			rs.getLong("total_photos"),
			rs.getLong("total_approved_payments"),
			rs.getLong("total_revenue_cents")
		));

		return toPage(content, normalizedPage, normalizedSize, total);
	}

	@Override
	public List<AdminUserEventDto> listUserEvents(UUID userId) {
		return jdbcTemplate.query("""
			select
				e.id as event_id,
				e.title,
				e.slug,
				e.type,
				e.status,
				e.plan_code,
				e.photo_limit,
				e.event_date,
				e.location,
				e.paid_at,
				e.created_at,
				(select count(*) from photos p where p.event_id = e.id and p.object_key is not null) as total_photos
			from events e
			where e.owner_id = :userId
			order by e.created_at desc
			""", new MapSqlParameterSource("userId", userId), (rs, rowNum) -> new AdminUserEventDto(
			rs.getObject("event_id", UUID.class),
			rs.getString("title"),
			rs.getString("slug"),
			Enum.valueOf(com.memora.core.domain.model.EventType.class, rs.getString("type")),
			EventStatus.valueOf(rs.getString("status")),
			rs.getString("plan_code"),
			asInteger(rs.getObject("photo_limit")),
			rs.getDate("event_date") == null ? null : rs.getDate("event_date").toLocalDate(),
			rs.getString("location"),
			rs.getLong("total_photos"),
			asLocalDateTime(rs.getObject("paid_at")),
			asLocalDateTime(rs.getObject("created_at"))
		));
	}

	@Override
	public List<AdminPaymentListItemDto> listUserPayments(UUID userId) {
		return jdbcTemplate.query("""
			select
				po.id as payment_order_id,
				u.email as user_email,
				u.name as user_name,
				e.title as event_title,
				po.plan_code,
				po.provider,
				po.status,
				po.amount_cents,
				po.paid_amount_cents,
				po.paid_at,
				po.created_at
			from payment_orders po
			join users u on u.id = po.user_id
			join events e on e.id = po.event_id
			where po.user_id = :userId
			order by po.created_at desc
			""", new MapSqlParameterSource("userId", userId), (rs, rowNum) -> new AdminPaymentListItemDto(
			rs.getObject("payment_order_id", UUID.class),
			rs.getString("user_email"),
			rs.getString("user_name"),
			rs.getString("event_title"),
			rs.getString("plan_code"),
			rs.getString("provider"),
			rs.getString("status"),
			rs.getInt("amount_cents"),
			(Integer) rs.getObject("paid_amount_cents"),
			asLocalDateTime(rs.getObject("paid_at")),
			asLocalDateTime(rs.getObject("created_at"))
		));
	}

	@Override
	public Map<String, Object> getUserSummary(UUID userId) {
		return jdbcTemplate.queryForMap("""
			select
				(select count(*) from events e where e.owner_id = :userId) as total_events,
				(select count(*) from photos p join events e2 on e2.id = p.event_id where e2.owner_id = :userId and p.object_key is not null) as total_photos,
				(select e.plan_code from events e where e.owner_id = :userId and e.plan_code is not null order by e.paid_at desc nulls last, e.created_at desc limit 1) as current_plan_code,
				(select count(*) from payment_orders po where po.user_id = :userId and po.status = 'APPROVED') as total_approved_payments,
				(select coalesce(sum(coalesce(po.paid_amount_cents, po.amount_cents)), 0) from payment_orders po where po.user_id = :userId and po.status = 'APPROVED') as total_revenue_cents
			""", new MapSqlParameterSource("userId", userId));
	}

	@Override
	public PageResponseDto<AdminPaymentListItemDto> listPayments(
		int page,
		int size,
		String status,
		String planCode,
		String provider,
		LocalDate dateFrom,
		LocalDate dateTo,
		String userEmail
	) {
		int normalizedPage = Math.max(page, 0);
		int normalizedSize = Math.min(Math.max(size, 1), 100);
		MapSqlParameterSource params = new MapSqlParameterSource()
			.addValue("limit", normalizedSize)
			.addValue("offset", normalizedPage * normalizedSize);
		String where = buildPaymentFilters(status, planCode, provider, dateFrom, dateTo, userEmail, params);
		long total = jdbcTemplate.queryForObject("""
			select count(*)
			from payment_orders po
			join users u on u.id = po.user_id
			join events e on e.id = po.event_id
			where 1=1
			""" + where, params, Long.class);

		List<AdminPaymentListItemDto> content = jdbcTemplate.query("""
			select
				po.id as payment_order_id,
				u.email as user_email,
				u.name as user_name,
				e.title as event_title,
				po.plan_code,
				po.provider,
				po.status,
				po.amount_cents,
				po.paid_amount_cents,
				po.paid_at,
				po.created_at
			from payment_orders po
			join users u on u.id = po.user_id
			join events e on e.id = po.event_id
			where 1=1
			""" + where + """
			order by po.created_at desc
			limit :limit offset :offset
			""", params, (rs, rowNum) -> new AdminPaymentListItemDto(
			rs.getObject("payment_order_id", UUID.class),
			rs.getString("user_email"),
			rs.getString("user_name"),
			rs.getString("event_title"),
			rs.getString("plan_code"),
			rs.getString("provider"),
			rs.getString("status"),
			rs.getInt("amount_cents"),
			(Integer) rs.getObject("paid_amount_cents"),
			asLocalDateTime(rs.getObject("paid_at")),
			asLocalDateTime(rs.getObject("created_at"))
		));

		return toPage(content, normalizedPage, normalizedSize, total);
	}

	@Override
	public AdminRevenueSummaryResponseDto getRevenueSummary() {
		Map<String, Object> summary = jdbcTemplate.queryForMap("""
			select
				(select coalesce(sum(coalesce(paid_amount_cents, amount_cents)), 0) from payment_orders where status = 'APPROVED') as gross_revenue_cents,
				(select coalesce(sum(coalesce(paid_amount_cents, amount_cents)), 0) from payment_orders where status = 'APPROVED' and paid_at >= :monthStart) as revenue_this_month_cents,
				(select coalesce(sum(coalesce(paid_amount_cents, amount_cents)), 0) from payment_orders where status = 'APPROVED' and paid_at >= :todayStart) as revenue_today_cents,
				(select count(*) from payment_orders where status = 'APPROVED') as approved_payments_count,
				(select count(*) from payment_orders where status = 'PENDING') as pending_payments_count,
				(select count(*) from payment_orders where status in ('FAILED', 'REJECTED', 'CANCELLED', 'EXPIRED')) as failed_payments_count
			""", new MapSqlParameterSource()
			.addValue("todayStart", LocalDate.now(ZoneOffset.UTC).atStartOfDay())
			.addValue("monthStart", LocalDate.now(ZoneOffset.UTC).withDayOfMonth(1).atStartOfDay()));

		List<AdminPlanMetricDto> revenueByPlan = jdbcTemplate.query("""
			select plan_code, coalesce(sum(coalesce(paid_amount_cents, amount_cents)), 0) as total
			from payment_orders
			where status = 'APPROVED'
			group by plan_code
			order by total desc
			""", (rs, rowNum) -> new AdminPlanMetricDto(rs.getString("plan_code"), rs.getLong("total")));

		return new AdminRevenueSummaryResponseDto(
			asLong(summary.get("gross_revenue_cents")),
			asLong(summary.get("revenue_this_month_cents")),
			asLong(summary.get("revenue_today_cents")),
			revenueByPlan,
			asLong(summary.get("approved_payments_count")),
			asLong(summary.get("pending_payments_count")),
			asLong(summary.get("failed_payments_count"))
		);
	}

	@Override
	public PageResponseDto<AdminEventListItemDto> listEvents(
		int page,
		int size,
		String status,
		String planCode,
		String ownerEmail,
		LocalDate dateFrom,
		LocalDate dateTo
	) {
		int normalizedPage = Math.max(page, 0);
		int normalizedSize = Math.min(Math.max(size, 1), 100);
		MapSqlParameterSource params = new MapSqlParameterSource()
			.addValue("limit", normalizedSize)
			.addValue("offset", normalizedPage * normalizedSize);
		String where = buildEventFilters(status, planCode, ownerEmail, dateFrom, dateTo, params);
		long total = jdbcTemplate.queryForObject("""
			select count(*)
			from events e
			join users u on u.id = e.owner_id
			where 1=1
			""" + where, params, Long.class);

		List<AdminEventListItemDto> content = jdbcTemplate.query("""
			select
				e.id as event_id,
				e.title,
				e.slug,
				u.name as owner_name,
				u.email as owner_email,
				e.status,
				e.plan_code,
				e.photo_limit,
				e.paid_at,
				e.created_at,
				(select count(*) from photos p where p.event_id = e.id and p.object_key is not null) as total_photos
			from events e
			join users u on u.id = e.owner_id
			where 1=1
			""" + where + """
			order by e.created_at desc
			limit :limit offset :offset
			""", params, (rs, rowNum) -> new AdminEventListItemDto(
			rs.getObject("event_id", UUID.class),
			rs.getString("title"),
			rs.getString("slug"),
			rs.getString("owner_name"),
			rs.getString("owner_email"),
			rs.getString("status"),
			rs.getString("plan_code"),
			asInteger(rs.getObject("photo_limit")),
			rs.getLong("total_photos"),
			asLocalDateTime(rs.getObject("paid_at")),
			asLocalDateTime(rs.getObject("created_at"))
		));

		return toPage(content, normalizedPage, normalizedSize, total);
	}

	@Override
	public long countApprovedPaymentsByUserId(UUID userId) {
		Long value = jdbcTemplate.queryForObject(
			"""
			select count(*)
			from payment_orders
			where user_id = :userId
			  and status = 'APPROVED'
			""",
			new MapSqlParameterSource("userId", userId),
			Long.class
		);
		return value == null ? 0L : value;
	}

	@Override
	public PageResponseDto<AdminAuditLogListItemDto> listAuditLogs(
		int page,
		int size,
		UUID adminUserId,
		String action,
		String targetType,
		UUID targetId,
		LocalDate dateFrom,
		LocalDate dateTo
	) {
		int normalizedPage = Math.max(page, 0);
		int normalizedSize = Math.min(Math.max(size, 1), 100);
		MapSqlParameterSource params = new MapSqlParameterSource()
			.addValue("limit", normalizedSize)
			.addValue("offset", normalizedPage * normalizedSize);
		String where = buildAuditFilters(adminUserId, action, targetType, targetId, dateFrom, dateTo, params);
		long total = jdbcTemplate.queryForObject("""
			select count(*)
			from admin_audit_logs l
			left join users u on u.id = l.admin_user_id
			where 1=1
			""" + where, params, Long.class);

		List<AdminAuditLogListItemDto> content = jdbcTemplate.query("""
			select
				l.id,
				l.created_at,
				l.admin_user_id,
				u.email as admin_email,
				l.action,
				l.target_type,
				l.target_id,
				l.target_email,
				l.reason,
				l.ip_address
			from admin_audit_logs l
			left join users u on u.id = l.admin_user_id
			where 1=1
			""" + where + """
			order by l.created_at desc
			limit :limit offset :offset
			""", params, (rs, rowNum) -> new AdminAuditLogListItemDto(
			rs.getObject("id", UUID.class),
			asLocalDateTime(rs.getObject("created_at")),
			rs.getObject("admin_user_id", UUID.class),
			rs.getString("admin_email"),
			rs.getString("action"),
			rs.getString("target_type"),
			rs.getObject("target_id", UUID.class),
			rs.getString("target_email"),
			rs.getString("reason"),
			rs.getString("ip_address")
		));

		return toPage(content, normalizedPage, normalizedSize, total);
	}

	@Override
	public AdminAffiliateMetricsSummaryResponseDto getAffiliateMetricsSummary(
		LocalDate dateFrom,
		LocalDate dateTo,
		UUID influencerId,
		UUID couponId
	) {
		MapSqlParameterSource summaryParams = new MapSqlParameterSource();
		String salesWhere = buildAffiliateSalesFilters(dateFrom, dateTo, influencerId, couponId, summaryParams, "po");
		Map<String, Object> summary = jdbcTemplate.queryForMap("""
			select
				coalesce(sum(coalesce(po.paid_amount_cents, po.final_amount_cents, po.amount_cents)), 0) as revenue_via_coupons_cents,
				count(*) as total_sales_via_coupons
			from payment_orders po
			where po.status = 'APPROVED'
			  and po.coupon_id is not null
			""" + salesWhere, summaryParams);

		MapSqlParameterSource pendingParams = new MapSqlParameterSource();
		String pendingWhere = buildCommissionBaseFilters(dateFrom, dateTo, influencerId, couponId, pendingParams, "rc");
		Long pendingCommission = jdbcTemplate.queryForObject("""
			select coalesce(sum(rc.commission_amount_cents), 0)
			from referral_commissions rc
			where rc.status in ('APPROVED', 'PAYABLE')
			""" + pendingWhere, pendingParams, Long.class);

		MapSqlParameterSource topParams = new MapSqlParameterSource();
		String topWhere = buildAffiliateSalesFilters(dateFrom, dateTo, influencerId, couponId, topParams, "po");
		List<AdminAffiliateMetricsSummaryResponseDto> topInfluencer = jdbcTemplate.query("""
			select
				i.id as influencer_id,
				i.name as influencer_name,
				count(*) as total_sales
			from payment_orders po
			join influencers i on i.id = po.influencer_id
			where po.status = 'APPROVED'
			  and po.coupon_id is not null
			""" + topWhere + """
			group by i.id, i.name
			order by total_sales desc, i.name asc
			limit 1
			""", topParams, (rs, rowNum) -> new AdminAffiliateMetricsSummaryResponseDto(
			0L,
			0L,
			0L,
			rs.getObject("influencer_id", UUID.class),
			rs.getString("influencer_name"),
			rs.getLong("total_sales")
		));

		AdminAffiliateMetricsSummaryResponseDto winner = topInfluencer.isEmpty()
			? new AdminAffiliateMetricsSummaryResponseDto(0L, 0L, 0L, null, null, 0L)
			: topInfluencer.getFirst();

		return new AdminAffiliateMetricsSummaryResponseDto(
			asLong(summary.get("revenue_via_coupons_cents")),
			asLong(summary.get("total_sales_via_coupons")),
			pendingCommission == null ? 0L : pendingCommission,
			winner.topInfluencerId(),
			winner.topInfluencerName(),
			winner.topInfluencerSales()
		);
	}

	@Override
	public List<AdminAffiliateInfluencerMetricDto> listAffiliateInfluencerMetrics(
		LocalDate dateFrom,
		LocalDate dateTo,
		UUID influencerId,
		UUID couponId,
		String commissionStatus
	) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("dateFrom", startOfDay(dateFrom));
		params.addValue("dateTo", endExclusive(dateTo));
		params.addValue("couponId", couponId);
		params.addValue("commissionStatus", normalizeNullableUpper(commissionStatus));
		String influencerFilter = influencerId == null ? "" : " where i.id = :influencerId";
		if (influencerId != null) {
			params.addValue("influencerId", influencerId);
		}

		return jdbcTemplate.query("""
			with sales_metrics as (
				select
					po.influencer_id,
					count(*) as approved_sales,
					coalesce(sum(coalesce(po.paid_amount_cents, po.final_amount_cents, po.amount_cents)), 0) as net_revenue_cents
				from payment_orders po
				where po.status = 'APPROVED'
				  and po.influencer_id is not null
				  and (:dateFrom is null or po.paid_at >= :dateFrom)
				  and (:dateTo is null or po.paid_at < :dateTo)
				  and (:couponId is null or po.coupon_id = :couponId)
				group by po.influencer_id
			),
			commission_metrics as (
				select
					rc.influencer_id,
					coalesce(sum(case when rc.status in ('APPROVED', 'PAYABLE') then rc.commission_amount_cents else 0 end), 0) as pending_commission_cents,
					coalesce(sum(case when rc.status = 'PAID' then rc.commission_amount_cents else 0 end), 0) as paid_commission_cents
				from referral_commissions rc
				where (:dateFrom is null or rc.created_at >= :dateFrom)
				  and (:dateTo is null or rc.created_at < :dateTo)
				  and (:couponId is null or rc.coupon_id = :couponId)
				  and (:commissionStatus is null or rc.status = :commissionStatus)
				group by rc.influencer_id
			)
			select
				i.id as influencer_id,
				i.name,
				i.instagram_handle,
				(
					select c.code
					from coupons c
					where c.influencer_id = i.id
					order by c.current_uses desc, c.created_at asc
					limit 1
				) as primary_coupon_code,
				coalesce(sm.approved_sales, 0) as approved_sales,
				coalesce(sm.net_revenue_cents, 0) as net_revenue_cents,
				coalesce(cm.pending_commission_cents, 0) as pending_commission_cents,
				coalesce(cm.paid_commission_cents, 0) as paid_commission_cents,
				i.status
			from influencers i
			left join sales_metrics sm on sm.influencer_id = i.id
			left join commission_metrics cm on cm.influencer_id = i.id
			""" + influencerFilter + """
			order by approved_sales desc, i.created_at desc
			""", params, (rs, rowNum) -> new AdminAffiliateInfluencerMetricDto(
			rs.getObject("influencer_id", UUID.class),
			rs.getString("name"),
			rs.getString("instagram_handle"),
			rs.getString("primary_coupon_code"),
			null,
			rs.getLong("approved_sales"),
			rs.getLong("net_revenue_cents"),
			rs.getLong("pending_commission_cents"),
			rs.getLong("paid_commission_cents"),
			InfluencerStatus.valueOf(rs.getString("status"))
		));
	}

	@Override
	public List<AdminAffiliateCouponMetricDto> listAffiliateCouponMetrics(
		LocalDate dateFrom,
		LocalDate dateTo,
		UUID influencerId,
		UUID couponId,
		String commissionStatus
	) {
		MapSqlParameterSource params = new MapSqlParameterSource()
			.addValue("dateFrom", startOfDay(dateFrom))
			.addValue("dateTo", endExclusive(dateTo))
			.addValue("influencerId", influencerId)
			.addValue("couponId", couponId)
			.addValue("commissionStatus", normalizeNullableUpper(commissionStatus));

		return jdbcTemplate.query("""
			with sales_metrics as (
				select
					po.coupon_id,
					count(*) as approved_sales,
					coalesce(sum(po.discount_amount_cents), 0) as discount_total_cents,
					coalesce(sum(coalesce(po.paid_amount_cents, po.final_amount_cents, po.amount_cents)), 0) as net_revenue_cents
				from payment_orders po
				where po.status = 'APPROVED'
				  and po.coupon_id is not null
				  and (:dateFrom is null or po.paid_at >= :dateFrom)
				  and (:dateTo is null or po.paid_at < :dateTo)
				  and (:influencerId is null or po.influencer_id = :influencerId)
				  and (:couponId is null or po.coupon_id = :couponId)
				group by po.coupon_id
			),
			commission_metrics as (
				select
					rc.coupon_id,
					coalesce(sum(rc.commission_amount_cents), 0) as commission_generated_cents
				from referral_commissions rc
				where (:dateFrom is null or rc.created_at >= :dateFrom)
				  and (:dateTo is null or rc.created_at < :dateTo)
				  and (:influencerId is null or rc.influencer_id = :influencerId)
				  and (:couponId is null or rc.coupon_id = :couponId)
				  and (:commissionStatus is null or rc.status = :commissionStatus)
				group by rc.coupon_id
			)
			select
				c.id as coupon_id,
				c.code,
				i.name as influencer_name,
				c.current_uses,
				coalesce(sm.approved_sales, 0) as approved_sales,
				coalesce(sm.discount_total_cents, 0) as discount_total_cents,
				coalesce(sm.net_revenue_cents, 0) as net_revenue_cents,
				coalesce(cm.commission_generated_cents, 0) as commission_generated_cents,
				c.status
			from coupons c
			left join influencers i on i.id = c.influencer_id
			left join sales_metrics sm on sm.coupon_id = c.id
			left join commission_metrics cm on cm.coupon_id = c.id
			where (:influencerId is null or c.influencer_id = :influencerId)
			  and (:couponId is null or c.id = :couponId)
			order by approved_sales desc, c.created_at desc
			""", params, (rs, rowNum) -> new AdminAffiliateCouponMetricDto(
			rs.getObject("coupon_id", UUID.class),
			rs.getString("code"),
			rs.getString("influencer_name"),
			rs.getInt("current_uses"),
			rs.getLong("approved_sales"),
			rs.getLong("discount_total_cents"),
			rs.getLong("net_revenue_cents"),
			rs.getLong("commission_generated_cents"),
			CouponStatus.valueOf(rs.getString("status"))
		));
	}

	@Override
	public AdminInfluencerPerformanceResponseDto getInfluencerPerformance(
		UUID influencerId,
		LocalDate dateFrom,
		LocalDate dateTo,
		UUID couponId,
		String commissionStatus
	) {
		MapSqlParameterSource baseParams = new MapSqlParameterSource()
			.addValue("influencerId", influencerId)
			.addValue("dateFrom", startOfDay(dateFrom))
			.addValue("dateTo", endExclusive(dateTo))
			.addValue("couponId", couponId)
			.addValue("commissionStatus", normalizeNullableUpper(commissionStatus));

		Map<String, Object> summary = jdbcTemplate.queryForMap("""
			select
				i.id,
				i.name,
				i.instagram_handle,
				i.email,
				i.pix_key,
				i.status,
				coalesce((
					select count(*)
					from payment_orders po
					where po.status = 'APPROVED'
					  and po.influencer_id = i.id
					  and (:dateFrom is null or po.paid_at >= :dateFrom)
					  and (:dateTo is null or po.paid_at < :dateTo)
					  and (:couponId is null or po.coupon_id = :couponId)
				), 0) as approved_sales,
				coalesce((
					select sum(coalesce(po.paid_amount_cents, po.final_amount_cents, po.amount_cents))
					from payment_orders po
					where po.status = 'APPROVED'
					  and po.influencer_id = i.id
					  and (:dateFrom is null or po.paid_at >= :dateFrom)
					  and (:dateTo is null or po.paid_at < :dateTo)
					  and (:couponId is null or po.coupon_id = :couponId)
				), 0) as net_revenue_cents,
				coalesce((
					select sum(case when rc.status in ('APPROVED', 'PAYABLE') then rc.commission_amount_cents else 0 end)
					from referral_commissions rc
					where rc.influencer_id = i.id
					  and (:dateFrom is null or rc.created_at >= :dateFrom)
					  and (:dateTo is null or rc.created_at < :dateTo)
					  and (:couponId is null or rc.coupon_id = :couponId)
					  and (:commissionStatus is null or rc.status = :commissionStatus)
				), 0) as pending_commission_cents,
				coalesce((
					select sum(case when rc.status = 'PAID' then rc.commission_amount_cents else 0 end)
					from referral_commissions rc
					where rc.influencer_id = i.id
					  and (:dateFrom is null or rc.created_at >= :dateFrom)
					  and (:dateTo is null or rc.created_at < :dateTo)
					  and (:couponId is null or rc.coupon_id = :couponId)
					  and (:commissionStatus is null or rc.status = :commissionStatus)
				), 0) as paid_commission_cents
			from influencers i
			where i.id = :influencerId
			""", baseParams);

		List<AdminCouponListItemDto> coupons = jdbcTemplate.query("""
			select
				c.id,
				c.code,
				c.influencer_id,
				i.name as influencer_name,
				c.discount_percent,
				c.commission_percent,
				c.status,
				c.starts_at,
				c.expires_at,
				c.max_uses,
				c.current_uses,
				c.created_at,
				c.updated_at
			from coupons c
			left join influencers i on i.id = c.influencer_id
			where c.influencer_id = :influencerId
			  and (:couponId is null or c.id = :couponId)
			order by c.created_at desc
			""", baseParams, (rs, rowNum) -> new AdminCouponListItemDto(
			rs.getObject("id", UUID.class),
			rs.getString("code"),
			rs.getObject("influencer_id", UUID.class),
			rs.getString("influencer_name"),
			rs.getInt("discount_percent"),
			asInteger(rs.getObject("commission_percent")),
			CouponStatus.valueOf(rs.getString("status")),
			asLocalDateTime(rs.getObject("starts_at")),
			asLocalDateTime(rs.getObject("expires_at")),
			asInteger(rs.getObject("max_uses")),
			rs.getInt("current_uses"),
			asLocalDateTime(rs.getObject("created_at")),
			asLocalDateTime(rs.getObject("updated_at"))
		));

		List<AdminAffiliateSaleListItemDto> sales = jdbcTemplate.query("""
			select
				po.id as payment_order_id,
				e.id as event_id,
				e.title as event_title,
				u.name as user_name,
				u.email as user_email,
				po.coupon_code,
				po.plan_code,
				po.original_amount_cents,
				po.discount_amount_cents,
				coalesce(po.paid_amount_cents, po.final_amount_cents, po.amount_cents) as net_amount_cents,
				po.paid_at,
				po.status
			from payment_orders po
			join events e on e.id = po.event_id
			join users u on u.id = po.user_id
			where po.influencer_id = :influencerId
			  and po.status = 'APPROVED'
			  and (:dateFrom is null or po.paid_at >= :dateFrom)
			  and (:dateTo is null or po.paid_at < :dateTo)
			  and (:couponId is null or po.coupon_id = :couponId)
			order by po.paid_at desc nulls last, po.created_at desc
			""", baseParams, (rs, rowNum) -> new AdminAffiliateSaleListItemDto(
			rs.getObject("payment_order_id", UUID.class),
			rs.getObject("event_id", UUID.class),
			rs.getString("event_title"),
			rs.getString("user_name"),
			rs.getString("user_email"),
			rs.getString("coupon_code"),
			rs.getString("plan_code"),
			rs.getInt("original_amount_cents"),
			rs.getInt("discount_amount_cents"),
			rs.getInt("net_amount_cents"),
			asLocalDateTime(rs.getObject("paid_at")),
			rs.getString("status")
		));

		List<AdminReferralCommissionListItemDto> commissions = jdbcTemplate.query("""
			select
				rc.id,
				rc.coupon_id,
				c.code as coupon_code,
				rc.payment_order_id,
				e.title as event_title,
				u.name as user_name,
				u.email as user_email,
				rc.net_amount_cents,
				rc.commission_amount_cents,
				rc.status,
				rc.created_at,
				rc.paid_at
			from referral_commissions rc
			join coupons c on c.id = rc.coupon_id
			join events e on e.id = rc.event_id
			join users u on u.id = rc.user_id
			where rc.influencer_id = :influencerId
			  and (:dateFrom is null or rc.created_at >= :dateFrom)
			  and (:dateTo is null or rc.created_at < :dateTo)
			  and (:couponId is null or rc.coupon_id = :couponId)
			  and (:commissionStatus is null or rc.status = :commissionStatus)
			order by rc.created_at desc
			""", baseParams, (rs, rowNum) -> new AdminReferralCommissionListItemDto(
			rs.getObject("id", UUID.class),
			rs.getObject("coupon_id", UUID.class),
			rs.getString("coupon_code"),
			rs.getObject("payment_order_id", UUID.class),
			rs.getString("event_title"),
			rs.getString("user_name"),
			rs.getString("user_email"),
			rs.getInt("net_amount_cents"),
			rs.getInt("commission_amount_cents"),
			ReferralCommissionStatus.valueOf(rs.getString("status")),
			asLocalDateTime(rs.getObject("created_at")),
			asLocalDateTime(rs.getObject("paid_at"))
		));

		return new AdminInfluencerPerformanceResponseDto(
			(UUID) summary.get("id"),
			(String) summary.get("name"),
			(String) summary.get("instagram_handle"),
			(String) summary.get("email"),
			(String) summary.get("pix_key"),
			InfluencerStatus.valueOf((String) summary.get("status")),
			asLong(summary.get("approved_sales")),
			asLong(summary.get("net_revenue_cents")),
			asLong(summary.get("pending_commission_cents")),
			asLong(summary.get("paid_commission_cents")),
			coupons,
			sales,
			commissions
		);
	}

	private <T> PageResponseDto<T> toPage(List<T> content, int page, int size, long total) {
		int totalPages = total == 0 ? 1 : (int) Math.ceil((double) total / size);
		return new PageResponseDto<>(content, page, size, total, totalPages, page >= totalPages - 1);
	}

	private String buildUserFilters(String search, String status, String role, LocalDate createdFrom, LocalDate createdTo, MapSqlParameterSource params) {
		StringBuilder where = new StringBuilder();
		if (search != null && !search.isBlank()) {
			where.append(" and (lower(u.name) like :search or lower(u.email) like :search)");
			params.addValue("search", "%" + search.trim().toLowerCase() + "%");
		}
		if (status != null && !status.isBlank()) {
			where.append(" and u.status = :status");
			params.addValue("status", status.trim().toUpperCase());
		}
		if (role != null && !role.isBlank()) {
			where.append(" and u.role = :role");
			params.addValue("role", role.trim().toUpperCase());
		}
		if (createdFrom != null) {
			where.append(" and u.created_at >= :createdFrom");
			params.addValue("createdFrom", createdFrom.atStartOfDay());
		}
		if (createdTo != null) {
			where.append(" and u.created_at < :createdTo");
			params.addValue("createdTo", createdTo.plusDays(1).atStartOfDay());
		}
		return where.toString();
	}

	private String buildPaymentFilters(String status, String planCode, String provider, LocalDate dateFrom, LocalDate dateTo, String userEmail, MapSqlParameterSource params) {
		StringBuilder where = new StringBuilder();
		if (status != null && !status.isBlank()) {
			where.append(" and po.status = :status");
			params.addValue("status", status.trim().toUpperCase());
		}
		if (planCode != null && !planCode.isBlank()) {
			where.append(" and po.plan_code = :planCode");
			params.addValue("planCode", planCode.trim().toUpperCase());
		}
		if (provider != null && !provider.isBlank()) {
			where.append(" and po.provider = :provider");
			params.addValue("provider", provider.trim().toUpperCase());
		}
		if (userEmail != null && !userEmail.isBlank()) {
			where.append(" and lower(u.email) like :userEmail");
			params.addValue("userEmail", "%" + userEmail.trim().toLowerCase() + "%");
		}
		if (dateFrom != null) {
			where.append(" and po.created_at >= :dateFrom");
			params.addValue("dateFrom", dateFrom.atStartOfDay());
		}
		if (dateTo != null) {
			where.append(" and po.created_at < :dateTo");
			params.addValue("dateTo", dateTo.plusDays(1).atStartOfDay());
		}
		return where.toString();
	}

	private String buildEventFilters(String status, String planCode, String ownerEmail, LocalDate dateFrom, LocalDate dateTo, MapSqlParameterSource params) {
		StringBuilder where = new StringBuilder();
		if (status != null && !status.isBlank()) {
			where.append(" and e.status = :status");
			params.addValue("status", status.trim().toUpperCase());
		}
		if (planCode != null && !planCode.isBlank()) {
			where.append(" and e.plan_code = :planCode");
			params.addValue("planCode", planCode.trim().toUpperCase());
		}
		if (ownerEmail != null && !ownerEmail.isBlank()) {
			where.append(" and lower(u.email) like :ownerEmail");
			params.addValue("ownerEmail", "%" + ownerEmail.trim().toLowerCase() + "%");
		}
		if (dateFrom != null) {
			where.append(" and e.created_at >= :dateFrom");
			params.addValue("dateFrom", dateFrom.atStartOfDay());
		}
		if (dateTo != null) {
			where.append(" and e.created_at < :dateTo");
			params.addValue("dateTo", dateTo.plusDays(1).atStartOfDay());
		}
		return where.toString();
	}

	private String buildAuditFilters(UUID adminUserId, String action, String targetType, UUID targetId, LocalDate dateFrom, LocalDate dateTo, MapSqlParameterSource params) {
		StringBuilder where = new StringBuilder();
		if (adminUserId != null) {
			where.append(" and l.admin_user_id = :adminUserId");
			params.addValue("adminUserId", adminUserId);
		}
		if (action != null && !action.isBlank()) {
			where.append(" and l.action = :action");
			params.addValue("action", action.trim().toUpperCase());
		}
		if (targetType != null && !targetType.isBlank()) {
			where.append(" and l.target_type = :targetType");
			params.addValue("targetType", targetType.trim().toUpperCase());
		}
		if (targetId != null) {
			where.append(" and l.target_id = :targetId");
			params.addValue("targetId", targetId);
		}
		if (dateFrom != null) {
			where.append(" and l.created_at >= :dateFrom");
			params.addValue("dateFrom", dateFrom.atStartOfDay());
		}
		if (dateTo != null) {
			where.append(" and l.created_at < :dateTo");
			params.addValue("dateTo", dateTo.plusDays(1).atStartOfDay());
		}
		return where.toString();
	}

	private String buildAffiliateSalesFilters(LocalDate dateFrom, LocalDate dateTo, UUID influencerId, UUID couponId, MapSqlParameterSource params, String alias) {
		StringBuilder where = new StringBuilder();
		if (dateFrom != null) {
			where.append(" and ").append(alias).append(".paid_at >= :dateFrom");
			params.addValue("dateFrom", dateFrom.atStartOfDay());
		}
		if (dateTo != null) {
			where.append(" and ").append(alias).append(".paid_at < :dateTo");
			params.addValue("dateTo", dateTo.plusDays(1).atStartOfDay());
		}
		if (influencerId != null) {
			where.append(" and ").append(alias).append(".influencer_id = :influencerId");
			params.addValue("influencerId", influencerId);
		}
		if (couponId != null) {
			where.append(" and ").append(alias).append(".coupon_id = :couponId");
			params.addValue("couponId", couponId);
		}
		return where.toString();
	}

	private String buildCommissionBaseFilters(LocalDate dateFrom, LocalDate dateTo, UUID influencerId, UUID couponId, MapSqlParameterSource params, String alias) {
		StringBuilder where = new StringBuilder();
		if (dateFrom != null) {
			where.append(" and ").append(alias).append(".created_at >= :dateFrom");
			params.addValue("dateFrom", dateFrom.atStartOfDay());
		}
		if (dateTo != null) {
			where.append(" and ").append(alias).append(".created_at < :dateTo");
			params.addValue("dateTo", dateTo.plusDays(1).atStartOfDay());
		}
		if (influencerId != null) {
			where.append(" and ").append(alias).append(".influencer_id = :influencerId");
			params.addValue("influencerId", influencerId);
		}
		if (couponId != null) {
			where.append(" and ").append(alias).append(".coupon_id = :couponId");
			params.addValue("couponId", couponId);
		}
		return where.toString();
	}

	private LocalDateTime startOfDay(LocalDate value) {
		return value == null ? null : value.atStartOfDay();
	}

	private LocalDateTime endExclusive(LocalDate value) {
		return value == null ? null : value.plusDays(1).atStartOfDay();
	}

	private String normalizeNullableUpper(String value) {
		if (value == null || value.isBlank()) {
			return null;
		}
		return value.trim().toUpperCase();
	}

	private long asLong(Object value) {
		return value == null ? 0L : ((Number) value).longValue();
	}

	private Integer asInteger(Object value) {
		return value == null ? null : ((Number) value).intValue();
	}

	private LocalDateTime asLocalDateTime(Object value) {
		if (value == null) {
			return null;
		}
		if (value instanceof LocalDateTime localDateTime) {
			return localDateTime;
		}
		if (value instanceof Timestamp timestamp) {
			return timestamp.toLocalDateTime();
		}
		return null;
	}
}
