package com.memora.core.usecase;

import com.memora.core.domain.model.EventInvitation;
import com.memora.core.domain.param.GetEventInvitationParam;

public interface GetEventInvitationUseCase { EventInvitation execute(GetEventInvitationParam param); }
