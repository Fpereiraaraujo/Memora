package com.memora.core.usecase;

import com.memora.core.domain.model.PublicInvitation;
import com.memora.core.domain.param.GetPublicInvitationParam;

public interface GetPublicInvitationUseCase { PublicInvitation execute(GetPublicInvitationParam param); }
