package com.memora.core.usecase;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.param.GetPublicEventParam;

public interface GetPublicEventUseCase {

	Event execute(GetPublicEventParam param);
}
