package com.memora.dataprovider.database.repository;

import com.memora.dataprovider.database.entity.AdminAuditLogEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminAuditLogRepository extends JpaRepository<AdminAuditLogEntity, UUID> {
}
