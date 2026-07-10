package com.memora.core.usecase;

import com.memora.core.domain.model.EventInvitation;
import com.memora.core.domain.param.UpdateEventInvitationParam;

public interface UpdateEventInvitationUseCase { EventInvitation execute(UpdateEventInvitationParam param); }
