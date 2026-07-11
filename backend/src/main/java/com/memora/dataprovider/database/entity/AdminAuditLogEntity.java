package com.memora.dataprovider.database.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Getter
@Setter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "admin_audit_logs")
public class AdminAuditLogEntity {

	@Id
	private UUID id;

	@Column(name = "admin_user_id", nullable = false)
	private UUID adminUserId;

	@Column(nullable = false)
	private String action;

	@Column(name = "target_type", nullable = false)
	private String targetType;

	@Column(name = "target_id")
	private UUID targetId;

	@Column(name = "target_email")
	private String targetEmail;

	@Column(columnDefinition = "text")
	private String reason;

	@JdbcTypeCode(SqlTypes.JSON)
	@Column(columnDefinition = "jsonb")
	private Map<String, Object> metadata;

	@Column(name = "ip_address")
	private String ipAddress;

	@Column(name = "user_agent", columnDefinition = "text")
	private String userAgent;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;
}
