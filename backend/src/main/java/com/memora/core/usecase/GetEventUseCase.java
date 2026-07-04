package com.memora.core.usecase;

import com.memora.core.domain.model.Event;
import com.memora.core.domain.param.GetEventParam;

public interface GetEventUseCase {

	Event execute(GetEventParam param);
}
