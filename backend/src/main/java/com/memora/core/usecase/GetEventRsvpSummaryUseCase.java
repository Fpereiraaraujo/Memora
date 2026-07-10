package com.memora.core.usecase;

import com.memora.core.domain.model.EventRsvpSummary;
import com.memora.core.domain.param.GetEventRsvpSummaryParam;

public interface GetEventRsvpSummaryUseCase { EventRsvpSummary execute(GetEventRsvpSummaryParam param); }
