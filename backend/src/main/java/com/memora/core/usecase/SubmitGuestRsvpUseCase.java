package com.memora.core.usecase;

import com.memora.core.domain.model.EventGuest;
import com.memora.core.domain.param.SubmitGuestRsvpParam;

public interface SubmitGuestRsvpUseCase { EventGuest execute(SubmitGuestRsvpParam param); }
